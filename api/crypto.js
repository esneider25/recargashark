import admin from 'firebase-admin';
import crypto from 'crypto';

// Initialize Firebase Admin securely
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://recargashark-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.error("Firebase Admin Error:", error);
  }
}

// ── AES-256-GCM Encryption ──
// ENCRYPTION_KEY must be set in Vercel env vars (32 bytes hex = 64 hex chars)
// Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function encrypt(text) {
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY not configured');
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  // Format: iv:authTag:ciphertext (all hex)
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY not configured');
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const parts = encryptedText.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted format');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Rate limiting
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 10;

export default async function handler(req, res) {
  // Rate Limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  if (rateLimit.has(ip)) {
    const data = rateLimit.get(ip);
    if (now - data.startTime > RATE_LIMIT_WINDOW) {
      rateLimit.set(ip, { count: 1, startTime: now });
    } else {
      data.count++;
      if (data.count > MAX_REQUESTS) {
        return res.status(429).json({ error: 'Too many requests' });
      }
      rateLimit.set(ip, data);
    }
  } else {
    rateLimit.set(ip, { count: 1, startTime: now });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  const origin = req.headers.origin;
  const allowedOrigins = ['https://recargashark.com', 'https://admin.recargashark.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://recargashark.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Verify Firebase auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { action, password, orderId } = req.body;

    // ── ACTION: ENCRYPT ──
    // Used when creating an order with an account password
    if (action === 'encrypt') {
      if (!password || typeof password !== 'string' || password.length > 200) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      const encrypted = encrypt(password);
      return res.status(200).json({ encrypted });
    }

    // ── ACTION: DECRYPT ──
    // Admin-only: decrypt a password to view it
    if (action === 'decrypt') {
      // Only admin can decrypt
      if (decodedToken.email !== 'adminshark@gmail.com') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid encrypted password' });
      }
      try {
        const decrypted = decrypt(password);
        return res.status(200).json({ decrypted });
      } catch (e) {
        // If decryption fails, the password might be stored in plain text (legacy)
        return res.status(200).json({ decrypted: password, legacy: true });
      }
    }

    return res.status(400).json({ error: 'Invalid action. Use "encrypt" or "decrypt".' });

  } catch (error) {
    console.error("Crypto API Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

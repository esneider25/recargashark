// ============================================================
// RecargaShark — Data Layer: Products, Categories, APIs & Config
// ============================================================

// ── Categories ──
const CATEGORIES = [
  { id: 'juegos', name: 'Juegos', icon: '🎮', color: '#7c4dff', gradient: 'linear-gradient(135deg, #7c4dff, #536dfe)' },
  { id: 'gift-card', name: 'Gift Cards', icon: '🎁', color: '#ff9800', gradient: 'linear-gradient(135deg, #ff9800, #ff5722)' },
  { id: 'streaming', name: 'Streaming', icon: '📺', color: '#e040fb', gradient: 'linear-gradient(135deg, #e040fb, #d500f9)' },
  { id: 'billeteras', name: 'Billeteras', icon: '💳', color: '#00e5c3', gradient: 'linear-gradient(135deg, #00e5c3, #00b89c)' }
];

// ── Exchange Rate ──
const EXCHANGE_RATE = {
  usdToBs: 58.50,
  lastUpdated: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
};

// ── Site Settings ──
const SITE_SETTINGS = {
  whatsapp: '+584120000000',
  instagram: 'https://instagram.com/recargashark',
  telegram: 'https://t.me/recargashark',
  schedule: 'Lunes a Domingo 8:00 AM – 11:00 PM'
};

// ── Messaging System ──
let MESSAGES = JSON.parse(localStorage.getItem('recargashark_messages') || '[]');

// ── Payment Methods ──
const PAYMENT_METHODS = [
  {
    id: 'pago-movil',
    name: 'Pago Móvil',
    icon: '📱',
    details: {
      banco: 'Banco Nacional de Crédito (BNC)',
      telefono: '0412-1234567',
      cedula: 'V-12345678',
      rif: 'J-12345678-9'
    }
  },
  {
    id: 'transferencia',
    name: 'Transferencia Bancaria',
    icon: '🏦',
    details: {
      banco: 'Banco Nacional de Crédito (BNC)',
      cuenta: '0191-0012-34-1234567890',
      titular: 'RecargaShark C.A.',
      rif: 'J-12345678-9'
    }
  },
  {
    id: 'binance',
    name: 'Binance Pay / USDT',
    icon: '💎',
    details: {
      binanceId: '123456789',
      red: 'TRC20 (Tron)',
      wallet: 'TXkzJ1234567890abcdef',
      nota: 'Enviar captura con ID de transacción'
    }
  }
];

// ── Telegram Bot Configuration ──
const TELEGRAM_CONFIG = {
  botToken: '8515103558:AAFMRrUiYRna3PbEbZogrIA-i7vIls0clbY',
  chatId: '6012452103',
  enabled: true,
  notifyNewOrder: true,
  notifyWithPhoto: true
};

// ── Anti-Spam Configuration ──
const SPAM_CONFIG = {
  maxOrdersPerHour: 5,
  maxOrdersPerDay: 15,
  cooldownMinutes: 30,
  blocklistEnabled: true
};

// ── Spam Tracker ──
const SPAM_TRACKER = {
  attempts: [],
  blocked: []
};

// ── API Configurations (up to 4 slots) ──
const API_CONFIGS = [
  {
    id: 'api-1',
    name: 'Pasarela de Pagos',
    baseUrl: '',
    apiKey: '',
    port: '443',
    enabled: false,
    description: 'Procesamiento de pagos en línea'
  },
  {
    id: 'api-2',
    name: 'WhatsApp Business API',
    baseUrl: '',
    apiKey: '',
    port: '443',
    enabled: false,
    description: 'Notificaciones automáticas de pedidos'
  },
  {
    id: 'api-3',
    name: 'Crypto Payments',
    baseUrl: '',
    apiKey: '',
    port: '443',
    enabled: false,
    description: 'Pagos con criptomonedas (USDT, BTC)'
  },
  {
    id: 'api-4',
    name: 'API Personalizada',
    baseUrl: '',
    apiKey: '',
    port: '8080',
    enabled: false,
    description: 'Endpoint personalizado para integraciones'
  }
];

// ── Discount Codes ──
const DISCOUNT_CODES = [];

// ── Products Catalog ──
const PRODUCTS = [
  {
    id: 'free-fire',
    name: 'Free Fire',
    category: 'juegos',
    currency: 'Diamantes',
    currencyIcon: '💎',
    imageUrl: '',
    color: '#ff9800',
    colorGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
    description: 'Recarga diamantes para Free Fire. Entrega inmediata.',
    popular: true,
    packages: [
      { amount: 100, priceUsd: 1.09, label: '100 Diamantes' },
      { amount: 310, priceUsd: 3.19, label: '310 Diamantes' },
      { amount: 520, priceUsd: 5.29, label: '520 Diamantes' },
      { amount: 1060, priceUsd: 10.49, label: '1060 Diamantes' },
      { amount: 2180, priceUsd: 20.99, label: '2180 Diamantes' },
      { amount: 5600, priceUsd: 52.99, label: '5600 Diamantes' }
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'juegos',
    currency: 'UC',
    currencyIcon: '🪙',
    imageUrl: '',
    color: '#f5c518',
    colorGradient: 'linear-gradient(135deg, #f5c518, #e6a800)',
    description: 'Compra UC para PUBG Mobile. Proceso rápido y seguro.',
    popular: true,
    packages: [
      { amount: 60, priceUsd: 0.99, label: '60 UC' },
      { amount: 325, priceUsd: 4.99, label: '325 UC' },
      { amount: 660, priceUsd: 9.99, label: '660 UC' },
      { amount: 1800, priceUsd: 24.99, label: '1800 UC' },
      { amount: 3850, priceUsd: 49.99, label: '3850 UC' },
      { amount: 8100, priceUsd: 99.99, label: '8100 UC' }
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'juegos',
    currency: 'Robux',
    currencyIcon: 'R$',
    imageUrl: '',
    color: '#00b2ff',
    colorGradient: 'linear-gradient(135deg, #00b2ff, #0066ff)',
    description: 'Obtén Robux mediante códigos de regalo. Entrega por código.',
    popular: true,
    packages: [
      { amount: 400, priceUsd: 4.99, label: '400 Robux' },
      { amount: 800, priceUsd: 9.99, label: '800 Robux' },
      { amount: 1700, priceUsd: 19.99, label: '1700 Robux' },
      { amount: 4500, priceUsd: 49.99, label: '4500 Robux' },
      { amount: 10000, priceUsd: 99.99, label: '10000 Robux' }
    ]
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    category: 'juegos',
    currency: 'Diamantes',
    currencyIcon: '💠',
    imageUrl: '',
    color: '#7c4dff',
    colorGradient: 'linear-gradient(135deg, #7c4dff, #536dfe)',
    description: 'Recarga diamantes para Mobile Legends: Bang Bang.',
    popular: false,
    packages: [
      { amount: 56, priceUsd: 1.09, label: '56 Diamantes' },
      { amount: 172, priceUsd: 3.09, label: '172 Diamantes' },
      { amount: 257, priceUsd: 4.59, label: '257 Diamantes' },
      { amount: 706, priceUsd: 12.49, label: '706 Diamantes' },
      { amount: 2010, priceUsd: 34.99, label: '2010 Diamantes' },
      { amount: 4452, priceUsd: 74.99, label: '4452 Diamantes' }
    ]
  },
  {
    id: 'cod-mobile',
    name: 'Call of Duty Mobile',
    category: 'juegos',
    currency: 'CP',
    currencyIcon: '🎯',
    imageUrl: '',
    color: '#4caf50',
    colorGradient: 'linear-gradient(135deg, #4caf50, #00c853)',
    description: 'COD Points para Call of Duty Mobile. Entrega directa.',
    popular: false,
    packages: [
      { amount: 80, priceUsd: 0.99, label: '80 CP' },
      { amount: 400, priceUsd: 4.99, label: '400 CP' },
      { amount: 800, priceUsd: 9.99, label: '800 CP' },
      { amount: 2000, priceUsd: 24.99, label: '2000 CP' },
      { amount: 5000, priceUsd: 49.99, label: '5000 CP' },
      { amount: 10800, priceUsd: 99.99, label: '10800 CP' }
    ]
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    category: 'juegos',
    currency: 'Genesis Crystals',
    currencyIcon: '✨',
    imageUrl: '',
    color: '#e040fb',
    colorGradient: 'linear-gradient(135deg, #e040fb, #d500f9)',
    description: 'Genesis Crystals para Genshin Impact vía top-up center.',
    popular: false,
    packages: [
      { amount: 60, priceUsd: 0.99, label: '60 Cristales' },
      { amount: 330, priceUsd: 4.99, label: '330 Cristales' },
      { amount: 980, priceUsd: 14.99, label: '980 Cristales' },
      { amount: 1980, priceUsd: 29.99, label: '1980 Cristales' },
      { amount: 3280, priceUsd: 49.99, label: '3280 Cristales' },
      { amount: 6480, priceUsd: 99.99, label: '6480 Cristales' }
    ]
  },
  {
    id: 'blood-strike',
    name: 'Blood Strike',
    category: 'juegos',
    currency: 'Gold',
    currencyIcon: '🥇',
    imageUrl: '',
    color: '#f44336',
    colorGradient: 'linear-gradient(135deg, #f44336, #d32f2f)',
    description: 'Recarga Gold para Blood Strike. Proceso seguro.',
    popular: false,
    isNew: true,
    packages: [
      { amount: 60, priceUsd: 0.99, label: '60 Gold' },
      { amount: 300, priceUsd: 4.99, label: '300 Gold' },
      { amount: 980, priceUsd: 14.99, label: '980 Gold' },
      { amount: 1980, priceUsd: 29.99, label: '1980 Gold' },
      { amount: 4280, priceUsd: 59.99, label: '4280 Gold' }
    ]
  },
  // ── Gift Cards ──
  {
    id: 'google-play',
    name: 'Google Play',
    category: 'gift-card',
    currency: 'USD',
    currencyIcon: '🟢',
    imageUrl: '',
    color: '#34a853',
    colorGradient: 'linear-gradient(135deg, #34a853, #0d652d)',
    description: 'Tarjeta de regalo Google Play para apps, juegos y más.',
    popular: true,
    packages: [
      { amount: 5, priceUsd: 5.50, label: '$5 USD' },
      { amount: 10, priceUsd: 10.80, label: '$10 USD' },
      { amount: 25, priceUsd: 26.50, label: '$25 USD' },
      { amount: 50, priceUsd: 52.50, label: '$50 USD' },
      { amount: 100, priceUsd: 104.00, label: '$100 USD' }
    ]
  },
  {
    id: 'itunes',
    name: 'iTunes / Apple',
    category: 'gift-card',
    currency: 'USD',
    currencyIcon: '🍎',
    imageUrl: '',
    color: '#a2aaad',
    colorGradient: 'linear-gradient(135deg, #a2aaad, #555555)',
    description: 'Tarjeta Apple para App Store, iTunes, Apple Music y más.',
    popular: false,
    packages: [
      { amount: 5, priceUsd: 5.80, label: '$5 USD' },
      { amount: 10, priceUsd: 11.00, label: '$10 USD' },
      { amount: 25, priceUsd: 27.00, label: '$25 USD' },
      { amount: 50, priceUsd: 53.50, label: '$50 USD' },
      { amount: 100, priceUsd: 106.00, label: '$100 USD' }
    ]
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'gift-card',
    currency: 'USD',
    currencyIcon: '🎮',
    imageUrl: '',
    color: '#1b2838',
    colorGradient: 'linear-gradient(135deg, #1b2838, #2a475e)',
    description: 'Tarjeta de regalo Steam para juegos de PC.',
    popular: false,
    isNew: true,
    packages: [
      { amount: 5, priceUsd: 5.50, label: '$5 USD' },
      { amount: 10, priceUsd: 10.80, label: '$10 USD' },
      { amount: 20, priceUsd: 21.50, label: '$20 USD' },
      { amount: 50, priceUsd: 53.00, label: '$50 USD' },
      { amount: 100, priceUsd: 105.00, label: '$100 USD' }
    ]
  },
  // ── Streaming ──
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    currency: 'Mes',
    currencyIcon: '🎬',
    imageUrl: '',
    color: '#e50914',
    colorGradient: 'linear-gradient(135deg, #e50914, #831010)',
    description: 'Suscripción Netflix. Activa tu cuenta al instante.',
    popular: true,
    packages: [
      { amount: 1, priceUsd: 6.99, label: '1 Mes Básico' },
      { amount: 1, priceUsd: 15.49, label: '1 Mes Estándar' },
      { amount: 1, priceUsd: 22.99, label: '1 Mes Premium' }
    ]
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'streaming',
    currency: 'Mes',
    currencyIcon: '🎵',
    imageUrl: '',
    color: '#1db954',
    colorGradient: 'linear-gradient(135deg, #1db954, #158a3d)',
    description: 'Spotify Premium individual. Música sin anuncios.',
    popular: false,
    packages: [
      { amount: 1, priceUsd: 4.99, label: '1 Mes Individual' },
      { amount: 3, priceUsd: 13.99, label: '3 Meses Individual' },
      { amount: 1, priceUsd: 7.99, label: '1 Mes Familiar' }
    ]
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'streaming',
    currency: 'Mes',
    currencyIcon: '🏰',
    imageUrl: '',
    color: '#113ccf',
    colorGradient: 'linear-gradient(135deg, #113ccf, #0b1d6e)',
    description: 'Disney+ para películas y series Disney, Marvel, Star Wars.',
    popular: false,
    isNew: true,
    packages: [
      { amount: 1, priceUsd: 7.99, label: '1 Mes Básico' },
      { amount: 1, priceUsd: 13.99, label: '1 Mes Premium' }
    ]
  },
  // ── Billeteras ──
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'billeteras',
    currency: 'USD',
    currencyIcon: '💙',
    imageUrl: '',
    color: '#003087',
    colorGradient: 'linear-gradient(135deg, #003087, #009cde)',
    description: 'Recarga de saldo PayPal para compras internacionales.',
    popular: false,
    packages: [
      { amount: 5, priceUsd: 5.80, label: '$5 USD' },
      { amount: 10, priceUsd: 11.20, label: '$10 USD' },
      { amount: 25, priceUsd: 27.50, label: '$25 USD' },
      { amount: 50, priceUsd: 54.00, label: '$50 USD' },
      { amount: 100, priceUsd: 107.00, label: '$100 USD' }
    ]
  },
  {
    id: 'binance-wallet',
    name: 'Binance',
    category: 'billeteras',
    currency: 'USDT',
    currencyIcon: '🔶',
    imageUrl: '',
    color: '#f0b90b',
    colorGradient: 'linear-gradient(135deg, #f0b90b, #c99a09)',
    description: 'Recarga USDT a tu cuenta Binance. Red TRC20.',
    popular: false,
    packages: [
      { amount: 10, priceUsd: 10.50, label: '10 USDT' },
      { amount: 25, priceUsd: 26.00, label: '25 USDT' },
      { amount: 50, priceUsd: 51.50, label: '50 USDT' },
      { amount: 100, priceUsd: 102.00, label: '100 USDT' }
    ]
  }
];

// ── Backward compatibility: alias GAMES → PRODUCTS ──
const GAMES = PRODUCTS;

// ── Helper Functions ──
function usdToBs(usd) {
  return (usd * EXCHANGE_RATE.usdToBs).toFixed(2);
}

function formatBs(amount) {
  return parseFloat(amount).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateOrderRef() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return 'RS-' + randomNum;
}

function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'todos') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === categoryId);
}

function getCategoryById(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId);
}

// ── Data Arrays for Firebase ──
let ORDERS = [];
let QUICK_REPLIES = [];

window.DATA_LOADED = false;

function initFirebaseData() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded yet.');
    setTimeout(initFirebaseData, 100);
    return;
  }

  const db = firebase.database();

  if (!window.__firebaseAuthHooked) {
    window.__firebaseAuthHooked = true;
    firebase.auth().onAuthStateChanged(user => {
      // If user logs in after data was loaded, reload to get protected data
      if (user) {
        setTimeout(initFirebaseData, 500);
      }
    });
  }

  const keysToLoad = ['products', 'categories', 'payment_methods', 'exchange_rate', 'settings', 'api_configs', 'discounts', 'messages', 'orders', 'telegram_config', 'quick_replies', 'spam_tracker', 'order_counter'];
  const loadedKeys = new Set();

  function checkLoadComplete(key) {
    loadedKeys.add(key);
    if (loadedKeys.size >= keysToLoad.length && !window.DATA_LOADED) {
      window.DATA_LOADED = true;
      if (typeof renderApp === 'function') renderApp();
      if (typeof initAdminApp === 'function') initAdminApp();
    } else if (window.DATA_LOADED) {
      if (typeof renderApp === 'function' && typeof appState !== 'undefined' && appState.currentView === 'home') renderApp();
      if (typeof renderActiveTab === 'function') renderActiveTab();
    }
  }

  keysToLoad.forEach(key => {
    db.ref('/' + key).off('value');
    db.ref('/' + key).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (key === 'products') { PRODUCTS.length = 0; data.forEach(p => PRODUCTS.push(p)); }
        else if (key === 'categories') { CATEGORIES.length = 0; data.forEach(c => CATEGORIES.push(c)); }
        else if (key === 'payment_methods') { PAYMENT_METHODS.length = 0; data.forEach(p => PAYMENT_METHODS.push(p)); }
        else if (key === 'exchange_rate') Object.assign(EXCHANGE_RATE, data);
        else if (key === 'settings') Object.assign(SITE_SETTINGS, data);
        else if (key === 'api_configs') { API_CONFIGS.length = 0; data.forEach(a => API_CONFIGS.push(a)); }
        else if (key === 'discounts') { DISCOUNT_CODES.length = 0; data.forEach(d => DISCOUNT_CODES.push(d)); }
        else if (key === 'messages') {
          if (!data) MESSAGES = [];
          else if (Array.isArray(data)) MESSAGES = data.filter(Boolean);
          else MESSAGES = Object.values(data);
        }
        else if (key === 'orders') {
          if (!data) ORDERS = [];
          else if (Array.isArray(data)) ORDERS = data.filter(Boolean);
          else ORDERS = Object.values(data);
          ORDERS.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        else if (key === 'telegram_config') Object.assign(TELEGRAM_CONFIG, data);
        else if (key === 'quick_replies') QUICK_REPLIES = data;
        else if (key === 'spam_tracker') {
          SPAM_TRACKER.attempts = data.attempts || [];
          SPAM_TRACKER.blocked = data.blocked || [];
        }
        else if (key === 'order_counter') localStorage.setItem('recargashark_order_counter', data.toString());
      }
      // Mark as loaded
      checkLoadComplete(key);
    }, (error) => {
      // If permission denied (e.g. public trying to read orders), ignore and continue loading
      console.warn('Acceso denegado a ' + key + ' (normal si no es admin)');
      checkLoadComplete(key);
    });
  });
}

initFirebaseData();


function saveToDb(path, data) {
  if (typeof firebase !== 'undefined') {
    const cleanData = JSON.parse(JSON.stringify(data));
    firebase.database().ref(path).set(cleanData)
      .catch(err => console.error("Firebase write error on " + path + ":", err));
  }
}

// ── Product Types (applied after localStorage load) ──
const PRODUCT_TYPE_MAP = {
  'free-fire': 'game-id', 'pubg-mobile': 'game-id', 'roblox': 'game-id',
  'mobile-legends': 'game-id', 'cod-mobile': 'game-id', 'genshin-impact': 'game-id',
  'blood-strike': 'game-id',
  'google-play': 'code', 'itunes': 'code', 'steam': 'code',
  'netflix': 'account', 'spotify': 'account', 'disney-plus': 'account',
  'paypal': 'account', 'binance-wallet': 'account'
};
PRODUCTS.forEach(p => { if (!p.type) p.type = PRODUCT_TYPE_MAP[p.id] || 'game-id'; });

// ── Order Statuses ──
const ORDER_STATUSES = {
  'pending': { label: 'Pendiente', icon: '📋', color: '#ffb74d', bg: 'rgba(255,183,77,0.15)' },
  'processing': { label: 'Procesando', icon: '⚙️', color: '#42a5f5', bg: 'rgba(66,165,245,0.15)' },
  'completed': { label: 'Completado', icon: '✅', color: '#66bb6a', bg: 'rgba(102,187,106,0.15)' },
  'rejected': { label: 'Rechazado', icon: '❌', color: '#ef5350', bg: 'rgba(239,83,80,0.15)' },
  'invalid-id': { label: 'ID Inválido', icon: '⚠️', color: '#ffa726', bg: 'rgba(255,167,38,0.15)' }
};

// ── Discounts CRUD ──
function getDiscounts() {
  return DISCOUNT_CODES;
}

function saveDiscounts() {
  saveToDb('discounts', DISCOUNT_CODES);
}

function createDiscount(code, type, value) {
  const newCode = code.trim().toUpperCase();
  if (DISCOUNT_CODES.some(d => d.code === newCode)) return false;
  DISCOUNT_CODES.push({
    code: newCode,
    type: type, // 'percentage' or 'fixed'
    value: parseFloat(value),
    active: true,
    createdAt: new Date().toISOString()
  });
  saveDiscounts();
  return true;
}

function deleteDiscount(code) {
  const index = DISCOUNT_CODES.findIndex(d => d.code === code);
  if (index !== -1) {
    DISCOUNT_CODES.splice(index, 1);
    saveDiscounts();
  }
}

function validateDiscount(code) {
  const target = code.trim().toUpperCase();
  return DISCOUNT_CODES.find(d => d.code === target && d.active);
}

// ── Settings CRUD ──
function getSettings() {
  return SITE_SETTINGS;
}

function saveSettings(newSettings) {
  Object.assign(SITE_SETTINGS, newSettings);
  saveToDb('settings', SITE_SETTINGS);
}

// ── Messages CRUD ──
function getMessages() {
  return MESSAGES;
}

function getMessagesForSession(sessionId) {
  const conv = MESSAGES.find(m => m.sessionId === sessionId);
  return conv ? conv.messages : [];
}

function addMessage(sessionId, sender, text, contact = null) {
  let conv = MESSAGES.find(m => m.sessionId === sessionId);
  if (!conv) {
    conv = {
      sessionId: sessionId,
      contact: contact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      hasUnreadAdmin: false,
      hasUnreadUser: false
    };
    MESSAGES.push(conv);
  } else if (contact) {
    conv.contact = contact;
  }

  if (text) {
    conv.messages.push({
      id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      sender: sender, // 'user' or 'admin' or 'bot'
      text: text,
      timestamp: new Date().toISOString()
    });
  }
  conv.updatedAt = new Date().toISOString();

  if (sender === 'user') {
    conv.hasUnreadAdmin = true;
  } else {
    conv.hasUnreadUser = true;
  }

  saveMessages();
}

function markMessagesAsRead(sessionId, reader) {
  const conv = MESSAGES.find(m => m.sessionId === sessionId);
  if (conv) {
    let changed = false;
    if (reader === 'admin' && conv.hasUnreadAdmin) {
      conv.hasUnreadAdmin = false;
      changed = true;
    }
    if (reader === 'user' && conv.hasUnreadUser) {
      conv.hasUnreadUser = false;
      changed = true;
    }
    if (changed) saveMessages();
  }
}

function saveMessages() {
  saveToDb('messages', MESSAGES);
}

// ── Orders CRUD ──
function getOrders() {
  return ORDERS;
}

function saveOrders(orders) {
  ORDERS = orders;
}

function saveOrderToDb(order) {
  if (typeof firebase !== 'undefined' && order && order.id) {
    const cleanOrder = JSON.parse(JSON.stringify(order));
    firebase.database().ref('orders/' + order.id).set(cleanOrder)
      .catch(err => console.error("Firebase write error:", err));
  }
}

function removeOrderFromDb(orderId) {
  if (typeof firebase !== 'undefined' && orderId) {
    firebase.database().ref('orders/' + orderId).remove();
  }
}

function createOrder(data) {
  const orders = getOrders();
  const order = {
    id: generateOrderRef(),
    userId: data.userId || null,
    userName: data.userName || null,
    productId: data.productId,
    productName: data.productName,
    productType: data.productType || 'game-id',
    packageLabel: data.packageLabel,
    apiProductId: data.apiProductId,
    apiProvider: data.apiProvider,
    priceUsd: data.priceUsd,
    priceBs: data.priceBs,
    paymentMethodId: data.paymentMethodId,
    paymentMethodName: data.paymentMethodName,
    customerContact: data.customerContact || '',
    gameId: data.gameId || '',
    accountEmail: data.accountEmail || '',
    accountPassword: data.accountPassword || '',
    ocrNumbers: data.ocrNumbers || [],
    discountCode: data.discountCode || null,
    discountValue: data.discountValue || 0,
    discountType: data.discountType || null,
    status: 'pending',
    adminNote: '',
    statusHistory: [
      { status: 'pending', timestamp: new Date().toISOString(), note: 'Pedido recibido' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(order);
  saveOrderToDb(order);
  ORDERS = orders;
  return order;
}

function getOrderById(orderId) {
  return getOrders().find(o => o.id === orderId);
}

function updateOrderStatus(orderId, newStatus, note) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  order.status = newStatus;
  if (note) order.adminNote = note;
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || (ORDER_STATUSES[newStatus]?.label || '')
  });
  order.updatedAt = new Date().toISOString();
  saveOrderToDb(order);
  ORDERS = orders;
  return order;
}

function getOrdersByStatus(status) {
  const orders = getOrders();
  return (!status || status === 'all') ? orders : orders.filter(o => o.status === status);
}

function getPendingOrdersCount() {
  return getOrders().filter(o => o.status === 'pending' || o.status === 'processing').length;
}

function deleteOrder(orderId) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) { orders.splice(idx, 1); removeOrderFromDb(orderId); ORDERS = orders; return true; }
  return false;
}

// ── Anti-Spam Functions ──
function getDeviceFingerprint() {
  const nav = navigator;
  const raw = [nav.userAgent, screen.width, screen.height, nav.language, nav.hardwareConcurrency || ''].join('|');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) { hash = ((hash << 5) - hash) + raw.charCodeAt(i); hash |= 0; }
  return 'fp-' + Math.abs(hash).toString(36);
}

function saveSpamTracker() {
  saveToDb('spam_tracker', SPAM_TRACKER);
}

function isUserBlocked() {
  if (!SPAM_CONFIG.blocklistEnabled) return false;
  const fp = getDeviceFingerprint();
  const now = Date.now();
  // Clean expired blocks
  SPAM_TRACKER.blocked = SPAM_TRACKER.blocked.filter(b => new Date(b.until).getTime() > now);
  saveSpamTracker();
  return SPAM_TRACKER.blocked.some(b => b.fingerprint === fp);
}

function getBlockedUntil() {
  const fp = getDeviceFingerprint();
  const block = SPAM_TRACKER.blocked.find(b => b.fingerprint === fp);
  if (!block) return null;
  return new Date(block.until);
}

function checkSpamLimit() {
  const fp = getDeviceFingerprint();
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  const oneDayAgo = now - (24 * 60 * 60 * 1000);

  // Clean old attempts (older than 24h)
  SPAM_TRACKER.attempts = SPAM_TRACKER.attempts.filter(a => new Date(a.timestamp).getTime() > oneDayAgo);

  const myAttempts = SPAM_TRACKER.attempts.filter(a => a.fingerprint === fp);
  const hourlyAttempts = myAttempts.filter(a => new Date(a.timestamp).getTime() > oneHourAgo);
  const dailyAttempts = myAttempts;

  if (hourlyAttempts.length >= SPAM_CONFIG.maxOrdersPerHour || dailyAttempts.length >= SPAM_CONFIG.maxOrdersPerDay) {
    // Block user
    const until = new Date(now + SPAM_CONFIG.cooldownMinutes * 60 * 1000).toISOString();
    if (!SPAM_TRACKER.blocked.some(b => b.fingerprint === fp)) {
      SPAM_TRACKER.blocked.push({ fingerprint: fp, until, reason: 'Exceso de pedidos', timestamp: new Date().toISOString() });
    }
    saveSpamTracker();
    return false; // Blocked
  }
  return true; // Allowed
}

function recordOrderAttempt() {
  SPAM_TRACKER.attempts.push({
    fingerprint: getDeviceFingerprint(),
    timestamp: new Date().toISOString()
  });
  saveSpamTracker();
}

function unblockUser(fingerprint) {
  SPAM_TRACKER.blocked = SPAM_TRACKER.blocked.filter(b => b.fingerprint !== fingerprint);
  saveSpamTracker();
}

function blockUserForFraud(fingerprint, reason = 'Fraude detectado (Pago Duplicado)') {
  const until = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year ban
  if (!SPAM_TRACKER.blocked.some(b => b.fingerprint === fingerprint)) {
    SPAM_TRACKER.blocked.push({ fingerprint, until, reason, timestamp: new Date().toISOString() });
    saveSpamTracker();
  }
}

function getBlockedUsers() {
  const now = Date.now();
  SPAM_TRACKER.blocked = SPAM_TRACKER.blocked.filter(b => new Date(b.until).getTime() > now);
  saveSpamTracker();
  return SPAM_TRACKER.blocked;
}

// ── Telegram API Functions ──
function saveTelegramConfig() {
  saveToDb('telegram_config', TELEGRAM_CONFIG);
}

async function sendTelegramMessage(text, inlineKeyboard) {
  if (!TELEGRAM_CONFIG.enabled || !TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) return false;
  try {
    const body = {
      chat_id: TELEGRAM_CONFIG.chatId,
      text: text,
      parse_mode: 'HTML'
    };
    if (inlineKeyboard) {
      body.reply_markup = JSON.stringify({ inline_keyboard: inlineKeyboard });
    }
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return data.ok;
  } catch (e) {
    console.warn('Telegram sendMessage error:', e);
    return false;
  }
}

async function sendTelegramPhoto(photoBlob, caption, inlineKeyboard) {
  if (!TELEGRAM_CONFIG.enabled || !TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) return false;
  try {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CONFIG.chatId);
    formData.append('photo', photoBlob, 'comprobante.jpg');
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    if (inlineKeyboard) {
      formData.append('reply_markup', JSON.stringify({ inline_keyboard: inlineKeyboard }));
    }
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.ok;
  } catch (e) {
    console.warn('Telegram sendPhoto error:', e);
    return false;
  }
}

function buildOrderTelegramMessage(order) {
  const typeLabels = { 'game-id': '🎮 Por ID', 'account': '🔐 Interna', 'code': '🎫 Código' };
  const typeLabel = typeLabels[order.productType] || '🎮 Por ID';
  let msg = `🦈 <b>NUEVO PEDIDO — #${order.id}</b>\n\n`;
  msg += `📦 <b>Producto:</b> ${order.productName}\n`;
  msg += `📋 <b>Paquete:</b> ${order.packageLabel}\n`;
  msg += `💰 <b>Precio:</b> $${order.priceUsd.toFixed(2)} USD | Bs. ${formatBs(order.priceBs)}\n`;
  msg += `💳 <b>Pago:</b> ${order.paymentMethodName}\n`;
  msg += `🏷️ <b>Tipo:</b> ${typeLabel}\n`;
  if (order.productType === 'game-id' && order.gameId) {
    msg += `🎮 <b>Game ID:</b> <code>${order.gameId}</code>\n`;
  } else if (order.productType === 'account') {
    msg += `📧 <b>Email:</b> <code>${order.accountEmail || 'N/A'}</code>\n`;
    msg += `🔒 <b>Contraseña:</b> <code>${order.accountPassword || 'N/A'}</code>\n`;
  }
  msg += `📱 <b>Contacto:</b> ${order.customerContact}\n`;
  msg += `🕐 <b>Fecha:</b> ${new Date(order.createdAt).toLocaleString('es-VE')}\n`;
  return msg;
}

function buildOrderKeyboard(orderId) {
  const adminUrl = 'https://admin.recargashark.com/admin.html';
  return [
    [
      { text: '✅ Aprobar', url: `${adminUrl}?action=approve&order=${orderId}` },
      { text: '❌ Rechazar', url: `${adminUrl}?action=reject&order=${orderId}` }
    ],
    [
      { text: '👁️ Ver Detalle', url: `${adminUrl}?action=view&order=${orderId}` }
    ]
  ];
}

// ── Quick Replies CRUD ──
function getQuickReplies() {
  if (QUICK_REPLIES.length > 0) return QUICK_REPLIES;

  // Default values if empty
  const defaults = [
    { id: 'precios', title: '💰 Precios', keywords: 'precio,tasa,costo', response: '📊 La tasa actual es: 1 USD = Bs. ' + EXCHANGE_RATE.usdToBs + '. Puedes ver los precios de cada producto directamente en el catálogo.' },
    { id: 'pagos', title: '💳 Pagos', keywords: 'pago,pagar,transferencia,problema', response: '💳 Aceptamos Pago Móvil, Binance Pay y Transferencias. Si tuviste un problema con tu pago, por favor aguarda en línea.' },
    { id: 'pedido', title: '⏳ Pedido', keywords: 'pedido,estado,rastrear', response: '📡 Para ver el estado de tu pedido, ve a la sección "🔍 Mis Pedidos" e ingresa tu número de referencia.' },
    { id: 'juegos', title: '🎮 Productos', keywords: 'producto,disponible,juego', response: '🎮 Tenemos un amplio catálogo de productos en categorías como juegos, gift cards, streaming y billeteras. ¡Explora la página principal!' }
  ];
  saveQuickReplies(defaults);
  return defaults;
}

function saveQuickReplies(replies) {
  QUICK_REPLIES = replies;
  saveToDb('quick_replies', replies);
}

function addQuickReply(title, keywords, response) {
  const replies = getQuickReplies();
  replies.push({
    id: 'qr-' + Date.now(),
    title,
    keywords,
    response
  });
  saveQuickReplies(replies);
}

function deleteQuickReply(id) {
  let replies = getQuickReplies();
  replies = replies.filter(r => r.id !== id);
  saveQuickReplies(replies);
}

function updateQuickReply(id, title, keywords, response) {
  const replies = getQuickReplies();
  const index = replies.findIndex(r => r.id === id);
  if (index !== -1) {
    replies[index] = { ...replies[index], title, keywords, response };
    saveQuickReplies(replies);
  }
}


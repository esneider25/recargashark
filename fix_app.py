import re
with open(r'c:\Users\IK\Documents\GitHub\recargashark\js\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The current broken file has:
# function previewScreenshot(input) { ... up to ... 1448:         // Si no encontró nada con las palabras claves, usar fallback a cualquier número largo
# 1449:         if (numbers.length === 0) { ... and ends before removeScreenshot

# We will just replace everything from "// ── Screenshot Upload & Telegram ──" down to "function removeScreenshot"
start_str = "// ── Screenshot Upload & Telegram ──"
end_str = "function removeScreenshot(event) {"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_func = """// ── Screenshot Upload & Telegram ──
function previewScreenshot(input) {
  const file = input.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('⚠️ La captura no debe superar los 5MB');
    input.value = '';
    return;
  }

  const previewContainer = document.getElementById('screenshot-preview');
  if (previewContainer) {
    previewContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--accent);">
        <div class="pf-spinner" style="width: 30px; height: 30px; margin: 0 auto 10px;">
          <div class="pf-spinner-ring"></div>
        </div>
        <div style="font-size: 0.85rem; opacity: 0.8;">Analizando captura (Anti-Fraude)...</div>
      </div>
    `;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    const dataUrl = e.target.result;
    
    appState.selectedScreenshot = file;
    
    // ── IMAGE HASH CHECK (Exact duplicate file detection) ──
    let imgHashNum = 0;
    const step = Math.max(1, Math.floor(dataUrl.length / 100000));
    for (let i = 0; i < dataUrl.length; i += step) {
      imgHashNum = ((imgHashNum << 5) - imgHashNum) + dataUrl.charCodeAt(i);
      imgHashNum |= 0;
    }
    const imageHash = 'img-' + Math.abs(imgHashNum).toString(36) + '-' + file.size;
    appState.selectedScreenshotHash = imageHash;

    const orders = getOrders();
    let duplicateFound = orders.some(o => o.status !== 'rejected' && o.imageHash === imageHash);
    
    // OCR Check for duplicates (Catches cropped/compressed images)
    if (!duplicateFound && window.Tesseract) {
      try {
        const { data: { text } } = await Tesseract.recognize(dataUrl, 'spa');
        
        // Buscar específicamente referencias o números de operación
        let numbers = [];
        const regexKeywords = /(?:ref(?:erencia)?|operaci[oó]n|orden|recibo|comprobante|autorizaci[oó]n|folio|transacci[oó]n|nro|n[uú]mero\\s+de\\s+operaci[oó]n)[\\s:.\\-#\\n]*([A-Za-z0-9]{5,20})/gi;
        let match;
        while ((match = regexKeywords.exec(text)) !== null) {
          numbers.push(match[1]);
        }
        
        if (numbers.length > 0) {
          for (const num of numbers) {
            // Check if any previous order (not rejected) has this exact number string in its OCR data
            if (orders.some(o => o.status !== 'rejected' && o.ocrNumbers && o.ocrNumbers.includes(num))) {
              duplicateFound = true;
              break;
            }
          }
        }
        
        // Save OCR numbers to state to attach to order later
        appState.selectedScreenshotOcr = numbers;

      } catch (err) {
        console.error('OCR analysis failed:', err);
      }
    }
    
    if (duplicateFound) {
      showToast('🚨 PAGO DUPLICADO: Esta captura ya fue procesada anteriormente.');
      
      const fp = getDeviceFingerprint();
      blockUserForFraud(fp);
      sendTelegramMessage(`🚨 <b>ALERTA DE FRAUDE:</b>\\nUn cliente intentó re-utilizar un comprobante de pago ya procesado.\\nFingerprint: <code>${fp}</code>\\nEl usuario ha sido bloqueado preventivamente.`);
      
      appState.selectedScreenshot = null;
      appState.selectedScreenshotOcr = null;
      appState.selectedScreenshotHash = null;
      input.value = '';
      
      if (previewContainer) {
        previewContainer.innerHTML = `
          <div class="screenshot-placeholder" style="border-color: var(--coral);">
            <span style="font-size: 2rem;">🚨</span>
            <span class="screenshot-hint" style="color: var(--coral);">Captura duplicada rechazada</span>
          </div>
        `;
      }
      return; // Stop execution
    }

    if (previewContainer) {
      previewContainer.innerHTML = `
        <div class="screenshot-preview-wrapper" style="position: relative; border-radius: var(--radius); overflow: hidden;">
          <img src="${dataUrl}" class="screenshot-img-preview" alt="Vista previa" style="width: 100%; display: block;">
          <div class="screenshot-remove-overlay" onclick="removeScreenshot(event)" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; opacity: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
            <span>❌ Eliminar</span>
          </div>
        </div>
      `;
    }
  };
  reader.readAsDataURL(file);
}

"""
    new_content = content[:start_idx] + new_func + content[end_idx:]
    with open(r'c:\Users\IK\Documents\GitHub\recargashark\js\app.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed!")
else:
    print("Could not find start or end markers.")

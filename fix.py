import sys

filename = r'c:\Users\IK\Documents\GitHub\recargashark\js\components.js'
with open(filename, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "function renderTermsModal()" in line:
        start_idx = i
        break

if start_idx == -1:
    print("Could not find renderTermsModal")
    sys.exit(1)

end_idx = -1
for i in range(start_idx, len(lines)):
    line = lines[i]
    if "function renderSupportWidget()" in line:
        end_idx = i
        break

if end_idx == -1:
    print("Could not find renderSupportWidget")
    sys.exit(1)

correct_code = """function renderTermsModal() {
  const termsData = typeof getSettings === 'function' ? getSettings().termsAndConditions : null;
  let termsHtmlContent = '';
  
  if (Array.isArray(termsData)) {
    termsHtmlContent = termsData.map((t, i) => `
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed rgba(255,255,255,0.05);">
        <h4 style="color: ${t.titleColor || '#00e5c3'}; margin-bottom: 10px; font-size: 1.15rem; display: flex; align-items: center; gap: 8px;">
          <span style="background: rgba(0, 229, 195, 0.1); padding: 4px 10px; border-radius: 8px; font-size: 0.9rem;">${i + 1}</span> 
          ${t.title}
        </h4>
        <p style="color: ${t.descColor || '#e2e8f0'}; margin: 0; line-height: 1.6; white-space: pre-wrap;">${t.desc}</p>
      </div>
    `).join('');
  } else if (typeof termsData === 'string') {
    termsHtmlContent = termsData;
  } else {
    termsHtmlContent = '<h4>Términos y Condiciones</h4><p>Al utilizar nuestros servicios aceptas las reglas de la tienda.</p>';
  }

  return `
    <div id="terms-modal-container">
      <div class="modal-overlay active" style="z-index: 10000; backdrop-filter: blur(8px); background: rgba(6, 13, 26, 0.85);">
        <div class="modal" style="max-width: 600px; max-height: 85vh; display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <div style="padding: 24px; border-bottom: 1px solid var(--border); background: var(--bg-surface);">
            <h2 style="margin: 0; color: var(--text-primary); display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.8rem;">📜</span> Términos y Condiciones
            </h2>
          </div>
          <div style="padding: 24px; overflow-y: auto; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; background: var(--bg-deep);">
            ${termsHtmlContent}
          </div>
          <div style="padding: 20px 24px; border-top: 1px solid var(--border); background: var(--bg-surface); text-align: center;">
            <p style="margin-bottom: 16px; font-size: 0.9rem; color: var(--text-muted);">Debes aceptar los términos para poder continuar y realizar compras.</p>
            <button type="button" class="btn-primary" onclick="window.acceptTerms(); return false;" style="width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 229, 195, 0.2); cursor: pointer; position: relative; z-index: 10001;">
              Acepto los Términos y Condiciones ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.acceptTerms = function() {
  try {
    console.log('acceptTerms called');
    sessionStorage.setItem('recargaaccessplay_terms_accepted', 'true');
    sessionStorage.setItem('recargashark_terms_accepted', 'true');
    localStorage.setItem('recargashark_terms_accepted', 'true');
  } catch (e) {
    console.error('sessionStorage error', e);
  }
  const container = document.getElementById('terms-modal-container');
  if (container) {
    container.style.display = 'none';
    setTimeout(() => {
      container.remove();
      const config = typeof getSettings === 'function' ? getSettings() : {};
      if (config.announcementEnabled && (config.announcementMessage || config.announcementImageUrl)) {
        if (typeof showAnnouncementModal === 'function') {
          showAnnouncementModal(config);
        }
      }
    }, 100);
  }
};
"""

new_lines = lines[:start_idx] + [correct_code + "\n"] + lines[end_idx:]

with open(filename, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("File updated successfully")

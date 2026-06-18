// ============================================================
// RecargaShark — Main App Logic & SPA Routing (v2 + Orders)
// ============================================================

// ── State ──
const appState = {
  currentView: 'home',        // 'home' | 'product' | 'tracking' | 'lookup'
  selectedProductId: null,
  selectedPackageIndex: null,
  selectedPaymentId: null,
  selectedCategory: 'todos',
  trackingOrderId: null,
  appliedDiscount: null,
  historyContactStr: null
};

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('recargashark_theme') === 'light') {
    document.body.classList.add('light-theme');
  }
  renderApp();
  initScrollEffects();
  initCounters();
});

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('recargashark_theme', isLight ? 'light' : 'dark');
}

// ── Render ──
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;
  
  if (!window.DATA_LOADED) {
    app.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="tracking-spinner" style="font-size: 3rem;">🦈</div>
        <h2 style="margin-top: 20px; color: var(--accent);">Conectando...</h2>
      </div>
    `;
    return;
  }

  const config = typeof getSettings === 'function' ? getSettings() : {};
  if (config.maintenance) {
    app.innerHTML = `
      <div class="bg-ocean-grid" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;">${typeof renderBubbles === 'function' ? renderBubbles() : ''}</div>
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
        <div style="font-size: 5rem; margin-bottom: 20px;">🚧</div>
        <h1 style="color: var(--text-primary); margin-bottom: 10px;">Estamos en Mantenimiento</h1>
        <p style="color: var(--text-secondary); max-width: 500px; font-size: 1.1rem; line-height: 1.6;">
          Estamos actualizando nuestros precios y productos para brindarte un mejor servicio.<br>
          <b style="color: var(--accent);">¡Regresamos en unos minutos!</b>
        </p>
      </div>
    `;
    return;
  }

  const termsAccepted = localStorage.getItem('recargashark_terms_accepted');
  const termsHtml = !termsAccepted ? (typeof renderTermsModal === 'function' ? renderTermsModal() : '') : '';

  if (appState.currentView === 'home') {
    app.innerHTML = `
      <div class="bg-ocean-grid">${renderBubbles()}</div>
      ${renderNavbar()}
      <div class="app-container">
        ${renderHero()}
        ${renderPromoCarousel()}
        ${renderHowItWorks()}
        ${renderCatalogSection(appState.selectedCategory)}
        ${renderFeaturesSection()}
        ${renderFAQ()}
        ${renderFooter()}
      </div>
      ${renderSupportWidget()}
      ${termsHtml}
    `;
    requestAnimationFrame(() => {
      initCounters();
      initScrollObserver();
    });
  } else if (appState.currentView === 'product') {
    app.innerHTML = `
      <div class="bg-ocean-grid">${renderBubbles()}</div>
      ${renderNavbar()}
      <div class="app-container">
        ${renderProductDetail(appState.selectedProductId)}
        ${renderFooter()}
      </div>
      ${renderSupportWidget()}
      ${termsHtml}
    `;
  } else if (appState.currentView === 'tracking') {
    app.innerHTML = `
      <div class="bg-ocean-grid">${renderBubbles()}</div>
      ${renderNavbar()}
      <div class="app-container">
        ${renderOrderTracking(appState.trackingOrderId)}
        ${renderFooter()}
      </div>
      ${renderSupportWidget()}
      ${termsHtml}
    `;
  } else if (appState.currentView === 'lookup') {
    app.innerHTML = `
      <div class="bg-ocean-grid">${renderBubbles()}</div>
      ${renderNavbar()}
      <div class="app-container">
        ${renderOrderLookup()}
        ${renderFooter()}
      </div>
      ${renderSupportWidget()}
      ${termsHtml}
    `;
  } else if (appState.currentView === 'history') {
    const orders = getOrders().filter(o => 
      o.customerContact && appState.historyContactStr && 
      o.customerContact.toLowerCase().includes(appState.historyContactStr.toLowerCase())
    );
    app.innerHTML = `
      <div class="bg-ocean-grid">${renderBubbles()}</div>
      ${renderNavbar()}
      <div class="app-container">
        ${renderOrderHistoryList(orders, appState.historyContactStr)}
        ${renderFooter()}
      </div>
      ${renderSupportWidget()}
      ${termsHtml}
    `;
  }
}

// ── Terms ──
function acceptTerms() {
  localStorage.setItem('recargashark_terms_accepted', 'true');
  const modal = document.getElementById('terms-modal-overlay');
  if (modal) {
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

// ── Navigation ──
function navigateTo(view, param) {
  if (view === 'home') {
    appState.currentView = 'home';
    appState.selectedProductId = null;
    appState.selectedPackageIndex = null;
    appState.selectedPaymentId = null;
    appState.trackingOrderId = null;
  } else if (view === 'product') {
    appState.currentView = 'product';
    appState.selectedProductId = param;
    appState.selectedPackageIndex = null;
    appState.selectedPaymentId = null;
  } else if (view === 'tracking') {
    appState.currentView = 'tracking';
    appState.trackingOrderId = param;
  } else if (view === 'lookup') {
    appState.currentView = 'lookup';
    appState.trackingOrderId = null;
  } else if (view === 'history') {
    appState.currentView = 'history';
    appState.historyContactStr = param;
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const nav = document.getElementById('nav-links');
  if (nav) nav.classList.remove('open');
}

function scrollToSection(sectionId) {
  if (appState.currentView !== 'home') {
    navigateTo('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return;
  }
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const nav = document.getElementById('nav-links');
  if (nav) nav.classList.remove('open');
}

function toggleMobileMenu() {
  const nav = document.getElementById('nav-links');
  if (nav) nav.classList.toggle('open');
}

// ── Search ──
function handleProductSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  
  const filteredProducts = PRODUCTS.filter(p => {
    if (appState.selectedCategory !== 'todos' && p.category !== appState.selectedCategory) return false;
    return p.name.toLowerCase().includes(searchTerm) || 
           (p.description && p.description.toLowerCase().includes(searchTerm));
  });
  
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-surface); border-radius: 12px;">No se encontraron productos que coincidan con tu búsqueda.</div>';
  } else {
    productsGrid.innerHTML = filteredProducts.map((product, index) => {
      const category = CATEGORIES.find(c => c.id === product.category);
      const delay = (index % 10) * 0.05;
      const minPrice = Math.min(...product.packages.map(p => p.priceUsd));
      
      const iconHtml = product.imageUrl 
        ? `<img src="${product.imageUrl}" class="product-icon-img" alt="${product.name}" onerror="this.onerror=null; this.outerHTML='<div class=\\'product-icon\\'>${product.currencyIcon}</div>'">`
        : `<div class="product-icon">${product.currencyIcon}</div>`;
        
      return `
        <div class="product-card fade-in-up" style="animation-delay: ${delay}s" onclick="navigateTo('product', '${product.id}')">
          <div class="product-card-bg" style="background: ${product.colorGradient || 'linear-gradient(135deg, var(--accent), var(--accent-hover))'}"></div>
          ${product.popular ? '<div class="product-badge badge-popular">🔥 Popular</div>' : ''}
          ${product.isNew ? '<div class="product-badge badge-new">✨ Nuevo</div>' : ''}
          ${iconHtml}
          <div class="product-info">
            <div class="product-category" style="color: ${category ? category.color : 'var(--text-muted)'}">
              ${category ? category.icon + ' ' + category.name : ''}
            </div>
            <h3>${product.name}</h3>
            <div class="product-price">Desde Bs. ${formatBs(usdToBs(minPrice))}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ── Category Filtering ──
function filterCategory(categoryId) {
  appState.selectedCategory = categoryId;
  const catalogContainer = document.getElementById('catalog');
  if (catalogContainer) {
    const parent = catalogContainer.parentElement;
    const newCatalog = document.createElement('div');
    newCatalog.innerHTML = renderCatalogSection(categoryId);
    const newSection = newCatalog.firstElementChild;

    catalogContainer.style.opacity = '0';
    catalogContainer.style.transform = 'translateY(10px)';

    setTimeout(() => {
      parent.replaceChild(newSection, catalogContainer);
      requestAnimationFrame(() => {
        newSection.style.opacity = '1';
        newSection.style.transform = 'translateY(0)';
        initScrollObserver();
      });
    }, 200);
  }
}

// ── Package Selection ──
function selectPackage(productId, index) {
  appState.selectedPackageIndex = index;
  document.querySelectorAll('.package-card').forEach(card => card.classList.remove('selected'));
  const selected = document.getElementById(`pkg-${productId}-${index}`);
  if (selected) selected.classList.add('selected');
  const form = document.getElementById('order-form');
  if (form) {
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  updateOrderSummary();
}

// ── Payment Selection ──
function selectPayment(methodId) {
  appState.selectedPaymentId = methodId;
  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
  const selected = document.getElementById(`pay-${methodId}`);
  if (selected) selected.classList.add('selected');
  const container = document.getElementById('payment-details-container');
  if (container) container.innerHTML = renderPaymentDetails(methodId);
  updateOrderSummary();
}

// ── Discounts ──
function applyDiscount() {
  const input = document.getElementById('discount-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  input.value = code; // Force uppercase in input
  
  if (!code) {
    appState.appliedDiscount = null;
    updateOrderSummary();
    return;
  }

  const discount = validateDiscount(code);
  if (!discount) {
    showToast('⚠️ Código de descuento inválido o inactivo');
    appState.appliedDiscount = null;
    updateOrderSummary();
    return;
  }

  appState.appliedDiscount = discount;
  showToast('✅ Cupón aplicado correctamente');
  updateOrderSummary();
}

function calculateDiscountAmount(originalUsd, discount) {
  if (!discount) return 0;
  if (discount.type === 'percentage') {
    return originalUsd * (discount.value / 100);
  } else if (discount.type === 'fixed') {
    return Math.min(originalUsd, discount.value); // Cannot discount more than the price
  }
  return 0;
}

// ── Order Summary ──
function updateOrderSummary() {
  const product = PRODUCTS.find(g => g.id === appState.selectedProductId);
  const pkg = appState.selectedPackageIndex !== null ? product?.packages[appState.selectedPackageIndex] : null;
  const method = PAYMENT_METHODS.find(m => m.id === appState.selectedPaymentId);
  const summary = document.getElementById('order-summary');
  const btn = document.getElementById('btn-submit');
  if (product && pkg && method) {
    summary.innerHTML = renderOrderSummary(product, pkg, method, appState.appliedDiscount);
    summary.style.display = 'block';
    btn.disabled = false;
  } else {
    summary.innerHTML = '';
    btn.disabled = true;
  }
}

// ── Submit Order — Creates real order + redirects to tracking ──
function submitOrder() {
  // Anti-spam checks DISABLED as per user request
  /*
  if (isUserBlocked()) {
    const blockedUntil = getBlockedUntil();
    const timeStr = blockedUntil ? blockedUntil.toLocaleTimeString() : 'más tarde';
    showToast(`⛔ Demasiados pedidos. Acceso bloqueado temporalmente hasta ${timeStr}.`);
    return;
  }

  if (!checkSpamLimit()) {
    showToast('⛔ Has realizado demasiados intentos. Bloqueado temporalmente.');
    const fp = getDeviceFingerprint();
    sendTelegramMessage(`⚠️ <b>ALERTA ANTI-SPAM:</b> Un usuario ha sido bloqueado.\nFingerprint: <code>${fp}</code>\nUser-Agent: ${navigator.userAgent}`);
    return;
  }
  */

  const product = PRODUCTS.find(g => g.id === appState.selectedProductId);
  if (!product) return;
  const productType = product.type || 'game-id';

  // Validate contact
  const contactInput = document.getElementById('customer-contact');
  if (!contactInput || !contactInput.value.trim()) {
    showToast('⚠️ Ingresa tu teléfono o correo de contacto');
    contactInput?.focus();
    return;
  }

  // Validate type-specific fields
  let gameId = '';
  let accountEmail = '';
  let accountPassword = '';

  if (productType === 'game-id') {
    const uidInput = document.getElementById('game-uid');
    if (!uidInput || !uidInput.value.trim()) {
      showToast('⚠️ Ingresa tu ID del juego');
      uidInput?.focus();
      return;
    }
    gameId = uidInput.value.trim();
  } else if (productType === 'game-id-zone') {
    const uidInput = document.getElementById('game-uid');
    const zoneInput = document.getElementById('game-zone');
    if (!uidInput || !uidInput.value.trim()) {
      showToast('⚠️ Ingresa el Player ID');
      uidInput?.focus();
      return;
    }
    if (!zoneInput || !zoneInput.value.trim()) {
      showToast('⚠️ Ingresa el Zone ID');
      zoneInput?.focus();
      return;
    }
    gameId = `ID: ${uidInput.value.trim()} | Zona: ${zoneInput.value.trim()}`;
  } else if (productType === 'account') {
    const emailInput = document.getElementById('account-email');
    const passInput = document.getElementById('account-password');
    if (!emailInput || !emailInput.value.trim()) {
      showToast('⚠️ Ingresa el correo o usuario de la cuenta');
      emailInput?.focus();
      return;
    }
    if (!passInput || !passInput.value.trim()) {
      showToast('⚠️ Ingresa la contraseña de la cuenta');
      passInput?.focus();
      return;
    }
    accountEmail = emailInput.value.trim();
    accountPassword = passInput.value.trim();
  }

  if (appState.selectedPackageIndex === null) {
    showToast('⚠️ Selecciona un paquete');
    return;
  }
  if (!appState.selectedPaymentId) {
    showToast('⚠️ Selecciona un método de pago');
    return;
  }
  if (!appState.selectedScreenshot) {
    showToast('⚠️ Sube la captura del comprobante de pago');
    document.getElementById('screenshot-upload')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      document.getElementById('screenshot-upload')?.classList.add('error-shake');
      setTimeout(() => document.getElementById('screenshot-upload')?.classList.remove('error-shake'), 500);
    }, 300);
    return;
  }

  const pkg = product.packages[appState.selectedPackageIndex];
  const method = PAYMENT_METHODS.find(m => m.id === appState.selectedPaymentId);
  
  let finalUsd = pkg.priceUsd;
  let discountCode = null;
  let discountValue = 0;
  let discountType = null;

  if (appState.appliedDiscount) {
    const dAmount = calculateDiscountAmount(pkg.priceUsd, appState.appliedDiscount);
    finalUsd = Math.max(0, pkg.priceUsd - dAmount);
    discountCode = appState.appliedDiscount.code;
    discountValue = appState.appliedDiscount.value;
    discountType = appState.appliedDiscount.type;
  }

  const priceBs = parseFloat(usdToBs(finalUsd));

  // Create the order
  const order = createOrder({
    productId: product.id,
    productName: product.name,
    productType: productType,
    packageLabel: pkg.label,
    apiProductId: pkg.apiServiceId,
    apiProvider: product.apiProvider,
    priceUsd: finalUsd,
    priceBs: priceBs,
    paymentMethodId: method.id,
    paymentMethodName: method.name,
    paymentCurrency: method.currency || 'bs',
    customerContact: contactInput.value.trim(),
    gameId: gameId,
    accountEmail: accountEmail,
    accountPassword: accountPassword,
    ocrNumbers: appState.selectedScreenshotOcr || [],
    discountCode: discountCode,
    discountValue: discountValue,
    discountType: discountType
  });

  recordOrderAttempt();

  // Handle Telegram notification in the background
  triggerTelegramNotification(order);

  // Show success animation then redirect to tracking
  showOrderConfirmation(order);
}

function showOrderConfirmation(order) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  modalContainer.innerHTML = `
    <div class="modal-overlay active" id="modal-overlay">
      <div class="modal payment-flow-modal">
        <div class="payment-flow-steps" id="payment-flow-steps">
          <div class="pf-steps-bar">
            <div class="pf-step-indicator active" id="pf-ind-1">
              <div class="pf-step-dot">1</div>
              <span>Registrando</span>
            </div>
            <div class="pf-step-line" id="pf-line-1"></div>
            <div class="pf-step-indicator" id="pf-ind-2">
              <div class="pf-step-dot">2</div>
              <span>Guardando</span>
            </div>
            <div class="pf-step-line" id="pf-line-2"></div>
            <div class="pf-step-indicator" id="pf-ind-3">
              <div class="pf-step-dot">3</div>
              <span>Listo</span>
            </div>
          </div>

          <div class="pf-step-content active" id="pf-content-1">
            <div class="pf-spinner">
              <div class="pf-spinner-ring"></div>
              <span class="pf-spinner-icon">📋</span>
            </div>
            <h3>Registrando Pedido</h3>
            <p>Estamos registrando tu pedido en el sistema...</p>
          </div>

          <div class="pf-step-content" id="pf-content-2">
            <div class="pf-processing">
              <div class="pf-progress-bar">
                <div class="pf-progress-fill" id="pf-progress-fill"></div>
              </div>
              <span class="pf-processing-icon">⚙️</span>
            </div>
            <h3>Guardando Datos</h3>
            <p>Tu pedido ha sido registrado correctamente...</p>
          </div>

          <div class="pf-step-content" id="pf-content-3">
            <div class="pf-success">
              <div class="pf-check-circle">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#00e5c3" stroke-width="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div class="pf-confetti" id="pf-confetti"></div>
            </div>
            <h3>¡Pedido Registrado!</h3>
            <p>Tu pedido ha sido registrado. Puedes rastrear su estado en tiempo real.</p>
            <div class="modal-ref">${order.id}</div>
            <div class="pf-completed-info">
              <div class="pf-info-row">
                <span>📋 Referencia</span>
                <span class="pf-ref-code">${order.id}</span>
              </div>
              <div class="pf-info-row">
                <span>⏱️ Estado</span>
                <span class="pf-status-badge">Pendiente de verificación</span>
              </div>
            </div>
            <button class="btn-primary pf-done-btn" onclick="goToTracking('${order.id}')">
              📡 Ver Estado del Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  // Animate through steps
  setTimeout(() => {
    advanceToStep(2);
    setTimeout(() => {
      const fill = document.getElementById('pf-progress-fill');
      if (fill) fill.style.width = '100%';
    }, 100);
    setTimeout(() => {
      advanceToStep(3);
      setTimeout(() => createConfetti(), 300);
    }, 1800);
  }, 1500);
}

function goToTracking(orderId) {
  const container = document.getElementById('modal-container');
  if (container) container.remove();
  navigateTo('tracking', orderId);
}

function advanceToStep(step) {
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`pf-ind-${i}`);
    const content = document.getElementById(`pf-content-${i}`);
    if (ind) {
      ind.classList.toggle('active', i <= step);
      ind.classList.toggle('completed', i < step);
    }
    if (content) {
      content.classList.toggle('active', i === step);
    }
  }
  for (let i = 1; i < step; i++) {
    const line = document.getElementById(`pf-line-${i}`);
    if (line) line.classList.add('filled');
  }
}

function createConfetti() {
  const container = document.getElementById('pf-confetti');
  if (!container) return;
  const colors = ['#00e5c3', '#ff6b4a', '#3d8bfd', '#f5c518', '#e040fb', '#4caf50'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${1 + Math.random() * 1.5}s;
    `;
    container.appendChild(confetti);
  }
}

function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    const overlay = container.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('active');
    setTimeout(() => container.remove(), 300);
  }
}

function closeModalOutside(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
}

// ── Order Lookup ──
function lookupOrder() {
  const input = document.getElementById('lookup-input');
  if (!input || !input.value.trim()) {
    showToast('⚠️ Ingresa un dato de búsqueda');
    input?.focus();
    return;
  }
  const val = input.value.trim();
  
  // Allow tracking by digits (which we prepend RS- to) or full RS- code
  if (/^\d{1,6}$/.test(val)) {
    navigateTo('tracking', 'RS-' + val);
  } else if (/^RS-\d{1,6}$/i.test(val)) {
    navigateTo('tracking', val.toUpperCase());
  } else {
    // Treat as contact search (email or phone)
    navigateTo('history', val);
  }
}

// ── Rectify Order ID ──
function rectifyOrderId(orderId) {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    showToast('❌ Pedido no encontrado');
    return;
  }

  const order = orders[orderIndex];
  let newGameId = '';

  if (order.productType === 'account') {
    const emailInput = document.getElementById('rectify-email-input');
    const passInput = document.getElementById('rectify-pass-input');
    if (!emailInput || !emailInput.value.trim() || !passInput || !passInput.value.trim()) {
      showToast('⚠️ Ingresa correo y contraseña');
      return;
    }
    order.accountEmail = emailInput.value.trim();
    order.accountPassword = passInput.value.trim();
    newGameId = `Correo: ${order.accountEmail} | Clave: ${order.accountPassword}`;
  } else {
    const input = document.getElementById('rectify-id-input');
    if (!input || !input.value.trim()) {
      showToast('⚠️ Ingresa los datos correctos');
      input?.focus();
      return;
    }
    newGameId = input.value.trim();
    order.gameId = newGameId;
  }

  order.status = 'pending';
  order.statusHistory.push({
    status: 'pending',
    timestamp: new Date().toISOString(),
    note: `El cliente rectificó los datos a: ${newGameId}`
  });
  order.updatedAt = new Date().toISOString();
  
  orders[orderIndex] = order;
  saveOrderToDb(order);
  ORDERS = orders;

  showToast('✅ Datos actualizados y reenviados correctamente');
  
  // Notify admin via Telegram
  const msgText = `🔄 <b>PEDIDO RECTIFICADO — #${order.id}</b>\n\nEl cliente ha corregido sus datos.\nNuevos datos: <code>${newGameId}</code>`;
  sendTelegramMessage(msgText, buildOrderKeyboard(order.id));

  // Refresh view
  setTimeout(() => navigateTo('tracking', orderId), 500);
}

// ── Toggle Password Visibility ──
function togglePasswordVisibility() {
  const passInput = document.getElementById('account-password');
  if (!passInput) return;
  if (passInput.type === 'password') {
    passInput.type = 'text';
  } else {
    passInput.type = 'password';
  }
}

// ── Toast Notification ──
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ── Copy to Clipboard ──
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Copiado al portapapeles');
  }).catch(() => {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    tmp.remove();
    showToast('✅ Copiado al portapapeles');
  });
}

// ── Scroll Effects ──
function initScrollEffects() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

// ── Counter Animation ──
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-counter'));
    animateCounter(el, target);
  });
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    if (target >= 1000) {
      el.textContent = current.toLocaleString() + '+';
    } else {
      el.textContent = current;
    }
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ── Scroll Observer for fade-in animations ──
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ── Support Chat Logic ──
let chatPollingInterval = null;

function renderSupportMessages() {
  const messagesContainer = document.getElementById('support-messages');
  if (!messagesContainer) return;
  const sessionId = getDeviceFingerprint();
  const msgs = getMessagesForSession(sessionId);
  
  if (msgs.length === 0) {
    messagesContainer.innerHTML = `
      <div class="support-msg support-msg--bot">
        <div class="support-msg-bubble">
          ¡Hola! 👋 Bienvenido a <strong>RecargaShark</strong>. ¿En qué puedo ayudarte hoy?
        </div>
        <div class="support-msg-time">${new Date().toLocaleTimeString('es-VE', {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    `;
    return;
  }
  
  let html = '';
  msgs.forEach(msg => {
    if (msg.sender === 'system') return;
    const isUser = msg.sender === 'user';
    const time = new Date(msg.timestamp).toLocaleTimeString('es-VE', {hour:'2-digit', minute:'2-digit'});
    html += `
      <div class="support-msg ${isUser ? 'support-msg--user' : 'support-msg--bot'}">
        <div class="support-msg-bubble">${msg.text}</div>
        <div class="support-msg-time">${time}</div>
      </div>
    `;
  });
  messagesContainer.innerHTML = html;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleSupportChat() {
  const widget = document.getElementById('support-widget');
  if (widget) {
    widget.classList.toggle('open');
    if (widget.classList.contains('open')) {
      const sessionId = getDeviceFingerprint();
      const contact = localStorage.getItem('support_contact');
      
      const loginView = document.getElementById('support-login-view');
      const messagesView = document.getElementById('support-messages');
      const bottomView = document.getElementById('support-chat-bottom');
      
      if (!contact) {
        if (loginView) loginView.style.display = 'flex';
        if (messagesView) messagesView.style.display = 'none';
        if (bottomView) bottomView.style.display = 'none';
        const contactInput = document.getElementById('support-contact-input');
        if (contactInput) setTimeout(() => contactInput.focus(), 300);
      } else {
        if (loginView) loginView.style.display = 'none';
        if (messagesView) messagesView.style.display = 'flex';
        if (bottomView) bottomView.style.display = 'block';
        
        markMessagesAsRead(sessionId, 'user');
        if (typeof renderDynamicQuickActions === 'function') renderDynamicQuickActions();
        renderSupportMessages();
        
        const input = document.getElementById('support-input');
        if (input) setTimeout(() => input.focus(), 300);
        
        if (!chatPollingInterval) {
          chatPollingInterval = setInterval(() => {
            if (widget.classList.contains('open') && localStorage.getItem('support_contact')) {
              renderSupportMessages();
              markMessagesAsRead(sessionId, 'user');
            }
          }, 5000);
        }
      }
    } else {
      if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
      }
    }
  }
}

function startSupportSession() {
  const input = document.getElementById('support-contact-input');
  if (!input || !input.value.trim()) {
    showToast('Por favor ingresa tu contacto', 'error');
    return;
  }
  const contact = input.value.trim();
  localStorage.setItem('support_contact', contact);
  
  const loginView = document.getElementById('support-login-view');
  const messagesView = document.getElementById('support-messages');
  const bottomView = document.getElementById('support-chat-bottom');
  
  if (loginView) loginView.style.display = 'none';
  if (messagesView) messagesView.style.display = 'flex';
  if (bottomView) bottomView.style.display = 'block';
  
  const sessionId = getDeviceFingerprint();
  // Call addMessage empty just to create session with contact if not exists
  let msgs = getMessagesForSession(sessionId);
  if (msgs.length === 0) {
     addMessage(sessionId, 'bot', '¡Hola! 👋 Bienvenido a RecargaShark. ¿En qué puedo ayudarte hoy?', contact);
  } else {
     // Force contact update
     addMessage(sessionId, 'system', '', contact);
  }
  
  if (typeof renderDynamicQuickActions === 'function') renderDynamicQuickActions();
  
  renderSupportMessages();
  const chatInput = document.getElementById('support-input');
  if (chatInput) setTimeout(() => chatInput.focus(), 300);
}

async function sendSupportMessage() {
  const input = document.getElementById('support-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  
  const sessionId = getDeviceFingerprint();
  const contact = localStorage.getItem('support_contact') || 'Desconocido';
  
  addMessage(sessionId, 'user', text, contact);
  renderSupportMessages();
  
  const quickActions = document.getElementById('support-quick-actions');
  if (quickActions) quickActions.style.display = 'none';
  
  // Notify Telegram using global TELEGRAM_CONFIG
  if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.enabled && TELEGRAM_CONFIG.botToken && TELEGRAM_CONFIG.chatId) {
    const tgMsg = `💬 *Nuevo Mensaje de Soporte*\n\n*Cliente:* ${sessionId.substring(0,8)}\n*Contacto:* ${contact}\n*Mensaje:* ${text}\n\n_Responde desde el Panel Admin_`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CONFIG.chatId, text: tgMsg, parse_mode: 'Markdown' })
      });
    } catch(e) { console.error('Telegram error', e); }
  }

  // Smart bot auto-replies for quick actions
  setTimeout(() => {
    let reply = '';
    const lowerText = text.toLowerCase();
    
    // Check dynamic quick replies
    const replies = getQuickReplies();
    for (const r of replies) {
      const keywords = r.keywords.split(',').map(k => k.trim().toLowerCase());
      if (keywords.some(k => lowerText.includes(k))) {
        reply = r.response;
        break; // Stop at first match
      }
    }

    if (reply !== '') {
      addMessage(sessionId, 'bot', reply, contact);
      renderSupportMessages();
    }
  }, 1000);
}

function supportQuickAction(title) {
  const input = document.getElementById('support-input');
  if (!input) return;
  input.value = title;
  sendSupportMessage();
}

function showSupportMenu() {
  const quickActions = document.getElementById('support-quick-actions');
  if (quickActions) {
    if (typeof renderDynamicQuickActions === 'function') renderDynamicQuickActions();
    quickActions.style.display = 'flex';
  }
}

// ── Screenshot Upload & Telegram ──
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
    
    // OCR Check for duplicates
    if (window.Tesseract) {
      try {
        const { data: { text } } = await Tesseract.recognize(dataUrl, 'spa');
        
        // Extract numbers that are at least 5 digits long (e.g. references)
        const numbers = text.match(/\b\d{5,}\b/g) || [];
        const orders = getOrders();
        let duplicateFound = false;

        if (numbers.length > 0) {
          for (const num of numbers) {
            // Check if any completed order has this exact number string in its OCR data
            if (orders.some(o => o.status === 'completed' && o.ocrNumbers && o.ocrNumbers.includes(num))) {
              duplicateFound = true;
              break;
            }
          }
        }

        if (duplicateFound) {
          showToast('🚨 PAGO DUPLICADO: Esta captura ya fue procesada anteriormente.');
          
          const fp = getDeviceFingerprint();
          blockUserForFraud(fp);
          sendTelegramMessage(`🚨 <b>ALERTA DE FRAUDE:</b>\nUn cliente intentó re-utilizar un comprobante de pago ya procesado.\nFingerprint: <code>${fp}</code>\nEl usuario ha sido bloqueado preventivamente.`);
          
          appState.selectedScreenshot = null;
          appState.selectedScreenshotOcr = null;
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
        
        // Save OCR numbers to state to attach to order later
        appState.selectedScreenshotOcr = numbers;

      } catch (err) {
        console.error('OCR analysis failed:', err);
      }
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

function removeScreenshot(event) {
  event.stopPropagation();
  appState.selectedScreenshot = null;
  const fileInput = document.getElementById('payment-screenshot');
  if (fileInput) fileInput.value = '';

  const previewContainer = document.getElementById('screenshot-preview');
  if (previewContainer) {
    previewContainer.innerHTML = `
      <div class="screenshot-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        <span>Toca para subir captura</span>
        <span class="screenshot-hint">JPG, PNG — Máx 5MB</span>
      </div>
    `;
  }
}

function generateThumbnail(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 300;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function triggerTelegramNotification(order) {
  if (appState.selectedScreenshot) {
    try {
      const thumbnail = await generateThumbnail(appState.selectedScreenshot);
      const orders = getOrders();
      const o = orders.find(x => x.id === order.id);
      if (o) {
        o.screenshot = thumbnail;
        order.screenshot = thumbnail;
        saveOrderToDb(order);
        ORDERS = orders;
      }
    } catch (e) {
      console.error('Error generating thumbnail:', e);
    }
  }

  const msgText = buildOrderTelegramMessage(order);
  const keyboard = buildOrderKeyboard(order.id);

  if (appState.selectedScreenshot) {
    await sendTelegramPhoto(appState.selectedScreenshot, msgText, keyboard);
  } else {
    await sendTelegramMessage(msgText, keyboard);
  }
  
  appState.selectedScreenshot = null;
}

// ── Real-Time Tracking Polling ──
let lastTrackingStatus = null;
setInterval(() => {
  if (appState.currentView === 'tracking' && appState.trackingOrderId) {
    const order = getOrderById(appState.trackingOrderId);
    if (order) {
      if (lastTrackingStatus === null) {
        lastTrackingStatus = order.status;
      } else if (lastTrackingStatus !== order.status) {
        // Status changed!
        lastTrackingStatus = order.status;
        renderApp();
        // Show a quick notification to the user
        const statusInfo = ORDER_STATUSES[order.status] || {};
        showToast(`¡Tu pedido se ha actualizado a: ${statusInfo.label || order.status}!`, 'success');
      }
    }
  } else {
    lastTrackingStatus = null;
  }
}, 3000); // Check every 3 seconds

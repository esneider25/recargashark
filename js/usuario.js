
// ==========================================
// RecargaShark - Panel de Usuario Independiente
// ==========================================

let currentUser = null;
let userProfile = null;
let dashboardOrders = { active: [], completed: [] };

document.addEventListener('DOMContentLoaded', () => {
  // Manejo de Auth
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      firebase.database().ref('users/' + user.uid).on('value', snap => {
        userProfile = snap.val() || {};
        renderApp();
      });
    } else {
      currentUser = null;
      userProfile = null;
      // Redirigir a inicio si no está logueado
      window.location.href = '/';
    }
  });
});

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="bg-ocean-grid">${typeof renderBubbles === 'function' ? renderBubbles() : ''}</div>
    <div style="width: 100%; min-height: 100vh;">
      ${renderDashboard()}
    </div>
    <div id="terms-modal-container"></div>
  `;
}

function navigateTo(view) {
  if (view === 'home') {
    window.location.href = '/';
  } else if (view === 'wallet-recharge') {
    // Si queremos que la recarga sea en la tienda, mandamos a index.html?recharge=true
    // Pero por ahora, podemos mandarlos al home
    window.location.href = '/';
  }
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = '/';
  }).catch(error => {
    console.error("Error al cerrar sesión", error);
  });
}

function getVipLevel(spent) {
  if (spent < 50) return { name: 'Bronce', color: '#cd7f32', gradient: 'linear-gradient(135deg, #d4a373 0%, #a68a64 100%)', nextThreshold: 50 };
  if (spent < 150) return { name: 'Plata', color: '#c0c0c0', gradient: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)', nextThreshold: 150 };
  if (spent < 500) return { name: 'Oro', color: '#ffd700', gradient: 'linear-gradient(135deg, #ffe066 0%, #f5af19 100%)', nextThreshold: 500 };
  if (spent < 1000) return { name: 'Platino', color: '#e5e4e2', gradient: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)', nextThreshold: 1000 };
  return { name: 'Diamante', color: '#b9f2ff', gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', nextThreshold: null };
}

async function loadDashboardData() {
  if (!currentUser) return;
  
  try {
    const orderIds = {};
    const userOrdersRef = await firebase.database().ref('users/' + currentUser.uid + '/orders').once('value');
    if (userOrdersRef.exists()) {
      Object.keys(userOrdersRef.val()).forEach(k => orderIds[k] = true);
    }
    
    let allOrders = [];
    if (Object.keys(orderIds).length > 0) {
      const keys = Object.keys(orderIds);
      for (let id of keys) {
        const orderSnap = await firebase.database().ref('orders/' + id).once('value');
        if (orderSnap.exists()) {
          allOrders.push(orderSnap.val());
        }
      }
    }
    
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dashboardOrders.active = allOrders.filter(o => o.status === 'pending' || o.status === 'processing');
    dashboardOrders.completed = allOrders.filter(o => o.status !== 'pending' && o.status !== 'processing');
    
    switchDashboardTab('active');

  } catch (error) {
    console.error("Error loading dashboard orders:", error);
  }

  renderDashboardSavedIds();
  renderDashboardTransactions();
}

function switchDashboardTab(tab) {
  const activeBtn = document.getElementById('tab-active-orders');
  const completedBtn = document.getElementById('tab-completed-orders');
  const container = document.getElementById('dashboard-orders-container');
  
  if (!activeBtn || !completedBtn || !container) return;

  if (tab === 'active') {
    activeBtn.style.color = '#10b981';
    activeBtn.style.borderBottom = '2px solid #10b981';
    completedBtn.style.color = 'var(--text-secondary)';
    completedBtn.style.borderBottom = 'none';
    container.innerHTML = renderDashboardOrders(dashboardOrders.active, 'active');
  } else {
    completedBtn.style.color = '#10b981';
    completedBtn.style.borderBottom = '2px solid #10b981';
    activeBtn.style.color = 'var(--text-secondary)';
    activeBtn.style.borderBottom = 'none';
    container.innerHTML = renderDashboardOrders(dashboardOrders.completed, 'completed');
  }
}

function renderDashboardSavedIds() {
  const container = document.getElementById('dashboard-saved-ids');
  if (!container) return;
  
  let idsList = [];
  if (userProfile && userProfile.savedIds) {
    idsList = Array.isArray(userProfile.savedIds) ? userProfile.savedIds : Object.values(userProfile.savedIds);
  }
  
  if (idsList.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-secondary);">No tienes cuentas guardadas.</div>`;
    return;
  }
  container.innerHTML = idsList.map((id, index) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; margin-bottom: 8px;">
      <div>
        <div style="font-weight: bold; font-size: 0.9rem;">${id.gameName}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">ID: ${id.uid} ${id.zoneId ? '| Zona: ' + id.zoneId : ''}</div>
      </div>
      <button onclick="removeSavedId(${index})" style="background: none; border: none; color: #ff5252; cursor: pointer;" title="Eliminar">🗑️</button>
    </div>
  `).join('');
}

function removeSavedId(index) {
  if (!currentUser || !userProfile || !userProfile.savedIds) return;
  let newIds = Array.isArray(userProfile.savedIds) ? [...userProfile.savedIds] : Object.values(userProfile.savedIds);
  newIds.splice(index, 1);
  firebase.database().ref('users/' + currentUser.uid + '/savedIds').set(newIds);
}

function showAddIdModal() {
  const modal = document.createElement('div');
  modal.id = 'add-id-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0'; modal.style.left = '0'; modal.style.width = '100%'; modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.8)'; modal.style.zIndex = '1000';
  modal.style.display = 'flex'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
  
  modal.innerHTML = `
    <div style="background: var(--bg-surface); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 400px;">
      <h3 style="margin-top: 0; margin-bottom: 20px;">Añadir Cuenta Guardada</h3>
      
      <div class="form-group">
        <label>Juego</label>
        <select id="new-id-game" class="form-input">
          <option value="Free Fire">Free Fire</option>
          <option value="Mobile Legends">Mobile Legends</option>
          <option value="PUBG Mobile">PUBG Mobile</option>
          <option value="Call of Duty Mobile">Call of Duty Mobile</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Player ID / UID</label>
        <input type="text" id="new-id-uid" class="form-input" placeholder="Ej. 12345678">
      </div>
      
      <div class="form-group">
        <label>Zone ID (Opcional)</label>
        <input type="text" id="new-id-zone" class="form-input" placeholder="Ej. 1234 (Solo MLBB)">
      </div>
      
      <div style="display: flex; gap: 10px; margin-top: 25px;">
        <button class="btn-secondary" style="flex: 1;" onclick="closeAddIdModal()">Cancelar</button>
        <button class="btn-primary" style="flex: 1;" onclick="submitAddId()">Guardar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeAddIdModal() {
  const modal = document.getElementById('add-id-modal');
  if (modal) modal.remove();
}

function submitAddId() {
  if (!currentUser) return;
  const game = document.getElementById('new-id-game').value;
  const uid = document.getElementById('new-id-uid').value.trim();
  const zone = document.getElementById('new-id-zone').value.trim();
  
  if (!uid) { alert('El UID es obligatorio'); return; }
  
  let currentIds = [];
  if (userProfile && userProfile.savedIds) {
    currentIds = Array.isArray(userProfile.savedIds) ? [...userProfile.savedIds] : Object.values(userProfile.savedIds);
  }
  
  currentIds.push({ gameName: game, uid: uid, zoneId: zone });
  
  firebase.database().ref('users/' + currentUser.uid + '/savedIds').set(currentIds).then(() => {
    closeAddIdModal();
  });
}

function startWalletRecharge() {
  // Redirigir a tienda con parámetro
  window.location.href = '/?recharge=true';
}

function redeemPoints() {
  if (!currentUser || !userProfile) return;
  if ((userProfile.points || 0) < 100) {
    alert('Necesitas al menos 100 Shark Points para canjear $1.');
    return;
  }
  
  if(confirm('¿Seguro que deseas canjear 100 Shark Points por $1 de Saldo?')) {
    const newPoints = userProfile.points - 100;
    const newWallet = (userProfile.wallet || 0) + 1;
    
    firebase.database().ref('users/' + currentUser.uid).update({
      points: newPoints,
      wallet: newWallet
    }).then(() => {
      firebase.database().ref('users/' + currentUser.uid + '/transactions').push({
        id: Date.now().toString(),
        type: 'deposit',
        amount: 1,
        description: 'Canje de 100 Shark Points',
        date: Date.now()
      });
      alert('¡Canje exitoso! Se ha sumado $1 a tu monedero.');
    });
  }
}

// ==========================================
// Componentes HTML
// ==========================================
// (Se extrajeron de components.js)
function renderDashboard() {
  if (!currentUser) {
    return `<div style="text-align:center; padding: 100px;"><h2>Por favor inicia sesión.</h2></div>`;
  }

  setTimeout(() => { if (typeof loadDashboardData === 'function') loadDashboardData(); }, 100);

  const wallet = userProfile?.wallet || 0;
  const spent = userProfile?.totalSpent || 0;
  const points = userProfile?.points || 0;
  const vip = typeof getVipLevel === 'function' ? getVipLevel(spent) : { name: 'Bronce', color: '#cd7f32', gradient: 'linear-gradient(135deg, #d4a373 0%, #a68a64 100%)', nextThreshold: 50 };
  
  let progressHtml = '';
  if (vip.nextThreshold) {
     const percent = Math.min(100, (spent / vip.nextThreshold) * 100);
     progressHtml = `
       <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-secondary);">
         Progreso a siguiente nivel: $${spent.toFixed(2)} / $${vip.nextThreshold}
         <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 5px; overflow: hidden;">
           <div style="width: ${percent}%; height: 100%; background: ${vip.gradient}; transition: width 1s ease;"></div>
         </div>
       </div>
     `;
  } else {
     progressHtml = `<div style="margin-top: 15px; font-size: 0.85rem; color: ${vip.color}; font-weight: bold;">¡Has alcanzado el nivel máximo!</div>`;
  }

  return `
    <div class="dashboard-container" style="max-width: 1200px; margin: 40px auto; padding: 20px; color: white;">
      <h1 style="margin-bottom: 30px; font-size: 2.5rem; text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">Panel de Usuario</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 16px; display: flex; gap: 20px; align-items: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: ${vip.gradient}; filter: blur(50px); opacity: 0.3;"></div>
          <img src="${currentUser.photoURL || 'https://ui-avatars.com/api/?name=' + currentUser.email + '&background=0D8ABC&color=fff'}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid ${vip.color}; box-shadow: 0 0 15px ${vip.color}40; position: relative; z-index: 2;">
          <div style="flex: 1; position: relative; z-index: 2;">
            <h3 style="margin: 0 0 5px 0; font-size: 1.3rem;">${currentUser.displayName || 'Usuario'}</h3>
            <span style="background: ${vip.gradient}; color: #000; font-weight: bold; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; box-shadow: 0 2px 10px ${vip.color}50;">VIP ${vip.name}</span>
            ${progressHtml}
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(16, 185, 129, 0.3); padding: 25px; border-radius: 16px; position: relative; overflow: hidden;">
          <div style="position: absolute; bottom: -50px; left: -50px; width: 100px; height: 100px; background: #10b981; filter: blur(50px); opacity: 0.2;"></div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 5px;">Saldo Monedero</div>
          <div style="font-size: 2.8rem; font-weight: 800; color: #10b981; text-shadow: 0 0 15px rgba(16, 185, 129, 0.3);">\$${wallet.toFixed(2)}</div>
          <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button onclick="startWalletRecharge()" class="btn-primary" style="flex: 1; padding: 8px;">+ Recargar</button>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(59, 130, 246, 0.3); padding: 25px; border-radius: 16px; position: relative; overflow: hidden;">
          <div style="position: absolute; bottom: -50px; right: -50px; width: 100px; height: 100px; background: #3b82f6; filter: blur(50px); opacity: 0.2;"></div>
          <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 5px;">Shark Points</div>
          <div style="font-size: 2.5rem; font-weight: 800; color: #3b82f6; text-shadow: 0 0 15px rgba(59, 130, 246, 0.3);">${points}</div>
          <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button onclick="if(typeof redeemPoints==='function')redeemPoints()" class="btn-secondary" style="flex: 1; padding: 8px; border-color: #3b82f6; color: #3b82f6;">Canjear por $1</button>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
        
        <div>
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 25px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
              <h2 style="margin: 0; font-size: 1.5rem;">Mis Pedidos</h2>
              <div style="display: flex; gap: 15px;">
                <button id="tab-active-orders" onclick="switchDashboardTab('active')" style="background:none; border:none; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; cursor: pointer; font-weight: bold;">En Proceso</button>
                <button id="tab-completed-orders" onclick="switchDashboardTab('completed')" style="background:none; border:none; color: var(--text-secondary); padding-bottom: 5px; cursor: pointer; font-weight: bold;">Completados</button>
              </div>
            </div>
            <div id="dashboard-orders-container" style="min-height: 200px;">
              <div style="text-align:center; padding: 40px;"><span class="tracking-spinner" style="display:inline-block; width:24px; height:24px; border:3px solid #10b981; border-bottom-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span></div>
            </div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 25px;">
             <h2 style="margin: 0 0 20px 0; font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Historial de Billetera</h2>
             <div id="dashboard-transactions-container" style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
                <div style="text-align:center; padding: 20px; color: var(--text-secondary);">Cargando movimientos...</div>
             </div>
          </div>
        </div>

        <div>
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 25px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0;">Libreta de IDs</h3>
              <button onclick="showAddIdModal()" class="btn-primary" style="padding: 5px 12px; font-size: 0.8rem; border-radius: 20px;">+ Añadir</button>
            </div>
            <div id="dashboard-saved-ids">
              <div style="text-align:center; color:var(--text-secondary);"><small>Cargando...</small></div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn-secondary" style="width: 100%; border-radius: 12px;" onclick="navigateTo('home')">Volver a la Tienda</button>
            <button onclick="logout()" class="btn-secondary" style="width: 100%; border-radius: 12px; color: #ff5252; border-color: rgba(255, 82, 82, 0.3); background: rgba(255, 82, 82, 0.05);">Cerrar Sesión</button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function openOrderTracking(orderId) {
  const modal = document.getElementById('profile-modal-container');
  if(modal) modal.remove();
  
  if (typeof navigateTo === 'function') {
    navigateTo('tracking', orderId);
  } else {
    window.location.href = '#tracking/' + orderId;
  }
}

function renderDashboardOrders(orders, type) {
  if (orders.length === 0) {
    return `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 10px; opacity: 0.5;">${type === 'active' ? '📦' : '✅'}</div>
        <h3 style="font-weight: 500;">No tienes pedidos ${type === 'active' ? 'en proceso' : 'completados'}.</h3>
      </div>
    `;
  }
  
  return orders.map(order => {
    let statusColor = '#f59e0b';
    if (order.status === 'processing') statusColor = '#3b82f6';
    if (order.status === 'completed') statusColor = '#10b981';
    if (order.status === 'rejected') statusColor = '#ef4444';

    const STATUS_ES = {
      'pending': 'PENDIENTE',
      'processing': 'PROCESANDO',
      'completed': 'COMPLETADO',
      'rejected': 'RECHAZADO'
    };
    const statusText = STATUS_ES[order.status] || order.status.toUpperCase();

    return `
    <div onclick="openOrderTracking('${order.id}')" style="cursor: pointer; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-left: 4px solid ${statusColor}; border-radius: 8px; padding: 20px; margin-bottom: 15px; transition: transform 0.2s ease, background 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.transform='translateY(0)'">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <div>
          <span style="font-weight: 800; color: #fff; font-size: 1.1rem;">${order.productName || 'Producto'}</span>
          <div style="color: #10b981; font-weight: bold; margin-top: 5px;">${order.packageLabel || ''}</div>
        </div>
        <div style="text-align: right;">
           <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: 1px solid ${statusColor}40;">${statusText}</span>
           <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px;">Ord: #${order.id}</div>
        </div>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 15px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 10px;">
        Fecha: ${new Date(order.createdAt).toLocaleString()}
      </div>
      
      ${type === 'active' ? `
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: bold;">
        <span style="color: ${order.status === 'pending' || order.status === 'processing' ? '#10b981' : 'var(--text-secondary)'}">1. Recibido</span>
        <span style="color: ${order.status === 'processing' ? '#3b82f6' : 'var(--text-secondary)'}">2. Procesando</span>
        <span>3. Entregado</span>
      </div>
      <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
        <div style="width: ${order.status === 'pending' ? '33%' : (order.status === 'processing' ? '66%' : '100%')}; height: 100%; background: ${statusColor}; transition: width 0.5s ease;"></div>
      </div>
      ` : ''}
    </div>
  `}).join('');
}

function renderDashboardTransactions() {
  const container = document.getElementById('dashboard-transactions-container');
  if (!container) return;
  
  let txList = [];
  if (userProfile && userProfile.transactions) {
    txList = Array.isArray(userProfile.transactions) ? userProfile.transactions : Object.values(userProfile.transactions);
  }
  
  if (txList.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-secondary);">No hay movimientos recientes.</div>`;
    return;
  }
  
  const sortedTx = [...txList].sort((a,b) => b.date - a.date);
  
  container.innerHTML = sortedTx.map(tx => {
    let sign = tx.amount >= 0 ? '+' : '';
    let color = tx.amount >= 0 ? '#10b981' : '#ff5252';
    let icon = tx.type === 'deposit' ? '💰' : (tx.type === 'purchase' ? '🛒' : '🔄');
    return `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; margin-bottom: 8px;">
       <div style="display: flex; align-items: center; gap: 12px;">
         <div style="font-size: 1.5rem; opacity: 0.8;">${icon}</div>
         <div>
           <div style="font-weight: bold; font-size: 0.9rem;">${tx.description || 'Movimiento'}</div>
           <div style="font-size: 0.75rem; color: var(--text-secondary);">${new Date(tx.date).toLocaleString()}</div>
         </div>
       </div>
       <div style="font-weight: bold; color: ${color};">${sign}\$${parseFloat(tx.amount).toFixed(2)}</div>
    </div>
    `;
  }).join('');
}


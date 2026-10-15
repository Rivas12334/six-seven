// =========================================
// SIGLEPRO — UNP · app.js
// Lógica de navegación e interactividad
// =========================================

// --- Navigation ---
const views = ['dashboard', 'legajo', 'meritos', 'convocatorias', 'evaluacion', 'orden', 'propuesta', 'auditoria', 'admin'];
const breadcrumbs = {
  dashboard:     ['Inicio', 'Dashboard'],
  legajo:        ['Inicio', 'Mi Legajo'],
  meritos:       ['Inicio', 'Verificación de Méritos'],
  convocatorias: ['Inicio', 'Convocatorias'],
  evaluacion:    ['Inicio', 'Convocatorias', 'Evaluación'],
  orden:         ['Inicio', 'Convocatorias', 'Orden de Mérito'],
  propuesta:     ['Inicio', 'Trámite de Propuesta'],
  auditoria:     ['Inicio', 'Historial y Auditoría'],
  admin:         ['Inicio', 'Administración'],
};

function navigate(viewId) {
  // Hide all views
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    const nav = document.getElementById('nav-' + v);
    if (el) el.classList.remove('active');
    if (nav) nav.classList.remove('active');
  });

  // Show target view
  const target = document.getElementById('view-' + viewId);
  const navItem = document.getElementById('nav-' + viewId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
    document.querySelector('.content').scrollTop = 0;
  }
  if (navItem) navItem.classList.add('active');

  // Update breadcrumb
  const crumbs = breadcrumbs[viewId] || ['Inicio'];
  const bc = document.getElementById('breadcrumb');
  if (bc) {
    bc.innerHTML = crumbs.map((c, i) =>
      i === crumbs.length - 1
        ? `<span class="current">${c}</span>`
        : `<span>${c}</span><span class="sep">›</span>`
    ).join('');
  }

  // Close sidebar on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
}

// --- Sidebar toggle ---
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
    mainWrapper.classList.toggle('sidebar-collapsed');
  }
}

// --- Role change ---
const roleLabels = {
  docente:   'Docente Ordinario',
  urh:       'Personal URH / Legajos',
  comision:  'Comisión Evaluadora',
  decanato:  'Decanato / Consejo',
  admin:     'Administrador',
};
const roleNames = {
  docente:   'Carlos Rodríguez',
  urh:       'María García',
  comision:  'Juan Pérez Silva',
  decanato:  'Pedro Alva Ruiz',
  admin:     'Administrador TI',
};
const roleInitials = {
  docente:   'CR',
  urh:       'MG',
  comision:  'JP',
  decanato:  'PA',
  admin:     'AD',
};

function changeRole(role) {
  const label = document.getElementById('sidebar-role-label');
  const nameEls = document.querySelectorAll('.user-name, .user-chip span:nth-child(2)');
  const avatarEls = document.querySelectorAll('.user-avatar, .user-avatar-sm');

  if (label) label.textContent = roleLabels[role] || role;
  nameEls.forEach(el => {
    if (el.classList.contains('user-name') || el.parentElement?.classList?.contains('user-chip')) {
      el.textContent = roleNames[role] || 'Usuario';
    }
  });
  avatarEls.forEach(el => { el.textContent = roleInitials[role] || 'U'; });

  showToast(`Vista cambiada: ${roleLabels[role]}`, 'info');

  // Adjust nav visibility based on role
  adjustNavByRole(role);
}

function adjustNavByRole(role) {
  const navMeritos = document.getElementById('nav-meritos');
  const navAdmin = document.getElementById('nav-admin');
  const navPropuesta = document.getElementById('nav-propuesta');

  if (navMeritos) navMeritos.style.display = (role === 'docente') ? 'none' : 'flex';
  if (navAdmin) navAdmin.style.display = (role === 'admin') ? 'flex' : (role === 'urh' ? 'flex' : 'none');
  if (navPropuesta) navPropuesta.style.display = (role === 'docente' || role === 'comision') ? 'none' : 'flex';
}

// --- Tab switching ---
function switchTab(tabId, btn) {
  // Hide all sibling tab contents
  const tabBar = btn.closest('.tab-bar');
  const tabContents = tabBar.parentElement.querySelectorAll('.tab-content');
  tabContents.forEach(tc => tc.classList.add('hidden'));

  // Deactivate all tab buttons
  tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Activate target
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');
  btn.classList.add('active');
}

// --- Notifications ---
function toggleNotifications() {
  const dropdown = document.getElementById('notif-dropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  const count = document.getElementById('notif-count');
  if (count) count.style.display = 'none';
  showToast('Todas las notificaciones marcadas como leídas', 'success');
  document.getElementById('notif-dropdown').style.display = 'none';
}

// Close notifications on outside click
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('notif-dropdown');
  const btn = document.getElementById('notif-btn');
  if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// --- Toast notifications ---
const toastIcons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${toastIcons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- Modals ---
function openModal(modalId) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById(modalId);
  if (overlay) overlay.classList.add('visible');
  if (modal) {
    modal.classList.add('visible');
    modal.style.display = 'block';
    // Trigger animation
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }
}

function closeAllModals() {
  document.getElementById('modal-overlay').classList.remove('visible');
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('visible');
    m.style.display = 'none';
  });
}

function openVerifModal() {
  openModal('modal-verificar');
  // Handle radio toggle for observation text
  setTimeout(() => {
    document.querySelectorAll('input[name="decision"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const obsGroup = document.getElementById('obs-text-group');
        if (obsGroup) {
          obsGroup.style.display = radio.value === 'observar' ? 'block' : 'none';
        }
      });
    });
  }, 100);
}

// --- Evaluation: Recalculate score ---
function recalcPuntaje() {
  const fields = ['pts-grado', 'pts-inv', 'pts-doc', 'pts-pon', 'pts-ext', 'pts-cap'];
  const maxes = [15, 20, 20, 10, 10, 15];
  let total = 0;

  fields.forEach((id, i) => {
    const input = document.getElementById(id);
    if (input) {
      let val = parseFloat(input.value) || 0;
      val = Math.min(val, maxes[i]);
      val = Math.max(val, 0);
      total += val;
    }
  });

  const scoreValue = document.getElementById('score-value');
  const scoreBadge = document.getElementById('score-badge');
  const resultPreview = document.querySelector('.resultado-preview');
  const resValue = document.querySelector('.res-value');

  if (scoreValue) scoreValue.textContent = total.toFixed(1);

  if (scoreBadge) {
    if (total >= 55) {
      scoreBadge.className = 'badge badge-green';
      scoreBadge.textContent = '≥ 55 — APTO';
    } else {
      scoreBadge.className = 'badge badge-red';
      scoreBadge.textContent = '< 55 — NO APTO';
    }
  }

  if (resultPreview && resValue) {
    if (total >= 55) {
      resultPreview.className = 'resultado-preview apto';
      resValue.textContent = 'APTO PARA PROPUESTA';
      resValue.style.color = '#166534';
    } else {
      resultPreview.className = 'resultado-preview no-apto';
      resValue.textContent = 'NO APTO — PUNTAJE INSUFICIENTE';
      resValue.style.color = '#991B1B';
    }
  }
}

// --- Close evaluation ---
function cerrarEvaluacion() {
  const fundamento = document.getElementById('fundamento');
  if (fundamento && fundamento.value.trim().length < 10) {
    showToast('Debe ingresar el fundamento de la comisión (mínimo 10 caracteres)', 'warning');
    fundamento.focus();
    return;
  }
  showToast('✓ Evaluación cerrada y registrada como inmutable en el sistema', 'success', 4000);
  setTimeout(() => navigate('orden'), 1500);
}

// --- Elevate proposal ---
function elevarPropuesta() {
  const step = document.querySelector('.prop-step.active');
  showToast('Propuesta elevada al Consejo Universitario con acuerdo y nota registrados', 'success');

  // Visual update
  setTimeout(() => {
    const steps = document.querySelectorAll('.prop-step');
    const connectors = document.querySelectorAll('.prop-connector');
    if (steps[1]) { steps[1].classList.remove('active'); steps[1].classList.add('done'); steps[1].querySelector('.prop-step-icon').textContent = '✓'; }
    if (connectors[1]) connectors[1].classList.add('done-line');
    if (steps[2]) { steps[2].classList.remove('pending-step'); steps[2].classList.add('active'); steps[2].querySelector('.prop-step-icon').textContent = '→'; }
  }, 300);
}

// --- Doc tab switch ---
function switchDocTab(btn, title) {
  document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const titleEl = document.getElementById('pdf-title');
  if (titleEl) titleEl.textContent = title;
}

// --- Keyboard shortcut: Escape to close modal ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  // Start on dashboard
  navigate('dashboard');

  // Show welcome toast after brief delay
  setTimeout(() => {
    showToast('Bienvenida, María García · Sistema SIGLEPRO UNP', 'success', 4000);
  }, 600);

  // Simulate live badge update
  setTimeout(() => {
    const badge = document.getElementById('badge-meritos');
    if (badge) {
      badge.textContent = '88';
      showToast('Nuevo mérito pendiente de verificación — Mg. Torres', 'info');
    }
  }, 8000);

  // Animate bar chart on load
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach((bar, i) => {
      const finalHeight = bar.style.height;
      bar.style.height = '0%';
      setTimeout(() => { bar.style.height = finalHeight; }, i * 80);
    });
  }, 300);

  // Animate stat values
  document.querySelectorAll('.stat-value').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 400);
  });

  // Initialize role nav adjustments
  adjustNavByRole('urh');
});

/* ============================================================
   auth.js — Login, Logout, Route Guard
   ============================================================ */
'use strict';

function requireAuth() {
  if (!App.isLoggedIn()) window.location.href = 'index.html';
}

function handleLogin() {
  const u    = document.getElementById('inp-username').value.trim();
  const p    = document.getElementById('inp-password').value.trim();
  const errEl = document.getElementById('login-error');

  errEl.classList.add('d-none');

  if (!u || !p) { showAuthError(errEl, 'Username dan password wajib diisi.'); return; }

  if (App.login(u, p)) {
    sessionStorage.setItem('siabsen_user', u);
    window.location.href = 'dashboard.html';
  } else {
    showAuthError(errEl, 'Username atau password salah.');
  }
}

function handleLogout() {
  App.logout();
  sessionStorage.removeItem('siabsen_user');
  window.location.href = 'index.html';
}

function showAuthError(el, msg) {
  el.textContent = msg;
  el.classList.remove('d-none');
}

function populateTopbarUser() {
  const el = document.getElementById('topbar-username');
  if (el) el.textContent = sessionStorage.getItem('siabsen_user') || 'Admin';
}

function setSidebarActive() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

// Enter key
document.addEventListener('DOMContentLoaded', () => {
  ['inp-username','inp-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  });

  const toggle = document.getElementById('toggle-pass');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const inp  = document.getElementById('inp-password');
      const icon = toggle.querySelector('i');
      const show = inp.type === 'password';
      inp.type      = show ? 'text' : 'password';
      icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  }
});

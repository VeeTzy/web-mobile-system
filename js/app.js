/* ============================================================
   app.js — UI Logic Per Halaman
   ============================================================ */
'use strict';

// ── Helpers ─────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function statusBadge(status) {
  const map = {
    hadir: `<span class="badge text-bg-success">Hadir</span>`,
    absen: `<span class="badge text-bg-danger">Absen</span>`,
    izin:  `<span class="badge text-bg-warning text-dark">Izin</span>`,
  };
  return map[status] ?? `<span class="badge text-bg-secondary">${status}</span>`;
}

function formatDate() {
  return new Date().toLocaleDateString('id-ID', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  });
}

// ── Load Sidebar ─────────────────────────────────────────────
function loadSidebar() {
  fetch('_sidebar.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('sidebar-container').innerHTML = html;
      setSidebarActive();
      const nameEl = document.getElementById('sidebar-username');
      if (nameEl) nameEl.textContent = sessionStorage.getItem('siabsen_user') || 'Admin';
    });
}

// ── Dashboard ────────────────────────────────────────────────
function initDashboard() {
  const el = document.getElementById('dash-date');
  if (el) el.textContent = formatDate();

  const s = App.getStats();
  ['total','hadir','izin','absen'].forEach(k => {
    const node = document.getElementById('stat-' + k);
    if (node) node.textContent = s[k];
  });

  renderAbsensiTable(App.getMahasiswaAll().slice(0, 5), 'dash-tbody');
}

// ── Absensi Table (Dashboard) ────────────────────────────────
function renderAbsensiTable(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = data.length === 0
    ? `<tr><td colspan="5" class="text-center text-muted py-4">Tidak ada data</td></tr>`
    : data.map(m => `
        <tr>
          <td>
            <span class="avatar bg-success text-white rounded-circle d-inline-flex align-items-center
                         justify-content-center me-2" style="width:32px;height:32px;font-size:.75rem;font-weight:700;">
              ${initials(m.nama)}
            </span>${m.nama}
          </td>
          <td class="nim text-muted">${m.nim}</td>
          <td>${m.kelas}</td>
          <td>${m.waktu}</td>
          <td>${statusBadge(m.status)}</td>
        </tr>`).join('');
}

// ── Mahasiswa Page ───────────────────────────────────────────
let _query = '';

function initMahasiswaPage() { renderMhsTable(App.getMahasiswaAll()); }

function renderMhsTable(data) {
  const tbody = document.getElementById('mhs-tbody');
  if (!tbody) return;
  tbody.innerHTML = data.length === 0
    ? `<tr><td colspan="6" class="text-center text-muted py-4">Tidak ada data</td></tr>`
    : data.map((m, i) => `
        <tr>
          <td class="text-muted" style="font-size:.8rem;">${i + 1}</td>
          <td class="nim">${m.nim}</td>
          <td>
            <span class="avatar bg-success text-white rounded-circle d-inline-flex align-items-center
                         justify-content-center me-2" style="width:32px;height:32px;font-size:.75rem;font-weight:700;">
              ${initials(m.nama)}
            </span>${m.nama}
          </td>
          <td class="text-muted" style="font-size:.85rem;">${m.username}</td>
          <td><span class="badge text-bg-light text-dark border">${m.kelas}</span></td>
          <td>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteMhs('${m.nim}')">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>`).join('');
}

function onSearchMhs(q) {
  _query = q.toLowerCase();
  const filtered = App.getMahasiswaAll().filter(m =>
    m.nama.toLowerCase().includes(_query) ||
    m.nim.includes(_query) ||
    m.kelas.toLowerCase().includes(_query)
  );
  renderMhsTable(filtered);
}

function deleteMhs(nim) {
  const mhs = App.getMahasiswaByNIM(nim);
  if (!mhs || !confirm(`Hapus ${mhs.nama} (${nim})?`)) return;
  App.deleteMahasiswa(nim);
  onSearchMhs(_query);
}

// ── Register ─────────────────────────────────────────────────
function handleRegister() {
  const get   = id => document.getElementById(id)?.value.trim();
  const nim   = get('reg-nim');
  const nama  = get('reg-nama');
  const user  = get('reg-username');
  const kelas = get('reg-kelas');
  const pass  = get('reg-password');
  const pass2 = get('reg-repassword');
  const errEl = document.getElementById('reg-error');
  const okEl  = document.getElementById('reg-success');

  // Reset alerts
  [errEl, okEl].forEach(el => el?.classList.add('d-none'));

  if (!nim || !nama || !user || !kelas || !pass || !pass2) {
    return showRegError(errEl, 'Semua field wajib diisi.');
  }
  if (pass !== pass2) return showRegError(errEl, 'Password tidak cocok.');
  if (pass.length < 4) return showRegError(errEl, 'Password minimal 4 karakter.');

  const result = App.addMahasiswa({ nim, nama, username: user, kelas });
  if (!result.ok) return showRegError(errEl, result.msg);

  okEl.textContent = `✓ ${nama} berhasil didaftarkan!`;
  okEl?.classList.remove('d-none');
  clearRegForm();
  setTimeout(() => okEl?.classList.add('d-none'), 4000);
}

function showRegError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}

function clearRegForm() {
  ['reg-nim','reg-nama','reg-username','reg-password','reg-repassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const kelas = document.getElementById('reg-kelas');
  if (kelas) kelas.value = '';
}

// ── QR Scanner ───────────────────────────────────────────────
function simulateScan() {
  const pool  = App.getMahasiswaAll().filter(m => m.status !== 'hadir');
  const target = pool.length > 0
    ? pool[Math.floor(Math.random() * pool.length)]
    : App.getMahasiswaAll()[0];

  const updated = App.markAbsensi(target.nim);
  if (!updated) return;

  document.getElementById('modal-name').textContent = updated.nama;
  document.getElementById('modal-nim').textContent  = updated.nim;
  document.getElementById('modal-time').textContent = updated.waktu;

  // Pakai Bootstrap Modal API
  const modalEl = document.getElementById('scanModal');
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

// ── Rekap ────────────────────────────────────────────────────
function initRekapPage() {
  const rekap = App.getRekapKelas();
  const bars  = document.getElementById('chart-bars');
  const tbody = document.getElementById('rekap-tbody');

  if (bars) {
    bars.innerHTML = rekap.map(r => {
      const color = r.pct >= 80 ? '#2d6a4f' : r.pct >= 70 ? '#f59e0b' : '#ef4444';
      return `
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="fw-semibold" style="font-size:.875rem;">${r.kelas}</span>
            <span class="fw-bold" style="font-size:.875rem; color:${color};">${r.pct}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${r.pct}%; background:${color};"></div>
          </div>
        </div>`;
    }).join('');
  }

  if (tbody) {
    tbody.innerHTML = rekap.map(r => {
      const badgeCls = r.pct >= 80 ? 'text-bg-success' : r.pct >= 70 ? 'text-bg-warning text-dark' : 'text-bg-danger';
      const label    = r.pct >= 80 ? 'Baik' : r.pct >= 70 ? 'Cukup' : 'Rendah';
      return `
        <tr>
          <td>${r.kelas}</td>
          <td>${r.hadir} / ${r.total}</td>
          <td class="fw-semibold">${r.pct}%</td>
          <td><span class="badge ${badgeCls}">${label}</span></td>
        </tr>`;
    }).join('');
  }
}

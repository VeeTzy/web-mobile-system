/* ============================================================
   data.js — Application Data & State
   Nantinya fungsi CRUD di sini tinggal diganti fetch() ke API.
   ============================================================ */
'use strict';

const App = {
  currentUser: null,

  mahasiswa: [
    { nim:'22110001', nama:'Ricky Pratama',  username:'ricky22',  kelas:'TI-A 2022', status:'hadir', waktu:'08:02' },
    { nim:'22110002', nama:'Aulia Rahma',    username:'aulia22',  kelas:'TI-A 2022', status:'hadir', waktu:'08:05' },
    { nim:'22110003', nama:'Bagas Wibowo',   username:'bagas22',  kelas:'TI-B 2022', status:'hadir', waktu:'08:11' },
    { nim:'22110004', nama:'Citra Dewi',     username:'citra22',  kelas:'TI-B 2022', status:'absen', waktu:'—'     },
    { nim:'22110005', nama:'Dika Fauzan',    username:'dika22',   kelas:'SI-A 2022', status:'izin',  waktu:'—'     },
    { nim:'22110006', nama:'Eka Putri',      username:'eka22',    kelas:'SI-A 2022', status:'hadir', waktu:'08:03' },
    { nim:'22110007', nama:'Fajar Nugroho',  username:'fajar22',  kelas:'TI-A 2023', status:'absen', waktu:'—'     },
    { nim:'22110008', nama:'Gita Saraswati', username:'gita22',   kelas:'TI-A 2023', status:'hadir', waktu:'08:15' },
    { nim:'22110009', nama:'Hendra Kusuma',  username:'hendra22', kelas:'TI-B 2023', status:'hadir', waktu:'08:09' },
    { nim:'22110010', nama:'Indah Permata',  username:'indah22',  kelas:'SI-B 2022', status:'izin',  waktu:'—'     },
  ],

  getStats() {
    return {
      total: this.mahasiswa.length,
      hadir: this.mahasiswa.filter(m => m.status === 'hadir').length,
      absen: this.mahasiswa.filter(m => m.status === 'absen').length,
      izin:  this.mahasiswa.filter(m => m.status === 'izin').length,
    };
  },

  getRekapKelas() {
    const kelasList = [...new Set(this.mahasiswa.map(m => m.kelas))];
    return kelasList.map(kelas => {
      const mhs   = this.mahasiswa.filter(m => m.kelas === kelas);
      const hadir = mhs.filter(m => m.status === 'hadir').length;
      return { kelas, total: mhs.length, hadir, pct: Math.round((hadir / mhs.length) * 100) };
    });
  },

  getMahasiswaAll()      { return this.mahasiswa; },
  getMahasiswaByNIM(nim) { return this.mahasiswa.find(m => m.nim === nim) || null; },

  addMahasiswa(data) {
    if (this.getMahasiswaByNIM(data.nim)) return { ok: false, msg: 'NIM sudah terdaftar.' };
    this.mahasiswa.push({ ...data, status: 'absen', waktu: '—' });
    return { ok: true };
  },

  deleteMahasiswa(nim) {
    const idx = this.mahasiswa.findIndex(m => m.nim === nim);
    if (idx === -1) return false;
    this.mahasiswa.splice(idx, 1);
    return true;
  },

  markAbsensi(nim) {
    const mhs = this.getMahasiswaByNIM(nim);
    if (!mhs) return null;
    mhs.status = 'hadir';
    mhs.waktu  = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    return mhs;
  },

  CREDENTIALS: { username: 'admin', password: '1234' },
  login(u, p)  { if (u === this.CREDENTIALS.username && p === this.CREDENTIALS.password) { this.currentUser = { username: u }; return true; } return false; },
  logout()     { this.currentUser = null; },
  isLoggedIn() { return this.currentUser !== null; },
};

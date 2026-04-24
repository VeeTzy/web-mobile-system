# SiAbsen — Sistem Informasi Absensi Digital

> Aplikasi absensi digital berbasis web untuk lingkungan kampus, dibangun dengan **Bootstrap 5** dan arsitektur multi-file.

---

## 📋 Deskripsi

SiAbsen adalah prototype frontend sistem absensi kampus yang menampilkan alur lengkap dari login hingga rekap kehadiran. Dibangun dengan pendekatan **Bootstrap-first** — komponen Bootstrap dipakai semaksimal mungkin, custom CSS hanya untuk hal yang Bootstrap tidak bisa tangani.

---

## 🗂️ Struktur Folder

```
siabsen/
├── index.html          ← Login page
├── dashboard.html      ← Dashboard + stat cards
├── mahasiswa.html      ← Data mahasiswa + search
├── qrscan.html         ← QR Scanner + modal konfirmasi
├── register.html       ← Form tambah mahasiswa
├── rekap.html          ← Rekap & statistik absensi
├── _sidebar.html       ← Sidebar component (di-fetch JS)
├── css/
│   └── custom.css      ← Custom CSS (~130 baris, hanya non-Bootstrap)
└── js/
    ├── data.js         ← Data & state (siap diganti API)
    ├── auth.js         ← Login, logout, route guard
    └── app.js          ← UI logic per halaman
```

---

## ✨ Fitur

| Halaman | Fitur |
|---|---|
| **Login** | Validasi form, toggle password, alert error |
| **Dashboard** | Stat cards (total/hadir/izin/absen), tabel absensi terbaru |
| **Data Mahasiswa** | Tabel lengkap, search real-time, hapus data |
| **QR Scanner** | Animasi scan, simulasi absensi, Bootstrap Modal konfirmasi |
| **Tambah Mahasiswa** | Form validasi (NIM duplikat, password match, field kosong) |
| **Rekap Absensi** | Bar chart per kelas, tabel ringkasan dengan badge status |

---

## 🛠️ Tech Stack

- **Bootstrap 5.3.3** — Framework CSS utama
- **Bootstrap Icons 1.11.3** — Icon set
- **Plus Jakarta Sans** — Font utama (Google Fonts)
- **JetBrains Mono** — Font untuk NIM (Google Fonts)
- **Vanilla JavaScript** — Tanpa framework JS tambahan

---

## 🚀 Cara Menjalankan

> ⚠️ **Harus pakai web server lokal** — tidak bisa dibuka langsung dengan double-click karena sidebar di-load via `fetch()`.

### Opsi 1 — VS Code Live Server (Rekomendasi)

1. Buka folder `siabsen/` di VS Code
2. Install extension **Live Server** by Ritwick Dey (`Ctrl+Shift+X`)
3. Klik kanan `index.html` → **Open with Live Server**
4. Browser otomatis terbuka di `http://127.0.0.1:5500`

### Opsi 2 — Python

```bash
cd siabsen
python -m http.server 8000
# buka http://localhost:8000
```

### Opsi 3 — Node.js

```bash
cd siabsen
npx serve .
# atau
npm install -g live-server && live-server
```

---

## 🔑 Kredensial Demo

| Username | Password |
|---|---|
| `admin` | `1234` |

---

## 📦 Komponen Bootstrap yang Dipakai

`Navbar` `Card` `Table` `Modal` `Alert` `Badge` `Button` `Form Control` `Form Select` `Input Group` `List Group` `Grid System` `Spacing Utils` `Display Utils` `Shadow Utils` `Rounded Utils`

---

## 📁 Penjelasan JS Modules

### `js/data.js`
Pusat data aplikasi. Berisi array mahasiswa, fungsi CRUD, dan simulasi auth. Saat integrasi backend, **hanya file ini yang perlu diubah** — tidak perlu menyentuh file lain.

```js
App.getStats()           // hitung total/hadir/absen/izin
App.addMahasiswa(data)   // tambah mahasiswa, cek duplikasi NIM
App.deleteMahasiswa(nim) // hapus berdasarkan NIM
App.markAbsensi(nim)     // update status hadir + catat waktu
App.login(user, pass)    // validasi kredensial
```

### `js/auth.js`
Login, logout, simpan sesi ke `sessionStorage`, populate topbar/sidebar, dan highlight nav aktif berdasarkan URL.

### `js/app.js`
UI logic per halaman: render tabel, filter/search, submit form, simulasi QR scan, render bar chart rekap, dan `loadSidebar()` yang fetch `_sidebar.html`.

---

## 🔮 Rencana Pengembangan

- [ ] QR Scanner kamera nyata (html5-qrcode / jsQR)
- [ ] Integrasi REST API backend
- [ ] Autentikasi JWT
- [ ] Export laporan PDF / Excel
- [ ] Dark mode (`data-bs-theme="dark"`)
- [ ] Pagination tabel
- [ ] Grafik interaktif (Chart.js)
- [ ] PWA support (offline)

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik.

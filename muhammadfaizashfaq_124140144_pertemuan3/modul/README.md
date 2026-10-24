# 🧩 Latihan Mandiri — Pertemuan 3 (React Basics)

Folder ini berisi jawaban **latihan mandiri** dari setiap submodul materi
Pertemuan 3. Setiap latihan disimpan di foldernya sendiri agar bisa dibuka dan
dipelajari secara terpisah.

## Cara Menjalankan

Tidak perlu `npm install`. Setiap folder berisi satu file `index.html` mandiri
yang memuat React 18, ReactDOM, Babel Standalone, dan (bila perlu) React Router
langsung dari CDN.

1. Buka folder latihan yang ingin dilihat.
2. Klik dua kali `index.html`, atau klik kanan lalu pilih **Open with Live Server** di VS Code.
3. Halaman langsung berjalan di browser.

> Halaman latihan memerlukan koneksi internet karena library diambil dari CDN.

## Daftar Latihan

| Folder | Latihan pada modul | Yang ditampilkan |
|---|---|---|
| `01-eksplorasi-hmr/` | Submodul 1 — Eksplorasi HMR | Header dengan warna `#0d9488` (hasil latihan) dan tombol pembanding warna awal `#3498db`; React memperbarui tampilan tanpa reload |
| `02-children-props/` | Submodul 2 — Children Props | Komponen `Card` dengan `props.children` yang dipakai membungkus `TaskForm` dan daftar tugas |
| `03-hapus-semua-tugas/` | Submodul 3 — Tombol Bersihkan Semua | Panel statistik dengan tombol **Hapus Semua Tugas** yang memanggil `window.confirm()` sebelum `setTasks([])` |
| `04-halaman-404/` | Submodul 4 — Halaman 404 | Navbar, rute `/`, `/about`, dan rute penangkap `path="*"` yang menampilkan halaman 404 |
| `05-usewindowsize/` | Submodul 5 — Terapkan `useWindowSize` | Badge "Mode Layar Mobile" (< 768px) dan "Mode Layar Desktop", diperbarui saat jendela di-resize |
| `06-statistik-about/` | Submodul 6 — Statistik di Halaman About | Halaman About membaca `stats.total` dari Context API tanpa menerima props |

## Catatan Teknis

- **Latihan 1 (HMR).** Hot Module Replacement hanya aktif pada development server
  React (`npm run dev` atau `npm start`). Halaman latihan menampilkan hasil akhir
  perubahan warna sekaligus mendemonstrasikan pembaruan UI tanpa memuat ulang
  dokumen.
- **Latihan 4 dan 6 (routing).** Karena dibuka langsung dari filesystem, kedua
  halaman memakai `HashRouter` (`index.html#/about`). Pada project React di folder
  `tugas-manajemen-buku/`, routing memakai `BrowserRouter` dengan path yang sama.
- **Penyimpanan data.** Latihan 3 dan 6 menyimpan tugas di `localStorage` dengan
  `try/catch`, sehingga tetap aman bila browser membatasi penyimpanan pada
  halaman `file://`.

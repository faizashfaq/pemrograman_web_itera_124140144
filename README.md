# Praktikum Pengembangan Aplikasi Web

**Repository pengumpulan tugas dan jawaban latihan**


## 📋 Identitas

| | |
|---|---|
| **Nama Lengkap** | Muhammad Faiz Ashfaq |
| **NIM** | 124140144 |
| **Kelas Praktikum** | Praktikum Pengembangan Aplikasi Web (RA) |
| **Repository** | `faizashfaq/pemrograman_web_itera_124140144` |

---

## 📂 Isi Repository

Setiap pertemuan disimpan di folder tersendiri. Tiap folder punya README lengkap
yang menjelaskan fitur, struktur kode, screenshot, dan ringkasan pengujiannya.

| Pertemuan | Topik | Aplikasi | Dokumentasi |
|---|---|---|---|
| **1** | JavaScript Dasar | **Mini POS** — simulasi kasir dan keranjang belanja sederhana | [README pertemuan 1](muhammadfaizashfaq_124140144_pertemuan1/README.md) |
| **2** | JavaScript Next Gen (ES6+) | **HayuMencatat** — dashboard catatan pribadi dengan widget cuaca ITERA | [README pertemuan 2](muhammadfaizashfaq_124140144_pertemuan2/README.md) |

### Pertemuan 1 — Mini POS

Aplikasi kasir kantin sederhana, lengkap dengan validasi input barang, kalkulator
total belanja dengan kode promo dan diskon otomatis, perhitungan kembalian,
manajemen keranjang, serta penyimpanan data ke `localStorage`.

**Materi yang dipraktikkan:** `var`/`let`/`const`, struktur kondisional, `switch`,
perulangan, fungsi, event handler, array, objek, manipulasi DOM, dan Fetch API.

### Pertemuan 2 — HayuMencatat

Dashboard catatan pribadi dengan operasi CRUD penuh, pencarian, filter kategori,
pengurutan, penyematan catatan, dan ekspor/impor JSON. Widget cuaca ITERA diambil
real-time dari Open-Meteo, kutipan harian dari DummyJSON, keduanya asinkron dan
diproses secara paralel.

**Materi yang dipraktikkan:** `let`/`const`, arrow function, template literals,
destructuring, spread dan rest operator, default parameter, class, enhanced object
literals, modern array methods, serta `async`/`await` dengan `Promise.allSettled`.

Folder `modul/` di dalam pertemuan 2 berisi **jawaban latihan resmi** untuk
tiap bagian materi, bukan materi tutorial. Buka halaman latihannya langsung di
browser tanpa perlu instalasi apa pun.

---

## 🚀 Cara Menjalankan

Aplikasi **tidak bisa** dibuka dengan klik ganda langsung dari `file://`.
Browser memblokir `fetch()` untuk mengambil data cuaca karena kebijakan CORS.
Gunakan salah satu cara di bawah ini.

### Clone repository

```bash
git clone https://github.com/faizashfaq/pemrograman_web_itera_124140144.git
cd pemrograman_web_itera_124140144
```

### Cara 1 — Live Server (VS Code, *disarankan*)

1. Buka folder repository ini di VS Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html` di folder pertemuan yang mau dijalankan.
4. Pilih **Open with Live Server**.

### Cara 2 — Server Lokal via Terminal

Jalankan di folder root repository:

```bash
python3 -m http.server 8000
```

Atau bila sudah memakai Node.js:

```bash
npx serve .
```

Lalu buka di browser:

| Pertemuan | Alamat |
|---|---|
| 1 — Mini POS | `http://localhost:8000/muhammadfaizashfaq_124140144_pertemuan1/` |
| 2 — HayuMencatat | `http://localhost:8000/muhammadfaizashfaq_124140144_pertemuan2/` |

### Membuka halaman latihan (`modul/`)

Halaman latihan di folder `modul/` berjalan tanpa server dan tanpa internet.
Cukup buka file-nya langsung:

```
muhammadfaizashfaq_124140144_pertemuan1/modul/01-variabel-kondisional.html
muhammadfaizashfaq_124140144_pertemuan2/modul/02-template-literals.html
```

Buka juga **Console** browser (`Cmd`+`Option`+`I` di macOS, `F12` di Windows) untuk
melihat keluaran `console.log` lengkapnya.

---

## 🔗 Modul Praktikum

Dokumentasi materi modul praktikum tersedia terpisah di situs berikut:

👉 **https://praktikum-paw20262027.vercel.app/**

Situs tersebut berisi materi teori, panduan langkah demi langkah, dan daftar
latihan untuk tiap pertemuan. Repository ini berisi **hasil pengerjaan**,
yaitu aplikasi tugas dan jawaban latihan.

---

## 🛠️ Teknologi

| Teknologi | Peran |
|---|---|
| **HTML5** | Struktur semantik dan atribut aksesibilitas |
| **CSS3** | Custom property, Grid, Flexbox, dan media query responsif |
| **JavaScript** | Vanilla ES6+, tanpa framework |
| **localStorage** | Penyimpanan data di sisi klien |
| **Blob & FileReader** | Ekspor dan impor data JSON |
| **Open-Meteo** | Data cuaca real-time (gratis, tanpa API key) |
| **DummyJSON** | Kutipan harian (gratis, tanpa API key) |

Tidak ada dependensi. Repository ini bisa di-*clone* dan langsung dijalankan.

---

<div align="center">

</div>

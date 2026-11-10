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
| **3** | React Basics | **KutuBUKU** — aplikasi manajemen buku pribadi berbasis React | [README pertemuan 3](muhammadfaizashfaq_124140144_pertemuan3/README.md) |
| **4** | Python Dasar | Tiga program tugas (BMI, nilai mahasiswa, modul matematika) + enam latihan | [README pertemuan 4](muhammadfaizashfaq_124140144_pertemuan4/README.md) |
| **5** | Python OOP | **Sistem Manajemen Perpustakaan** + enam latihan mandiri OOP | [README pertemuan 5](muhammadfaizashfaq_124140144_pertemuan5/README.md) |

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

### Pertemuan 3 — KutuBUKU

Aplikasi manajemen buku pribadi untuk mencatat buku yang dimiliki, sedang dibaca,
atau ingin dibeli. Mendukung tambah, edit, hapus, filter status, pencarian
berdasarkan judul atau nama penulis, halaman statistik, serta penyimpanan
permanen di `localStorage`.

Dibangun dengan **React 19 + Vite**: functional components, Hooks, Context API,
React Router, dua custom hook, PropTypes pada seluruh komponen, dan 8 unit test
dengan Vitest + React Testing Library.

Project React-nya berada di folder `tugas-manajemen-buku/`. Jawaban latihan
mandiri tiap submodul disimpan di folder `modul/` (satu folder per latihan) dan
bisa dibuka langsung di browser tanpa instalasi.

**Materi yang dipraktikkan:** component-based architecture, JSX, props,
`useState`, `useEffect`, controlled component, conditional rendering, list dan
key, React Router, Context API, custom hooks, serta pengujian komponen.

### Pertemuan 4 — Python Dasar

Tiga program tugas: **penghitung BMI** dengan kategori berat badan, **pengelolaan
data nilai mahasiswa** (list berisi dictionary, perhitungan nilai akhir, grade
A–E, tabel, dan nilai ekstrem), serta **modul matematika** (`math_operations.py`)
dengan fungsi geometri dan konversi suhu beserta program penguji `main.py` yang
menerapkan dua cara import. Dilengkapi enam latihan mandiri di folder `latihan/`.

**Materi yang dipraktikkan:** variabel & tipe data, operator, struktur kendali
(`if`/loop), fungsi, struktur data (`list`, `tuple`, `dictionary`, `set`), serta
modul & package. Seluruh berkas murni Python tanpa dependensi eksternal.

### Pertemuan 5 — Python OOP

Enam latihan mandiri (satu per materi): pemodelan entitas toko online, class
`Buku` dengan dunder method, subclass `Truk(Kendaraan)`, encapsulation class
`Karyawan`, sistem notifikasi multi-channel polymorphism, dan abstract class
`FileStorage(ABC)`.

Tugas praktikumnya adalah **Sistem Manajemen Perpustakaan Sederhana** di folder
`tugas_perpustakaan/`: abstract class `LibraryItem(ABC)` dengan subclass `Book`
dan `Magazine`, class `Library` dengan koleksi private `__koleksi`, property
`is_dipinjam`, serta fungsionalitas menambah item, menampilkan katalog tersedia,
dan mencari item berdasarkan judul atau id.

**Materi yang dipraktikkan:** class & object, constructor & `self`, inheritance
dan `super()`, encapsulation dengan access modifier dan `@property`, polymorphism
(method overriding, duck typing), serta abstract class dengan `abc.ABC` dan
`@abstractmethod`.

---

## 🚀 Cara Menjalankan

Pertemuan 1–3 adalah aplikasi web, pertemuan 4–5 adalah program Python murni.
Semua bisa dijalankan tanpa dependensi tambahan kecuali project React pada
pertemuan 3.

### Clone repository

```bash
git clone https://github.com/faizashfaq/pemrograman_web_itera_124140144.git
cd pemrograman_web_itera_124140144
```

### Cara 1 — Live Server (VS Code, *disarankan* untuk pertemuan 1–2)

1. Buka folder repository ini di VS Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html` di folder pertemuan yang mau dijalankan.
4. Pilih **Open with Live Server**.

Aplikasi web **tidak bisa** dibuka dengan klik ganda langsung dari `file://`.
Browser memblokir `fetch()` untuk mengambil data cuaca karena kebijakan CORS.

### Cara 2 — Server Lokal via Terminal (pertemuan 1–2)

Jalankan di folder root repository:

```bash
python3 -m http.server 8000
```

Lalu buka di browser:

| Pertemuan | Alamat |
|---|---|
| 1 — Mini POS | `http://localhost:8000/muhammadfaizashfaq_124140144_pertemuan1/` |
| 2 — HayuMencatat | `http://localhost:8000/muhammadfaizashfaq_124140144_pertemuan2/` |

### Cara 3 — React (Pertemuan 3)

Pertemuan 3 adalah project React dengan dependensi, jadi dijalankan melalui npm,
bukan Live Server:

```bash
cd muhammadfaizashfaq_124140144_pertemuan3/tugas-manajemen-buku
npm install
npm run dev
```

Buka `http://localhost:5173`. Perintah `npm test` menjalankan unit test, sedangkan
`npm run build` membuat bundle produksi.

Jawaban latihan mandiri ada di `muhammadfaizashfaq_124140144_pertemuan3/modul/`.
Tiap folder latihan berisi satu `index.html` yang bisa dibuka langsung di browser
(memerlukan koneksi internet untuk memuat React dari CDN).

### Cara 4 — Python (Pertemuan 4 & 5)

Program Python dijalankan langsung dari terminal, tanpa instalasi apa pun:

```bash
# Pertemuan 4 — pilih salah satu program
cd muhammadfaizashfaq_124140144_pertemuan4
python3 main.py                # pengujian modul math_operations
python3 tugas1_bmi.py          # penghitung BMI
python3 tugas2_nilai_mahasiswa.py

# Pertemuan 5 — tugas Sistem Manajemen Perpustakaan
cd muhammadfaizashfaq_124140144_pertemuan5/tugas_perpustakaan
python3 main.py
```

Latihan mandiri pertemuan 5 ada di folder `latihan/`, masing-masing dijalankan
dengan `python3 <nama_file>.py`.

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
| **JavaScript** | Vanilla ES6+ pada pertemuan 1 dan 2 |
| **React 19** | Library UI pada pertemuan 3 (components, hooks, Context API) |
| **React Router** | Navigasi multi-halaman tanpa reload pada pertemuan 3 |
| **Vite** | Build tool dan dev server untuk project React |
| **Vitest + React Testing Library** | Pengujian komponen React |
| **Python 3** | Seluruh program pada pertemuan 4 dan 5 (tanpa dependensi eksternal) |
| **abc (stdlib Python)** | Abstract class dan `@abstractmethod` pada pertemuan 5 |
| **localStorage** | Penyimpanan data di sisi klien |
| **Blob & FileReader** | Ekspor dan impor data JSON |
| **Open-Meteo** | Data cuaca real-time (gratis, tanpa API key) |
| **DummyJSON** | Kutipan harian (gratis, tanpa API key) |

Pertemuan 1 dan 2 tidak memiliki dependensi dan bisa langsung dijalankan. Pertemuan 3
memerlukan `npm install` sebelum `npm run dev`. Pertemuan 4 dan 5 murni Python
dan langsung dijalankan lewat terminal.

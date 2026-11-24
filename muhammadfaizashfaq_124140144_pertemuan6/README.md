# Pyramid Framework — Tugas Praktikum Pertemuan 6

**Tugas Praktikum Pengembangan Aplikasi Web — Pertemuan 6: Pyramid Framework**
Program Studi Teknik Informatika · ITERA · T.A. 2026/2027 Gasal

---

## 📋 Identitas

| | |
|---|---|
| **Nama Lengkap** | Muhammad Faiz Ashfaq |
| **NIM** | 124140144 |
| **Kelas Praktikum** | RA |
| **Pertemuan** | 6 — Pyramid Framework |
| **Mata Kuliah** | Praktikum Pengembangan Aplikasi Web |
| **Repository** | `pemrograman_web_itera_124140144` |

---

## 📖 Deskripsi

Aplikasi **RESTful API sederhana** berbasis **Pyramid + PostgreSQL + SQLAlchemy**
untuk mengelola dua entitas:

1. **Mahasiswa** — modul dasar yang dipelajari pada praktikum.
2. **Matakuliah** — modul tugas praktikum.

Keduanya mengimplementasikan **lima operasi CRUD** penuh (`GET`, `GET/{id}`,
`POST`, `PUT`, `DELETE`) lengkap dengan validasi input dan status code HTTP yang
tepat (`200`, `400`, `404`).

---

## 📂 Struktur Direktori

```text
muhammadfaizashfaq_124140144_pertemuan6/
├── development.ini
├── production.ini
├── setup.py
├── README.md
├── .gitignore
└── pyramid_mahasiswa/
    ├── __init__.py
    ├── routes.py
    ├── alembic/
    │   ├── env.py
    │   └── versions/
    │       ├── 20261112_create_mahasiswa_table.py
    │       └── 20261112_create_matakuliah_table.py
    ├── models/
    │   ├── __init__.py
    │   ├── meta.py
    │   ├── mahasiswa.py
    │   └── matakuliah.py
    ├── scripts/
    │   ├── __init__.py
    │   └── initialize_db.py
    └── views/
        ├── __init__.py
        ├── default.py
        ├── mahasiswa.py
        └── matakuliah.py
```

---

## 🔌 Daftar Endpoint API

### Mahasiswa

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/mahasiswa` | Menampilkan seluruh mahasiswa |
| `GET` | `/api/mahasiswa/{id}` | Detail satu mahasiswa (404 jika tidak ada) |
| `POST` | `/api/mahasiswa` | Menambah mahasiswa baru |
| `PUT` | `/api/mahasiswa/{id}` | Memperbarui data mahasiswa |
| `DELETE` | `/api/mahasiswa/{id}` | Menghapus mahasiswa |

### Matakuliah (Tugas)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/matakuliah` | Menampilkan seluruh mata kuliah |
| `GET` | `/api/matakuliah/{id}` | Detail satu mata kuliah (404 jika tidak ada) |
| `POST` | `/api/matakuliah` | Menambah mata kuliah baru |
| `PUT` | `/api/matakuliah/{id}` | Memperbarui data mata kuliah |
| `DELETE` | `/api/matakuliah/{id}` | Menghapus mata kuliah |

**Field wajib Matakuliah:** `kode_mk`, `nama_mk`, `sks`, `semester`.
Nilai `sks` dan `semester` wajib **integer positif** (ditolak dengan `400` bila
kosong, bukan angka, nol, atau negatif).

---

## 🚀 Langkah Instalasi & Menjalankan

### 1. Prasyarat

```bash
python3 --version   # disarankan Python 3.10 ke atas
psql --version      # PostgreSQL client
```

### 2. Virtual environment & dependensi

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate.bat

pip install --upgrade pip setuptools
pip install -e .                  # memasang aplikasi + semua dependensi
```

> Proyek ini dibuat dari template resmi
> `cookiecutter gh:Pylons/pyramid-cookiecutter-alchemy` (template `jinja2`),
> lalu disesuaikan dengan materi Pertemuan 6.

### 3. Menyiapkan database PostgreSQL

Masuk ke shell psql sebagai superuser:

```bash
psql -U postgres
```

Jalankan perintah SQL berikut:

```sql
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;

-- Khusus PostgreSQL 15 ke atas:
\c pyramid_mahasiswa
GRANT ALL ON SCHEMA public TO pyramid_user;
\q
```

URI koneksi sudah tersetel di `development.ini`:

```ini
sqlalchemy.url = postgresql+psycopg2://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
```

> **Catatan driver:** modul memakai paket `psycopg2-binary`. Karena SQLAlchemy
> 2.1 ke atas mengubah driver default skema `postgresql://` menjadi `psycopg`
> (v3), driver ditulis eksplisit sebagai `postgresql+psycopg2://` agar aplikasi
> tetap berjalan dengan `psycopg2` di semua versi SQLAlchemy.

### 4. Migrasi skema tabel (Alembic)

```bash
alembic -c development.ini upgrade head
```

### 5. Seeding data awal

```bash
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

Menambahkan 2 mahasiswa (Budi Santoso, Siti Aminah) dan 3 mata kuliah
(Pemrograman Web, Basis Data, Struktur Data).

### 6. Menjalankan server

```bash
pserve development.ini --reload
```

Server aktif di **http://localhost:6543**.

---

## 🧪 Contoh Pengujian dengan cURL

```bash
# READ ALL
curl -X GET http://localhost:6543/api/mahasiswa
curl -X GET http://localhost:6543/api/matakuliah

# READ ONE
curl -X GET http://localhost:6543/api/mahasiswa/1
curl -X GET http://localhost:6543/api/matakuliah/1

# CREATE
curl -X POST http://localhost:6543/api/mahasiswa \
  -H "Content-Type: application/json" \
  -d '{"nim":"67890","nama":"Ahmad Fadli","jurusan":"Teknik Elektro","tanggal_lahir":"2001-11-05","alamat":"Jl. Mawar No. 10, Surabaya"}'

curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF4000","nama_mk":"Kecerdasan Buatan","sks":3,"semester":6}'

# VALIDASI (400 Bad Request)
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF4001","nama_mk":"Tanpa SKS","semester":6}'

# UPDATE
curl -X PUT http://localhost:6543/api/mahasiswa/1 \
  -H "Content-Type: application/json" \
  -d '{"jurusan":"Informatika Medis","alamat":"Jl. Dipati Ukur No. 88, Bandung"}'

curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"sks":4}'

# DELETE
curl -X DELETE http://localhost:6543/api/mahasiswa/3
curl -X DELETE http://localhost:6543/api/matakuliah/3
```

---

## 🖼️ Bukti Pengujian (Screenshot)

Tangkapan layar hasil eksekusi pengujian seluruh endpoint menggunakan cURL.
Seluruh berkas tersimpan pada folder `dokumentasi/`.

### Mahasiswa

**1. `GET /api/mahasiswa`** — menampilkan seluruh mahasiswa.

![GET /api/mahasiswa](dokumentasi/mahasiswa-get-all.png)

**2. `POST /api/mahasiswa`** — menambah mahasiswa baru.

![POST /api/mahasiswa](dokumentasi/mahasiswa-post.png)

**3. `PUT` & `DELETE /api/mahasiswa/{id}`** — memperbarui lalu menghapus mahasiswa.

![PUT dan DELETE /api/mahasiswa](dokumentasi/mahasiswa-put-delete.png)

### Matakuliah

**4. `GET /api/matakuliah`** — menampilkan seluruh mata kuliah.

![GET /api/matakuliah](dokumentasi/matakuliah-get-all.png)

**5. `POST /api/matakuliah`** — menambah mata kuliah baru.

![POST /api/matakuliah](dokumentasi/matakuliah-post.png)

**6. Validasi `400 Bad Request` & `404 Not Found`** — field wajib absen, nilai
`sks` tidak valid, dan ID yang tidak ditemukan.

![Validasi status 400 dan 404](dokumentasi/validasi-error.png)

**7. `PUT` & `DELETE /api/matakuliah/{id}`** — memperbarui lalu menghapus mata kuliah.

![PUT dan DELETE /api/matakuliah](dokumentasi/matakuliah-put-delete.png)

---

## 🛠️ Teknologi

| Teknologi | Peran |
|---|---|
| **Pyramid 2** | Framework web, URL dispatch & view configuration |
| **SQLAlchemy 2** | ORM pemetaan tabel ke class Python |
| **PostgreSQL** | Database server relasional |
| **Alembic** | Manajemen migrasi skema database |
| **zope.sqlalchemy + pyramid_tm** | Transaction management per request |
| **Waitress** | WSGI server produksi |

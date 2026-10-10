/* =====================================================================
   LATIHAN 3 - ARRAY & OBJEK
   Praktikum PAW - Pertemuan 1 - Muhammad Faiz Ashfaq (124140144)
   Topik: array of object, map, filter, reduce, sort, CRUD + event handler

   Daftar latihan (menurut ketentuan modul):
   3.1 Array minimal 5 objek mahasiswa (nama, nim, jurusan, nilai)
       yang ditampilkan dalam bentuk tabel HTML
   3.2 Fungsi mencari mahasiswa dengan nilai tertinggi (method array)
   3.3 Filter dan tampilkan mahasiswa yang nilainya di atas rata-rata
   3.4 Fungsi mengurutkan mahasiswa berdasarkan nama (ascending/descending)
   3.5 Fitur CRUD sederhana (Create, Read, Update, Delete) dengan event handler
   ===================================================================== */

const hasil = document.getElementById("result");

/* =====================================================================
   3.1 - ARRAY BERISI 5 OBJEK MAHASISWA (nama, nim, jurusan, nilai)
          DITAMPILKAN DALAM BENTUK TABEL HTML
   ===================================================================== */
const mahasiswa = [
  { nama: "Andi Pratama", nim: "124140001", jurusan: "Teknik Informatika", nilai: 88 },
  { nama: "Bunga Lestari", nim: "124140002", jurusan: "Sistem Informasi", nilai: 92 },
  { nama: "Citra Dewi", nim: "124140003", jurusan: "Teknik Informatika", nilai: 75 },
  { nama: "Dimas Anggara", nim: "124140004", jurusan: "Teknik Komputer", nilai: 81 },
  { nama: "Eka Putri", nim: "124140005", jurusan: "Sistem Informasi", nilai: 69 },
];

console.log("=== 3.1 Data Mahasiswa ===");
console.table(mahasiswa);

hasil.innerHTML += `
  <h3>3.1 Data Mahasiswa (5 objek dalam array)</h3>
  <table>
    <thead>
      <tr><th>No</th><th>Nama</th><th>NIM</th><th>Jurusan</th><th>Nilai</th></tr>
    </thead>
    <tbody>
      ${mahasiswa
        .map(
          (mhs, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${mhs.nama}</td>
          <td class="angka">${mhs.nim}</td>
          <td>${mhs.jurusan}</td>
          <td class="angka">${mhs.nilai}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
  <hr>`;

/* =====================================================================
   3.2 - FUNGSI MENCARI MAHASISWA DENGAN NILAI TERTINGGI
          Menggunakan method array reduce()
   ===================================================================== */

/**
 * Mencari mahasiswa dengan nilai tertinggi.
 * @param {Array<{nama:string, nim:string, jurusan:string, nilai:number}>} data
 * @returns {object|null} objek mahasiswa,null bila data kosong
 */
function cariNilaiTertinggi(data) {
  if (data.length === 0) return null;
  return data.reduce((tertinggi, mhs) => (mhs.nilai > tertinggi.nilai ? mhs : tertinggi));
}

const tertinggi = cariNilaiTertinggi(mahasiswa);

console.log("=== 3.2 Nilai Tertinggi ===");
console.log(`${tertinggi.nama} (${tertinggi.nim}) - ${tertinggi.nilai}`);

hasil.innerHTML += `
  <h3>3.2 Mahasiswa dengan Nilai Tertinggi (reduce)</h3>
  ${
    tertinggi
      ? `<p><strong>${tertinggi.nama}</strong> (${tertinggi.nim}) dari jurusan
         ${tertinggi.jurusan} dengan nilai <strong>${tertinggi.nilai}</strong></p>`
      : `<p>Data mahasiswa kosong.</p>`
  }
  <hr>`;

/* =====================================================================
   3.3 - FILTER DAN TAMPILKAN MAHASISWA YANG NILAINYA DI ATAS RATA-RATA
   ===================================================================== */

/**
 * Menghitung rata-rata nilai seluruh mahasiswa.
 * @param {Array<{nilai:number}>} data
 * @returns {number}
 */
function hitungRataRataNilai(data) {
  if (data.length === 0) return 0;
  const total = data.reduce((jumlah, mhs) => jumlah + mhs.nilai, 0);
  return total / data.length;
}

/**
 * Menampilkan mahasiswa yang nilainya di atas rata-rata.
 * @param {Array<object>} data
 * @param {number} rataRata
 * @returns {Array<object>}
 */
function filterDiAtasRataRata(data, rataRata) {
  return data.filter((mhs) => mhs.nilai > rataRata);
}

const rataRataNilai = hitungRataRataNilai(mahasiswa);
const diAtasRataRata = filterDiAtasRataRata(mahasiswa, rataRataNilai);

console.log("=== 3.3 Di Atas Rata-Rata ===");
console.log("Rata-rata: " + rataRataNilai.toFixed(2));
console.table(diAtasRataRata);

hasil.innerHTML += `
  <h3>3.3 Mahasiswa di Atas Rata-Rata (filter)</h3>
  <p><strong>Rata-rata nilai kelas: ${rataRataNilai.toFixed(2)}</strong></p>
  <table>
    <thead><tr><th>No</th><th>Nama</th><th>NIM</th><th>Nilai</th><th>Selisih</th></tr></thead>
    <tbody>
      ${
        diAtasRataRata.length > 0
          ? diAtasRataRata
              .map(
                (mhs, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${mhs.nama}</td>
          <td class="angka">${mhs.nim}</td>
          <td class="angka">${mhs.nilai}</td>
          <td class="angka">+${(mhs.nilai - rataRataNilai).toFixed(2)}</td>
        </tr>`
              )
              .join("")
          : `<tr><td colspan="5">Tidak ada mahasiswa yang nilainya di atas rata-rata.</td></tr>`
      }
    </tbody>
  </table>
  <p><em>Total: ${diAtasRataRata.length} dari ${mahasiswa.length} mahasiswa di atas rata-rata.</em></p>
  <hr>`;

/* =====================================================================
   3.4 - FUNGSI MENGURUTKAN MAHASISWA BERDASARKAN NAMA
          (ascending / descending)
   ===================================================================== */

/**
 * Mengurutkan mahasiswa berdasarkan nama.
 * @param {Array<object>} data
 * @param {"asc"|"desc"} arah - asc = A ke Z, desc = Z ke A
 * @returns {Array<object>} array baru yang sudah terurut
 */
function urutkanNama(data, arah) {
  const salinan = [...data];
  return salinan.sort((a, b) =>
    arah === "desc" ? b.nama.localeCompare(a.nama) : a.nama.localeCompare(b.nama)
  );
}

const urutAscending = urutkanNama(mahasiswa, "asc");
const urutDescending = urutkanNama(mahasiswa, "desc");

console.log("=== 3.4 Urut Nama ===");
console.log("Ascending :", urutAscending.map((mhs) => mhs.nama).join(", "));
console.log("Descending:", urutDescending.map((mhs) => mhs.nama).join(", "));

const barisUrut = (data) =>
  data.map((mhs, i) => `<li>${i + 1}. ${mhs.nama} &mdash; ${mhs.nilai}</li>`).join("");

hasil.innerHTML += `
  <h3>3.4 Urutkan Mahasiswa Berdasarkan Nama</h3>
  <fieldset>
    <legend>Ascending (A &rarr; Z)</legend>
    <ol>${barisUrut(urutAscending)}</ol>
  </fieldset>
  <fieldset>
    <legend>Descending (Z &rarr; A)</legend>
    <ol>${barisUrut(urutDescending)}</ol>
  </fieldset>
  <hr>`;

/* =====================================================================
   3.5 - FITUR CRUD SEDERHANA (CREATE, READ, UPDATE, DELETE)
          UNTUK DATA MAHASISWA DENGAN EVENT HANDLER
   ===================================================================== */

/** Data terpisah agar latihan 3.1-3.4 tetap utuh. */
let dataCrud = mahasiswa.map((mhs) => ({ ...mhs }));

/** NIM yang sedang diedit, atau null bila sedang menambah data baru. */
let nimSedangDiubah = null;

const formCrud = document.getElementById("formCrud");
const feedbackCrud = document.getElementById("crudFeedback");

/* Mengambil elemen tampilan secara lazy, karena penulisan #result
   membuat ulang seluruh elemen anak. */
const fTabel = () => document.getElementById("crud-tbody");
const fTotal = () => document.getElementById("crudTotal");

/**
 * Menampilkan pesan pada area feedback.
 * @param {string} teks
 * @param {"sukses"|"error"|"info"} jenis
 */
function tampilkanFeedback(teks, jenis) {
  feedbackCrud.className = "pesan-" + jenis;
  feedbackCrud.textContent = teks;
}

/**
 * Mengembalikan objek mahasiswa berdasarkan NIM.
 * @param {string} nim
 * @returns {object|undefined}
 */
function cariMahasiswa(nim) {
  return dataCrud.find((mhs) => mhs.nim === nim);
}

/** Mengembalikan form ke mode "tambah data baru". */
function setModeTambah() {
  nimSedangDiubah = null;
  document.getElementById("btnCrud").textContent = "Tambah";
}

document.getElementById("btnBatalCrud").addEventListener("click", function () {
  formCrud.reset();
  setModeTambah();
  tampilkanFeedback("Mode ubah dibatalkan.", "info");
});

/* ---------------- READ: menampilkan seluruh data ---------------- */
function renderCrud() {
  const tbody = fTabel();
  const total = fTotal();

  if (!tbody) return;

  if (dataCrud.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Belum ada data mahasiswa.</td></tr>`;
  } else {
    tbody.innerHTML = dataCrud
      .map(
        (mhs, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${mhs.nama}</td>
        <td class="angka">${mhs.nim}</td>
        <td>${mhs.jurusan}</td>
        <td class="angka">${mhs.nilai}</td>
        <td>
          <button class="btn-mini" type="button" data-ubah="${mhs.nim}">Ubah</button>
          <button class="btn-mini btn-mini--hapus" type="button" data-hapus="${mhs.nim}">Hapus</button>
        </td>
      </tr>`
      )
      .join("");
  }

  if (total) {
    total.textContent = dataCrud.length;
  }
}

/* ---------------- CREATE & UPDATE: event handler form ---------------- */
formCrud.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = document.getElementById("crudNama").value.trim();
  const nim = document.getElementById("crudNim").value.trim();
  const jurusan = document.getElementById("crudJurusan").value.trim();
  const nilaiMentah = document.getElementById("crudNilai").value.trim();

  /* ---- Validasi input ---- */
  const galat = [];

  if (nama.length < 3) {
    galat.push("Nama minimal 3 karakter");
  }
  if (!/^\d{9}$/.test(nim)) {
    galat.push("NIM harus 9 digit angka");
  }
  if (jurusan.length < 3) {
    galat.push("Jurusan minimal 3 karakter");
  }
  if (nilaiMentah === "" || !Number.isFinite(Number(nilaiMentah))) {
    galat.push("Nilai harus berupa angka");
  } else if (Number(nilaiMentah) < 0 || Number(nilaiMentah) > 100) {
    galat.push("Nilai harus di antara 0 dan 100");
  }

  const sudahAda = cariMahasiswa(nim);
  if (sudahAda && sudahAda.nim !== nimSedangDiubah) {
    galat.push(`NIM ${nim} sudah terdaftar`);
  }

  if (galat.length > 0) {
    tampilkanFeedback("Data ditolak: " + galat.join("; ") + ".", "error");
    return;
  }

  const dataBaru = { nama, nim, jurusan, nilai: Number(nilaiMentah) };

  if (nimSedangDiubah !== null) {
    /* ---- UPDATE ---- */
    const posisi = dataCrud.findIndex((mhs) => mhs.nim === nimSedangDiubah);
    if (posisi !== -1) {
      dataCrud[posisi] = dataBaru;
      tampilkanFeedback(`Data "${nama}" berhasil diperbarui.`, "sukses");
    }
  } else {
    /* ---- CREATE ---- */
    dataCrud.push(dataBaru);
    tampilkanFeedback(`Data "${nama}" berhasil ditambahkan.`, "sukses");
  }

  renderCrud();
  formCrud.reset();
  setModeTambah();
});

/* =====================================================================
   PLACEHOLDER 3.5 - ditulis setelah bagian lain selesai, karena
   penulisan #result membuat ulang seluruh elemen anak di dalamnya.
   ===================================================================== */
hasil.innerHTML += `
  <h3>3.5 CRUD Sederhana Data Mahasiswa</h3>
  <p>
    <strong>Create</strong>: isi form lalu tekan "Tambah" &middot;
    <strong>Read</strong>: data otomatis tampil pada tabel di bawah &middot;
    <strong>Update</strong>: tekan "Ubah" pada baris, form terisi, lalu "Simpan Perubahan" &middot;
    <strong>Delete</strong>: tekan "Hapus" pada baris.
  </p>
  <div id="crudOutput">
    <table>
      <thead>
        <tr><th>No</th><th>Nama</th><th>NIM</th><th>Jurusan</th><th>Nilai</th><th>Aksi</th></tr>
      </thead>
      <tbody id="crud-tbody"></tbody>
    </table>
    <p><em>Total data: <strong id="crudTotal"></strong> mahasiswa</em></p>
  </div>`;

/* ---------------- UPDATE & DELETE: klik tombol pada tabel ---------------- */
document.getElementById("crudOutput").addEventListener("click", function (event) {
  const tombolUbah = event.target.closest("[data-ubah]");
  const tombolHapus = event.target.closest("[data-hapus]");

  /* ---- UPDATE: isi form dengan data yang dipilih ---- */
  if (tombolUbah) {
    const mhs = cariMahasiswa(tombolUbah.dataset.ubah);
    if (!mhs) return;

    nimSedangDiubah = mhs.nim;
    document.getElementById("crudNama").value = mhs.nama;
    document.getElementById("crudNim").value = mhs.nim;
    document.getElementById("crudJurusan").value = mhs.jurusan;
    document.getElementById("crudNilai").value = mhs.nilai;

    document.getElementById("btnCrud").textContent = "Simpan Perubahan";
    tampilkanFeedback(`Mode ubah aktif untuk NIM ${mhs.nim}.`, "info");
    document.getElementById("crudNama").focus();
    return;
  }

  /* ---- DELETE ---- */
  if (tombolHapus) {
    const nim = tombolHapus.dataset.hapus;
    const mhs = cariMahasiswa(nim);
    if (!mhs) return;

    dataCrud = dataCrud.filter((item) => item.nim !== nim);

    if (nimSedangDiubah === nim) {
      setModeTambah();
      formCrud.reset();
    }

    renderCrud();
    tampilkanFeedback(`Data "${mhs.nama}" (${nim}) berhasil dihapus.`, "sukses");
  }
});

/* Tabel baru dibuat -> jalankan render pertama kali */
renderCrud();
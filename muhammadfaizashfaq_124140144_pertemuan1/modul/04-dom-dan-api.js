/* =====================================================================
   LATIHAN 4 - DOM & API
   Praktikum PAW - Pertemuan 1 - Muhammad Faiz Ashfaq (124140144)
   Topik: event handler, DOM manipulation, localStorage,
          Fetch API, async/await, classList

   Daftar latihan (menurut ketentuan modul):
   4.1 Form input untuk menambahkan data mahasiswa baru dengan validasi form
   4.2 Implementasikan localStorage untuk menyimpan data mahasiswa secara persisten
   4.3 Tambahkan fitur search/filter pada daftar post dari API berdasarkan title
   4.4 Buat fitur dark mode toggle menggunakan manipulasi class CSS
   4.5 Implementasikan pagination data dari API dengan tombol Previous dan Next
   4.6 Buat aplikasi Todo List sederhana dengan fitur tambah, hapus, dan
       tandai selesai menggunakan DOM manipulation dan localStorage
   ===================================================================== */

const URL_API = "https://jsonplaceholder.typicode.com/posts";

/* =====================================================================
   4.4 - DARK MODE TOGGLE (MANIPULASI CLASS CSS)
   ===================================================================== */
const btnDarkMode = document.getElementById("btn-dark-mode");
const statusTema = document.getElementById("status-tema");
const KUNCI_TEMA = "tema_pertemuan1_124140144";

/**
 * Mengaktifkan atau menonaktifkan mode gelap dengan memanipulasi class CSS.
 * @param {"gelap"|"terang"} tema
 */
function terapkanTema(tema) {
  // manipulasi class CSS pada elemen <body>
  document.body.classList.toggle("gelap", tema === "gelap");

  btnDarkMode.textContent = tema === "gelap" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap";
  statusTema.textContent = "Tema aktif: " + (tema === "gelap" ? "Gelap" : "Terang");

  localStorage.setItem(KUNCI_TEMA, tema);
}

btnDarkMode.addEventListener("click", function () {
  const sedangGelap = document.body.classList.contains("gelap");
  terapkanTema(sedangGelap ? "terang" : "gelap");
});

// pulihkan tema pilihan sebelumnya saat halaman dibuka
terapkanTema(localStorage.getItem(KUNCI_TEMA) === "gelap" ? "gelap" : "terang");

/* =====================================================================
   4.1 - FORM INPUT DATA MAHASISWA BARU DENGAN VALIDASI FORM
   4.2 - LOCALSTORAGE UNTUK MENYIMPAN DATA MAHASISWA SECARA PERSISTEN
   ===================================================================== */
const KUNCI_MHS = "mahasiswa_pertemuan1_124140144";
let daftarMahasiswa = [];

const formMahasiswa = document.getElementById("form-mahasiswa");
const feedbackMahasiswa = document.getElementById("feedback-mahasiswa");
const storageStatus = document.getElementById("storage-status");

/**
 * Memuat daftar mahasiswa dari localStorage.
 * @returns {Array<object>}
 */
function muatMahasiswa() {
  try {
    const mentah = localStorage.getItem(KUNCI_MHS);
    if (!mentah) return [];
    const parsed = JSON.parse(mentah);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Data mahasiswa rusak, memuat daftar kosong:", error);
    localStorage.removeItem(KUNCI_MHS);
    return [];
  }
}

/**
 * Menyimpan daftar mahasiswa ke localStorage dalam bentuk JSON string.
 */
function simpanMahasiswa() {
  try {
    localStorage.setItem(KUNCI_MHS, JSON.stringify(daftarMahasiswa));
  } catch (error) {
    console.error("Gagal menyimpan data mahasiswa:", error);
  }
}

/**
 * Menampilkan daftar mahasiswa pada tabel (Read).
 */
function renderMahasiswa() {
  const wadah = document.getElementById("daftar-mahasiswa");

  if (daftarMahasiswa.length === 0) {
    wadah.innerHTML = `<p class="pesan-kosong">Belum ada data mahasiswa.</p>`;
  } else {
    wadah.innerHTML = `
      <table class="tabel">
        <thead>
          <tr><th>No</th><th>Nama</th><th>NIM</th><th>Jurusan</th><th>Nilai</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          ${daftarMahasiswa
            .map(
              (mhs, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${mhs.nama}</td>
              <td class="angka">${mhs.nim}</td>
              <td>${mhs.jurusan}</td>
              <td class="angka">${mhs.nilai}</td>
              <td class="kol-aksi">
                <button class="btn-mini btn-mini--hapus" type="button" data-hapus="${mhs.nim}">Hapus</button>
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  // ringkasan penyimpanan (bagian 4.2)
  storageStatus.textContent =
    daftarMahasiswa.length === 0
      ? "localStorage kosong - belum ada data yang tersimpan."
      : `Tersimpan di localStorage: ${daftarMahasiswa.length} data mahasiswa (kunci "${KUNCI_MHS}").`;
}

/**
 * Memeriksa kelengkapan data mahasiswa.
 * @param {{nama:string, nim:string, jurusan:string, nilai:string}} data
 * @returns {string[]} daftar pesan kesalahan
 */
function validasiMahasiswa(data) {
  const galat = [];

  if (data.nama.length < 3) {
    galat.push("Nama minimal 3 karakter");
  }
  if (!/^\d{9}$/.test(data.nim)) {
    galat.push("NIM harus terdiri dari 9 digit angka");
  }
  if (data.jurusan === "") {
    galat.push("Jurusan wajib dipilih");
  }
  if (data.nilai === "" || !Number.isFinite(Number(data.nilai))) {
    galat.push("Nilai harus berupa angka");
  } else if (Number(data.nilai) < 0 || Number(data.nilai) > 100) {
    galat.push("Nilai harus di antara 0 dan 100");
  }
  if (daftarMahasiswa.some((mhs) => mhs.nim === data.nim)) {
    galat.push(`NIM ${data.nim} sudah terdaftar`);
  }

  return galat;
}

// event handler: Create
formMahasiswa.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    nama: document.getElementById("mhs-nama").value.trim(),
    nim: document.getElementById("mhs-nim").value.trim(),
    jurusan: document.getElementById("mhs-jurusan").value,
    nilai: document.getElementById("mhs-nilai").value.trim(),
  };

  const galat = validasiMahasiswa(data);

  if (galat.length > 0) {
    // data tidak valid -> tidak disimpan ke daftar
    feedbackMahasiswa.className = "pesan-error";
    feedbackMahasiswa.textContent = "Data ditolak: " + galat.join("; ") + ".";
    return;
  }

  daftarMahasiswa.push({
    nama: data.nama,
    nim: data.nim,
    jurusan: data.jurusan,
    nilai: Number(data.nilai),
  });

  simpanMahasiswa();
  renderMahasiswa();
  formMahasiswa.reset();

  feedbackMahasiswa.className = "pesan-sukses";
  feedbackMahasiswa.textContent = `Mahasiswa "${data.nama}" berhasil ditambahkan.`;
});

// event handler: Delete (event delegation)
document.getElementById("daftar-mahasiswa").addEventListener("click", function (event) {
  const tombolHapus = event.target.closest("[data-hapus]");
  if (!tombolHapus) return;

  const nim = tombolHapus.dataset.hapus;
  const mhs = daftarMahasiswa.find((item) => item.nim === nim);
  if (!mhs) return;

  daftarMahasiswa = daftarMahasiswa.filter((item) => item.nim !== nim);

  simpanMahasiswa();
  renderMahasiswa();

  feedbackMahasiswa.className = "pesan-sukses";
  feedbackMahasiswa.textContent = `Mahasiswa "${mhs.nama}" berhasil dihapus.`;
});

// event handler: hapus semua data pada localStorage
document.getElementById("btn-hapus-storage").addEventListener("click", function () {
  if (daftarMahasiswa.length === 0) return;
  if (!window.confirm("Hapus semua data mahasiswa dari localStorage?")) return;

  daftarMahasiswa = [];
  localStorage.removeItem(KUNCI_MHS);
  renderMahasiswa();

  feedbackMahasiswa.className = "pesan-info";
  feedbackMahasiswa.textContent = "Semua data mahasiswa telah dihapus dari localStorage.";
});

/* =====================================================================
   4.3 - SEARCH / FILTER DAFTAR POST DARI API BERDASARKAN TITLE
   ===================================================================== */
let semuaPost = [];

/**
 * Mengambil daftar post dari API (dengan cache agar tidak.request berulang).
 * @returns {Promise<Array<object>>}
 */
async function ambilSemuaPost() {
  if (semuaPost.length > 0) return semuaPost;

  const response = await fetch(URL_API);
  if (!response.ok) {
    throw new Error(`Server merespons ${response.status}`);
  }

  semuaPost = await response.json();
  return semuaPost;
}

document.getElementById("btn-cari-post").addEventListener("click", async function () {
  const kunci = document.getElementById("cari-post").value.trim().toLowerCase();
  const target = document.getElementById("cari-output");

  if (kunci === "") {
    target.innerHTML = `<p class="pesan-error">Ketik kata kunci pencarian terlebih dahulu.</p>`;
    return;
  }

  target.innerHTML = `<p class="pesan-info">Mencari... Mengambil data dari API.</p>`;

  try {
    const data = await ambilSemuaPost();
    const cocok = data.filter((post) => post.title.toLowerCase().includes(kunci));

    if (cocok.length === 0) {
      target.innerHTML = `<p class="pesan-error">Tidak ada post yang judulnya mengandung "${kunci}".</p>`;
      return;
    }

    target.innerHTML = `
      <p><strong>${cocok.length} post</strong> ditemukan untuk kata kunci "<strong>${kunci}</strong>".</p>
      ${cocok
        .slice(0, 10)
        .map(
          (post) => `
        <div class="post-kartu">
          <h4>${post.title}</h4>
        </div>`
        )
        .join("")}
      ${cocok.length > 10 ? `<p class="pesan-kosong">Menampilkan 10 hasil pertama dari ${cocok.length}.</p>` : ""}`;
  } catch (error) {
    console.error("Gagal mencari post:", error);
    target.innerHTML = `<p class="pesan-error">Gagal mengambil data: ${error.message}</p>`;
  }
});

/* =====================================================================
   4.5 - PAGINATION DATA DARI API DENGAN TOMBOL PREVIOUS DAN NEXT
   ===================================================================== */
const JUMLAH_PER_HALAMAN = 5;
const halamanPost = [];
let halamanSekarang = 0;

/**
 * Mengambil data post dari API lalu membaginya menjadi beberapa halaman.
 * @returns {Promise<void>}
 */
async function muatDataPost() {
  const wadah = document.getElementById("pagination-output");
  wadah.innerHTML = `<p class="pesan-info">Memuat data dari API...</p>`;

  try {
    const response = await fetch(URL_API);
    if (!response.ok) {
      throw new Error(`Server merespons ${response.status}`);
    }

    const data = await response.json();

    halamanPost.length = 0;
    for (let i = 0; i < data.length; i += JUMLAH_PER_HALAMAN) {
      halamanPost.push(data.slice(i, i + JUMLAH_PER_HALAMAN));
    }
    halamanSekarang = 0;

    renderPagination();
  } catch (error) {
    console.error("Gagal memuat data pagination:", error);
    wadah.innerHTML = `<p class="pesan-error">Gagal memuat data: ${error.message}</p>`;
  }
}

/** Menggambar isi halaman beserta tombol Previous dan Next. */
function renderPagination() {
  const wadah = document.getElementById("pagination-output");
  const totalHalaman = halamanPost.length;
  const post = halamanPost[halamanSekarang] || [];

  wadah.innerHTML = `
    <p><strong>Halaman ${halamanSekarang + 1} dari ${totalHalaman}</strong> (${post.length} item per halaman)</p>
    <ul class="daftar-judul">
      ${post.map((p) => `<li>${p.title}</li>`).join("")}
    </ul>
    <button class="btn-mini" type="button" id="btn-prev" ${
      halamanSekarang === 0 ? "disabled" : ""
    }>&laquo; Previous</button>
    <button class="btn-mini" type="button" id="btn-next" ${
      halamanSekarang >= totalHalaman - 1 ? "disabled" : ""
    }>Next &raquo;</button>`;

  document.getElementById("btn-prev").addEventListener("click", function () {
    if (halamanSekarang > 0) {
      halamanSekarang--;
      renderPagination();
    }
  });

  document.getElementById("btn-next").addEventListener("click", function () {
    if (halamanSekarang < totalHalaman - 1) {
      halamanSekarang++;
      renderPagination();
    }
  });
}

document.getElementById("btn-load-pagination").addEventListener("click", muatDataPost);

/* =====================================================================
   4.6 - TODO LIST: TAMBAH, HAPUS, TANDAI SELESAI
          DENGAN DOM MANIPULATION DAN LOCALSTORAGE
   ===================================================================== */
const KUNCI_TODO = "todo_pertemuan1_124140144";
let daftarTodo = [];

/** Memuat daftar todo dari localStorage. */
function muatTodo() {
  try {
    const mentah = localStorage.getItem(KUNCI_TODO);
    daftarTodo = mentah ? JSON.parse(mentah) : [];
  } catch (error) {
    console.error("Data todo rusak, memuat daftar kosong:", error);
    daftarTodo = [];
  }
}

/** Menyimpan daftar todo ke localStorage. */
function simpanTodo() {
  localStorage.setItem(KUNCI_TODO, JSON.stringify(daftarTodo));
}

/**
 * Membangun dan menampilkan daftar todo memakai DOM manipulation.
 */
function renderTodo() {
  const daftar = document.getElementById("todo-list");
  const belum = daftarTodo.filter((todo) => !todo.selesai).length;

  document.getElementById("todo-info").textContent =
    daftarTodo.length === 0
      ? "Belum ada tugas."
      : `${belum} tugas belum selesai dari ${daftarTodo.length} total.`;

  daftar.innerHTML = "";

  if (daftarTodo.length === 0) {
    const kosong = document.createElement("li");
    kosong.className = "pesan-kosong";
    kosong.textContent = "Belum ada tugas. Tambahkan lewat kolom di atas.";
    daftar.appendChild(kosong);
    return;
  }

  daftarTodo.forEach((todo) => {
    const item = document.createElement("li");
    if (todo.selesai) item.classList.add("selesai");

    const teks = document.createElement("span");
    teks.className = "teks";
    teks.textContent = todo.teks;
    item.appendChild(teks);

    const aksi = document.createElement("span");

    const btnSelesai = document.createElement("button");
    btnSelesai.type = "button";
    btnSelesai.className = "btn-mini";
    btnSelesai.dataset.tandai = todo.id;
    btnSelesai.textContent = todo.selesai ? "Batal" : "Selesai";
    aksi.appendChild(btnSelesai);

    const btnHapus = document.createElement("button");
    btnHapus.type = "button";
    btnHapus.className = "btn-mini btn-mini--hapus";
    btnHapus.dataset.hapus = todo.id;
    btnHapus.textContent = "Hapus";
    aksi.appendChild(btnHapus);

    item.appendChild(aksi);
    daftar.appendChild(item);
  });
}

/**
 * Membuat id tugas baru yang dijamin unik.
 * Date.now() saja bisa menghasilkan id yang sama bila dua tugas ditambahkan
 * dalam milidetik yang sama, sehingga dipakai maksimal id yang sudah ada.
 * @returns {number}
 */
function idBaruTodo() {
  const idMaksimal = daftarTodo.reduce((maks, todo) => Math.max(maks, todo.id), 0);
  return Math.max(idMaksimal + 1, Date.now());
}

// event handler: tambah tugas
document.getElementById("todo-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const input = document.getElementById("todo-input");
  const teks = input.value.trim();

  if (teks === "") return;

  daftarTodo.push({ id: idBaruTodo(), teks, selesai: false });
  simpanTodo();
  renderTodo();

  this.reset();
  input.focus();
});

// event handler: tandai selesai / hapus (event delegation)
document.getElementById("todo-list").addEventListener("click", function (event) {
  const tombolTandai = event.target.closest("[data-tandai]");
  const tombolHapus = event.target.closest("[data-hapus]");

  if (tombolTandai) {
    const tugas = daftarTodo.find((todo) => todo.id === Number(tombolTandai.dataset.tandai));
    if (!tugas) return;
    tugas.selesai = !tugas.selesai;
  } else if (tombolHapus) {
    daftarTodo = daftarTodo.filter((todo) => todo.id !== Number(tombolHapus.dataset.hapus));
  } else {
    return;
  }

  simpanTodo();
  renderTodo();
});

// event handler: kosongkan seluruh daftar
document.getElementById("btn-reset-todo").addEventListener("click", function () {
  daftarTodo = [];
  localStorage.removeItem(KUNCI_TODO);
  renderTodo();
});

/* =====================================================================
   INISIALISASI
   ===================================================================== */
daftarMahasiswa = muatMahasiswa();
renderMahasiswa();
feedbackMahasiswa.className = "pesan-info";
feedbackMahasiswa.textContent =
  daftarMahasiswa.length === 0
    ? "Isi form untuk menambahkan data mahasiswa baru."
    : `${daftarMahasiswa.length} data mahasiswa dimuat dari localStorage.`;

muatTodo();
renderTodo();
/* =====================================================================
   HayuMencatat - Catatan Pribadi & Widget Cuaca ITERA
   Praktikum Pengembangan Aplikasi Web - Pertemuan 2 (JavaScript ES6+)
   Nama  : Muhammad Faiz Ashfaq
   NIM   : 124140144
   Kelas : RA
   ---------------------------------------------------------------------
   Ringkasan alur logika:
   1) Catatan dimuat dari localStorage saat aplikasi dibuka
   2) User menambah / mengedit / menghapus catatan lewat form
   3) State array `this.catatan` diperbarui secara immutable
      memakai spread operator dan modern array methods
   4) Perubahan state disimpan ke localStorage lalu dirender ulang
   5) Cuaca ITERA & kutipan diambil asinkron memakai async/await
      dan Promise.allSettled sehingga keduanya diproses paralel

   Daftar fitur ES6+ yang dipakai:
   - let / const                     : seluruh deklarasi state & konstanta
   - Arrow function                  : utilitas, renderer, event handler
   - Template literals               : markup kartu catatan, toast, dan statistik
   - Destructuring                   : parameter fungsi & elemen.dataset
   - Spread operator                 : pembaruan array secara immutable
   - Rest parameter                  : pembungkus request fetch(...options)
   - Default parameter               : opsi konfigurasi pada utilitas
   - Enhanced object literals        : konstanta KATEGORI, PRIORITAS, PETA_CUACA
   - Computed property names         : penyusunan peta kode cuaca WMO
   - Class (constructor, method,
     static, getter)                 : NoteItem, CuacaService, DashboardApp
   - Modern array methods            : map, filter, find, reduce, sort
   - async / await + try / catch     : pengambilan data cuaca & kutipan
   - Promise.allSettled + race       : proses paralel + batas waktu
   ===================================================================== */

/* ------------------------------------------------------------------ */
/*  KONSTANTA                                                          */
/* ------------------------------------------------------------------ */

/** Kunci localStorage agar tidak bentrok dengan aplikasi lain */
const KUNCI_STORAGE = "hayumencatat_catatan_124140144";

/** Batas input, mengikuti atribut maxlength pada form */
const BATAS_JUDUL = 70;
const BATAS_ISI = 600;

/** Endpoint API publik (gratis, tanpa API key) */
const API_CUACA =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31" +
  "&current=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
  "&timezone=Asia%2FJakarta&forecast_days=3";
const API_KUTIPAN = "https://dummyjson.com/quotes/random";

/** Batas waktu menunggu jawaban server (ms) */
const BATAS_WAKTU_MS = 8000;

/**
 * Enhanced object literals: nama kunci identik dengan nama variabel,
 * sehingga tidak perlu menulis `label: label` berulang kali.
 */
const KATEGORI = {
  kuliah: { label: "Kuliah", ikon: "\u{1F393}", warna: "#2563eb" },
  tugas: { label: "Tugas", ikon: "\u{1F4CB}", warna: "#b45309" },
  ide: { label: "Ide", ikon: "\u{1F4A1}", warna: "#059669" },
  pribadi: { label: "Pribadi", ikon: "\u{1F4AC}", warna: "#7c3aed" },
};

const PRIORITAS = {
  rendah: { label: "Rendah", bobot: 1 },
  sedang: { label: "Sedang", bobot: 2 },
  tinggi: { label: "Tinggi", bobot: 3 },
};

/**
 * Peta kode cuaca WMO (World Meteorological Organization) menjadi
 * keterangan berbahasa Indonesia beserta ikonnya.
 * Disusun manual memakai computed property names agar mudah dipelihara.
 */
const PETA_CUACA = {
  0: { label: "Cerah", ikon: "\u2600\uFE0F" },
  1: { label: "Cerah berawan", ikon: "\u{1F324}\uFE0F" },
  2: { label: "Berawan sebagian", ikon: "\u26C5" },
  3: { label: "Mendung", ikon: "\u2601\uFE0F" },
  45: { label: "Kabut", ikon: "\u{1F32B}\uFE0F" },
  48: { label: "Kabut beku", ikon: "\u{1F32B}\uFE0F" },
  51: { label: "Gerimis ringan", ikon: "\u{1F326}\uFE0F" },
  53: { label: "Gerimis sedang", ikon: "\u{1F326}\uFE0F" },
  55: { label: "Gerimis lebat", ikon: "\u{1F327}\uFE0F" },
  56: { label: "Gerimis beku", ikon: "\u{1F328}\uFE0F" },
  57: { label: "Gerimis beku lebat", ikon: "\u{1F328}\uFE0F" },
  61: { label: "Hujan ringan", ikon: "\u{1F326}\uFE0F" },
  63: { label: "Hujan sedang", ikon: "\u{1F327}\uFE0F" },
  65: { label: "Hujan lebat", ikon: "\u{1F327}\uFE0F" },
  66: { label: "Hujan beku", ikon: "\u{1F328}\uFE0F" },
  67: { label: "Hujan beku lebat", ikon: "\u{1F328}\uFE0F" },
  71: { label: "Salju ringan", ikon: "\u{1F328}\uFE0F" },
  73: { label: "Salju sedang", ikon: "\u{1F328}\uFE0F" },
  75: { label: "Salju lebat", ikon: "\u2744\uFE0F" },
  77: { label: "Butiran salju", ikon: "\u2744\uFE0F" },
  80: { label: "Hujan lokal ringan", ikon: "\u{1F326}\uFE0F" },
  81: { label: "Hujan lokal sedang", ikon: "\u{1F327}\uFE0F" },
  82: { label: "Hujan lokal lebat", ikon: "\u26C8\uFE0F" },
  85: { label: "Hujan salju", ikon: "\u{1F328}\uFE0F" },
  86: { label: "Hujan salju lebat", ikon: "\u{1F328}\uFE0F" },
  95: { label: "Badai petir", ikon: "\u26C8\uFE0F" },
  96: { label: "Badai petir dan es", ikon: "\u26C8\uFE0F" },
  99: { label: "Badai petir dan es lebat", ikon: "\u26C8\uFE0F" },
};

/** Keterangan cuaca bila kode WMO di luar peta */
const CUACA_TAK_DIKETAHUI = { label: "Cuaca tidak diketahui", ikon: "\u2753" };

/** Data awal, hanya dipakai saat localStorage masih kosong */
const CONTOH_CATATAN = [
  {
    judul: "Ide fitur untuk tugas PAW",
    isi:
      "Bikin personal dashboard yang punya widget cuaca ITERA, supaya bisa cek cuaca sebelum berangkat ke kampus sekaligus jadi tempat nyimpen catatan kuliah.",
    kategori: "ide",
    prioritas: "tinggi",
    disematkan: true,
  },
  {
    judul: "Rangkuman materi ES6+",
    isi:
      "let dan const menggantikan var. Arrow function punya this secara leksikal. Template literals pakai backtick. Destructuring adalah kunci untuk mengambil data dari API di React nanti.",
    kategori: "kuliah",
    prioritas: "sedang",
    disematkan: false,
  },
  {
    judul: "Tugas kelompok Pyramid dan React",
    isi:
      "Pembagian tugas: service layer di Pyramid, validasi payload dengan Marshmallow, lalu frontend React yang mengambil data lewat REST API. Deadline minggu depan.",
    kategori: "tugas",
    prioritas: "tinggi",
    disematkan: false,
  },
  {
    judul: "Ide jurnal harian",
    isi:
      "Catat satu hal baik dan satu hal yang perlu diperbaiki setiap malam sebelum tidur. Kalau konsisten, bulan depan bisa dipakai bahan refleksi pribadi.",
    kategori: "pribadi",
    prioritas: "rendah",
    disematkan: false,
  },
];

/* ------------------------------------------------------------------ */
/*  UTILITAS: DOM, format, dan keamanan XSS                            */
/* ------------------------------------------------------------------ */

/** Ambil elemen berdasarkan id */
const $ = (id) => document.getElementById(id);

/** Kumpulan referensi elemen DOM agar tidak berulang query */
const el = {
  // Cuaca
  widgetCuaca: $("widgetCuaca"),
  cuacaStatus: $("cuacaStatus"),
  cuacaUtama: $("cuacaUtama"),
  cuacaIkon: $("cuacaIkon"),
  cuacaSuhu: $("cuacaSuhu"),
  cuacaDeskripsi: $("cuacaDeskripsi"),
  cuacaDetail: $("cuacaDetail"),
  cuacaLembap: $("cuacaLembap"),
  cuacaAngin: $("cuacaAngin"),
  cuacaDiperbarui: $("cuacaDiperbarui"),
  prakiraan: $("prakiraan"),
  prakiraanList: $("prakiraanList"),
  btnMuatCuaca: $("btnMuatCuaca"),

  // Kutipan
  kutipanTeks: $("kutipanTeks"),
  kutipanPenulis: $("kutipanPenulis"),
  btnMuatKutipan: $("btnMuatKutipan"),

  // Statistik
  statTotal: $("statTotal"),
  statDisematkan: $("statDisematkan"),
  statKategori: $("statKategori"),
  statKarakter: $("statKarakter"),
  distribusiKategori: $("distribusiKategori"),

  // Form
  formCatatan: $("formCatatan"),
  judulForm: $("judulForm"),
  subjudulForm: $("subjudulForm"),
  inputJudul: $("inputJudul"),
  inputIsi: $("inputIsi"),
  inputKategori: $("inputKategori"),
  inputPrioritas: $("inputPrioritas"),
  inputPin: $("inputPin"),
  counterIsi: $("counterIsi"),
  btnSimpan: $("btnSimpan"),
  btnBatal: $("btnBatal"),

  // Filter
  inputCari: $("inputCari"),
  chipKategori: $("chipKategori"),
  inputUrutkan: $("inputUrutkan"),
  btnEkspor: $("btnEkspor"),
  btnImpor: $("btnImpor"),
  btnResetSemua: $("btnResetSemua"),
  inputImpor: $("inputImpor"),

  // Daftar
  daftarCatatan: $("daftarCatatan"),
  emptyState: $("emptyState"),
  emptyStateJudul: $("emptyStateJudul"),
  emptyStatePesan: $("emptyStatePesan"),
  counterCatatan: $("counterCatatan"),
  ringkasanCatatan: $("ringkasanCatatan"),

  // Modal & toast
  modalHapus: $("modalHapus"),
  modalHapusNama: $("modalHapusNama"),
  btnKonfirmasiHapus: $("btnKonfirmasiHapus"),
  btnBatalHapus: $("btnBatalHapus"),
  toastContainer: $("toastContainer"),
};

/**
 * Melindungi tampilan dari karakter HTML pada data pengguna.
 * Wajib dipakai setiap kali nilai dari user disisipkan ke innerHTML.
 */
const escapeHtml = (teks) =>
  String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Buang spasi berlebih di awal dan akhir, rapatkan spasi ganda */
const bersihkanTeks = (teks) => String(teks).replace(/\s+/g, " ").trim();

/** Huruf pertama menjadi huruf besar */
const kapitalisasi = (teks) => teks.charAt(0).toUpperCase() + teks.slice(1);

/** Format tanggal ISO menjadi "16 Okt 2026" */
const formatTanggal = (iso, { denganWaktu = false } = {}) => {
  const opsi = denganWaktu ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" };
  return new Intl.DateTimeFormat("id-ID", opsi).format(new Date(iso));
};

/** Ubah timestamp menjadi keterangan relatif: "baru saja", "3 jam lalu" */
const waktuRelatif = (iso) => {
  const selisihMenit = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

  if (selisihMenit < 1) return "baru saja";
  if (selisihMenit < 60) return `${selisihMenit} menit lalu`;

  const selisihJam = Math.floor(selisihMenit / 60);
  if (selisihJam < 24) return `${selisihJam} jam lalu`;

  const selisihHari = Math.floor(selisihJam / 24);
  if (selisihHari === 1) return "kemarin";
  if (selisihHari < 30) return `${selisihHari} hari lalu`;

  return formatTanggal(iso);
};

/** Nama hari singkat dalam bahasa Indonesia dari tanggal (2026-10-16) */
const namaHari = (tanggal) =>
  new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "Asia/Jakarta" }).format(
    new Date(`${tanggal}T00:00:00+07:00`)
  );

/**
 * Menunda pemanggilan sebuah fungsi (debounce).
 * Dipakai pada input pencarian agar render tidak berjalan tiap ketikan.
 */
const tunda = (fungsi, jedaMs = 250) => {
  let pengatur;
  return (...args) => {
    clearTimeout(pengatur);
    pengatur = setTimeout(() => fungsi(...args), jedaMs);
  };
};

/**
 * Membungkus sebuah promise dengan batas waktu memakai Promise.race,
 * agar widget tidak menggantung selamanya saat jaringan sedang lambat.
 */
const denganBatasWaktu = (promise, milidetik, pesanBatal) =>
  Promise.race([
    promise,
    new Promise((_, tolak) => setTimeout(() => tolak(new Error(pesanBatal)), milidetik)),
  ]);

/**
 * Mengambil dan membaca JSON dari sebuah URL.
 * @param {string} url
 * @param {{ batasWaktu?: number }} [opsi] - memakai default parameter
 */
const ambilJson = async (url, { batasWaktu = BATAS_WAKTU_MS } = {}) => {
  const namaHost = new URL(url).hostname;
  const respons = await denganBatasWaktu(
    fetch(url, { cache: "no-store" }),
    batasWaktu,
    `Server ${namaHost} tidak menjawab dalam ${batasWaktu / 1000} detik.`
  );

  if (!respons.ok) {
    throw new Error(`Server ${namaHost} membalas dengan status ${respons.status}.`);
  }

  return respons.json();
};

/** Menampilkan notifikasi singkat di pojok kanan bawah */
const tampilkanToast = (pesan, jenis = "info", durasiMs = 3200) => {
  const ikon = { sukses: "\u2714", galat: "\u2716", info: "\u2139" }[jenis] ?? "\u2139";

  const toast = document.createElement("div");
  toast.className = `toast toast--${jenis}`;
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <span class="toast__ikon" aria-hidden="true">${ikon}</span>
    <span>${escapeHtml(pesan)}</span>
  `;

  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("keluar");
    setTimeout(() => toast.remove(), 200);
  }, durasiMs);
};

/* ------------------------------------------------------------------ */
/*  CLASS NoteItem                                                     */
/*  Memodelkan satu catatan. Menyediakan serialisasi ke dan dari         */
/*  localStorage sehingga manipulasi data terpusat pada satu tempat.   */
/* ------------------------------------------------------------------ */
class NoteItem {
  /**
   * @param {object} data
   * @param {number} [data.id]
   * @param {string} data.judul
   * @param {string} data.isi
   * @param {string} [data.kategori]
   * @param {string} [data.prioritas]
   * @param {boolean} [data.disematkan]
   * @param {string} [data.dibuatPada] - timestamp ISO
   * @param {string} [data.diubahPada] - timestamp ISO, null bila belum diedit
   */
  constructor({
    id,
    judul,
    isi,
    kategori = "kuliah",
    prioritas = "sedang",
    disematkan = false,
    dibuatPada = new Date().toISOString(),
    diubahPada = null,
  }) {
    this.id = id;
    this.judul = judul;
    this.isi = isi;
    // Sanitasi: kalau data berasal dari impor berkas, kategori atau prioritas
    // bisa bernilai asing sehingga dibetulkan ke nilai bawaan yang valid.
    this.kategori = Object.hasOwn(KATEGORI, kategori) ? kategori : "kuliah";
    this.prioritas = Object.hasOwn(PRIORITAS, prioritas) ? prioritas : "sedang";
    this.disematkan = Boolean(disematkan);
    this.dibuatPada = dibuatPada;
    this.diubahPada = diubahPada;
  }

  /** Membuat instance dari objek mentah hasil JSON.parse */
  static dariObjek(mentah) {
    return new NoteItem(mentah);
  }

  /** Mengubah instance menjadi objek biasa yang aman di-JSON-kan */
  keObjek() {
    const { id, judul, isi, kategori, prioritas, disematkan, dibuatPada, diubahPada } = this;
    return { id, judul, isi, kategori, prioritas, disematkan, dibuatPada, diubahPada };
  }

  /** Gabungan judul dan isi huruf kecil, dipakai untuk pencarian */
  get kataKunci() {
    return `${this.judul} ${this.isi}`.toLowerCase();
  }

  /** True bila catatan ini pernah diedit setelah dibuat */
  get sudahDiperbarui() {
    return this.diubahPada !== null;
  }
}

/* ------------------------------------------------------------------ */
/*  CLASS CuacaService                                                 */
/*  Dipisah dari DashboardApp karena tugasnya tunggal: mengambil data   */
/*  cuaca. easier diuji dan tidak mencampurkan tanggung jawab.         */
/* ------------------------------------------------------------------ */
class CuacaService {
  /** Koordinat ITERA, Lampung Selatan (static field, ES2022) */
  static LOKASI = {
    latitude: -5.36,
    longitude: 105.31,
    nama: "ITERA, Lampung Selatan",
  };

  /**
   * Mengambil data cuaca terkini beserta prakiraan tiga hari.
   * @returns {Promise<object>} data cuaca yang sudah dinormalisasi
   */
  static async ambil() {
    const data = await ambilJson(API_CUACA);
    const { time, temperature_2m, relative_humidity_2m, wind_speed_10m, weather_code } = data.current;

    return {
      lokasi: CuacaService.LOKASI.nama,
      suhu: temperature_2m,
      lembap: relative_humidity_2m,
      angin: wind_speed_10m,
      waktu: time,
      ...CuacaService.terjemahkan(weather_code),
      prakiraan: data.daily.time.map((tanggal, indeks) => ({
        tanggal,
        ...CuacaService.terjemahkan(data.daily.weather_code[indeks]),
        suhuMaks: data.daily.temperature_2m_max[indeks],
        suhuMin: data.daily.temperature_2m_min[indeks],
      })),
    };
  }

  /** Menerjemahkan kode WMO menjadi keterangan dan ikon yang ramah dibaca */
  static terjemahkan(kode) {
    return PETA_CUACA[kode] ?? CUACA_TAK_DIKETAHUI;
  }
}

/* ------------------------------------------------------------------ */
/*  CLASS DashboardApp                                                 */
/*  Otak aplikasi: memegang state, CRUD, localStorage, filter, dan    */
/*  pemanggilan API.                                                   */
/* ------------------------------------------------------------------ */
class DashboardApp {
  constructor() {
    /** @type {NoteItem[]} */
    this.catatan = [];
    this.idBerikutnya = 1;
    this.idMenungguHapus = null;
    this.catatanSedangDiedit = null;
    this.kategoriAktif = "semua";
    this.kataKunci = "";
    this.urutan = "terbaru";
    this.cacheKutipan = null;
  }

  /* ------------------------- 1. INISIALISASI ------------------------- */

  init() {
    this.muatDariStorage();
    this.pasangEvent();
    this.render();
    this.perbaruiCounterIsi();

    // Muat data eksternal setelah antarmuka utama siap tampil.
    this.muatWidget();
  }

  /* ------------------------- 2. LOCALSTORAGE ------------------------- */

  /**
   * Membaca catatan tersimpan. Bila data hilang, rusak, atau versinya tidak
   * cocok, aplikasi kembali ke data contoh dan memberi tahu pengguna.
   */
  muatDariStorage() {
    const mentah = localStorage.getItem(KUNCI_STORAGE);

    if (!mentah) {
      this.gantiSeluruhCatatan(CONTOH_CATATAN);
      return;
    }

    try {
      const { catatan, idBerikutnya } = JSON.parse(mentah);

      if (!Array.isArray(catatan)) {
        throw new Error("Struktur data tidak sesuai.");
      }

      this.catatan = catatan
        .filter((item) => item && typeof item.judul === "string" && typeof item.isi === "string")
        .map((item) => NoteItem.dariObjek(item));
      this.idBerikutnya = idBerikutnya ?? this.catatan.length + 1;
    } catch (kesalahan) {
      this.gantiSeluruhCatatan(CONTOH_CATATAN);
      tampilkanToast("Data tersimpan rusak, aplikasi dimuat ulang dengan data contoh.", "galat");
    }
  }

  /** Menyimpan state saat ini ke localStorage dengan penanganan error kuota */
  simpanKeStorage() {
    try {
      const muatan = {
        versi: 1,
        idBerikutnya: this.idBerikutnya,
        catatan: this.catatan.map((catatan) => catatan.keObjek()),
      };
      localStorage.setItem(KUNCI_STORAGE, JSON.stringify(muatan));
    } catch {
      tampilkanToast("Gagal menyimpan ke localStorage, penyimpanan mungkin penuh.", "galat");
    }
  }

  /** Mengganti seluruh isi state, lalu menyimpan ke localStorage */
  gantiSeluruhCatatan(daftar) {
    this.catatan = daftar.map((data, indeks) => new NoteItem({ ...data, id: indeks + 1 }));
    this.idBerikutnya = this.catatan.length + 1;
    this.simpanKeStorage();
  }

  /* ------------------------- 3. CRUD (immutable) ------------------------- */

  /** Menambah catatan baru dari isi form */
  tambahCatatan(data) {
    const catatanBaru = new NoteItem({
      ...data,
      id: this.idBerikutnya,
      dibuatPada: new Date().toISOString(),
    });

    // Spread operator: membentuk array baru, bukan mengubah array lama.
    this.catatan = [...this.catatan, catatanBaru];
    this.idBerikutnya += 1;
  }

  /** Memperbarui satu catatan berdasarkan id */
  perbaruiCatatan(id, data) {
    // map() menghasilkan array baru sehingga state lama tetap utuh.
    this.catatan = this.catatan.map((catatan) =>
      catatan.id === id
        ? NoteItem.dariObjek({
            ...catatan.keObjek(),
            ...data,
            diubahPada: new Date().toISOString(),
          })
        : catatan
    );
  }

  /** Menghapus satu catatan berdasarkan id */
  hapusCatatan(id) {
    this.catatan = this.catatan.filter((catatan) => catatan.id !== id);
  }

  /** Menyalakan atau mematikan sematan sebuah catatan */
  toggleSematkan(id) {
    this.catatan = this.catatan.map((catatan) =>
      catatan.id === id
        ? NoteItem.dariObjek({ ...catatan.keObjek(), disematkan: !catatan.disematkan })
        : catatan
    );
  }

  /* ------------------ 4. PENCARIAN, FILTER, DAN URUT ------------------ */

  /** Catatan yang lolos filter kategori dan kata kunci, lalu diurutkan */
  get catatanTersaring() {
    const { kategoriAktif, kataKunci, urutan } = this;

    const tersaring = this.catatan.filter((catatan) => {
      const cocokKategori = kategoriAktif === "semua" || catatan.kategori === kategoriAktif;
      const cocokKata = kataKunci === "" || catatan.kataKunci.includes(kataKunci);
      return cocokKategori && cocokKata;
    });

    const pengurut = {
      // sort() selalu mengubah array di tempatnya, jadi disalin dulu dengan spread.
      terbaru: (a, b) => Number(b.disematkan) - Number(a.disematkan) || b.id - a.id,
      terlama: (a, b) => Number(b.disematkan) - Number(a.disematkan) || a.id - b.id,
      abjad: (a, b) => a.judul.localeCompare(b.judul, "id"),
      prioritas: (a, b) => PRIORITAS[b.prioritas].bobot - PRIORITAS[a.prioritas].bobot || b.id - a.id,
    };

    return [...tersaring].sort(pengurut[urutan]);
  }

  /** Sebaran jumlah catatan per kategori, hanya yang benar-benar terpakai */
  get sebaranKategori() {
    return Object.entries(KATEGORI)
      .map(([kunci, meta]) => ({
        kunci,
        label: meta.label,
        warna: meta.warna,
        jumlah: this.catatan.filter((catatan) => catatan.kategori === kunci).length,
      }))
      .filter((baris) => baris.jumlah > 0);
  }

  /* ------------------------- 5. VALIDASI FORM ------------------------- */

  /** Menghapus seluruh penanda error pada form */
  bersihkanValidasi() {
    [
      [el.inputJudul, "error-judul"],
      [el.inputIsi, "error-isi"],
    ].forEach(([input, idError]) => {
      input.classList.remove("bermasalah");
      $(idError).textContent = "";
    });
  }

  /** Menandai satu field bermasalah beserta pesan errornya */
  tandaiMasalah(input, idError, pesan) {
    input.classList.add("bermasalah");
    $(idError).textContent = pesan;
  }

  /**
   * Memeriksa isian form catatan.
   * @returns {{valid: boolean, data: object|null}}
   */
  validasiForm() {
    this.bersihkanValidasi();

    const judul = bersihkanTeks(el.inputJudul.value);
    const isi = String(el.inputIsi.value).trim();
    let valid = true;

    if (!judul) {
      this.tandaiMasalah(el.inputJudul, "error-judul", "Judul catatan tidak boleh kosong.");
      valid = false;
    } else if (judul.length < 3) {
      this.tandaiMasalah(el.inputJudul, "error-judul", "Judul minimal 3 karakter.");
      valid = false;
    } else if (judul.length > BATAS_JUDUL) {
      this.tandaiMasalah(
        el.inputJudul,
        "error-judul",
        `Judul maksimal ${BATAS_JUDUL} karakter.`
      );
      valid = false;
    }

    if (!isi) {
      this.tandaiMasalah(el.inputIsi, "error-isi", "Isi catatan tidak boleh kosong.");
      valid = false;
    } else if (isi.length < 5) {
      this.tandaiMasalah(el.inputIsi, "error-isi", "Isi catatan minimal 5 karakter.");
      valid = false;
    }

    if (!valid) {
      return { valid: false, data: null };
    }

    return {
      valid: true,
      data: {
        judul,
        isi,
        kategori: el.inputKategori.value,
        prioritas: el.inputPrioritas.value,
        disematkan: el.inputPin.checked,
      },
    };
  }

  /* ------------------------- 6. RENDER ------------------------- */

  render() {
    this.renderCatatan();
    this.renderChipKategori();
    this.renderStatistik();
  }

  /** Template literals untuk membangun markup satu kartu catatan */
  kartuCatatan(catatan) {
    const { id, judul, isi, kategori, prioritas, disematkan } = catatan;
    const meta = KATEGORI[kategori];
    const tingkat = PRIORITAS[prioritas];

    const labelSemat = disematkan ? "Lepas sematan" : "Sematkan";

    return `
      <article class="catatan catatan--${kategori}${disematkan ? " catatan--disematkan" : ""}" data-id="${id}">
        <div class="catatan__kepala">
          <span class="catatan__kategori catatan__kategori--${kategori}">
            <span aria-hidden="true">${meta.ikon}</span> ${escapeHtml(meta.label)}
          </span>
          ${
            disematkan
              ? '<span class="catatan__pin" title="Disematkan" aria-label="Disematkan">\u{1F4CC}</span>'
              : ""
          }
        </div>

        <h3 class="catatan__judul">${escapeHtml(judul)}</h3>
        <button type="button" class="catatan__isi catatan__isi--dipotong" data-aksi="buka" data-id="${id}"
                title="Klik untuk buka atau tutup isi catatan">${escapeHtml(isi)}</button>

        <div class="catatan__meta">
          <span class="prioritas prioritas--${prioritas}">${escapeHtml(tingkat.label)}</span>
          <span class="meta__item">Dibuat ${escapeHtml(waktuRelatif(catatan.dibuatPada))}</span>
          ${
            catatan.sudahDiperbarui
              ? `<span class="meta__item">Diubah ${escapeHtml(waktuRelatif(catatan.diubahPada))}</span>`
              : ""
          }
        </div>

        <div class="catatan__aksi">
          <button type="button" class="btn btn--ikon${disematkan ? " aktif" : ""}" data-aksi="semat" data-id="${id}"
                  title="${labelSemat}" aria-label="${labelSemat}">\u{1F4CC}</button>
          <button type="button" class="btn btn--ikon" data-aksi="edit" data-id="${id}"
                  title="Edit catatan" aria-label="Edit catatan">\u270E\uFE0F</button>
          <button type="button" class="btn btn--ikon" data-aksi="hapus" data-id="${id}"
                  title="Hapus catatan" aria-label="Hapus catatan">\u{1F5D1}\uFE0F</button>
        </div>
      </article>
    `;
  }

  /** Merender daftar catatan beserta penangan kondisi kosong */
  renderCatatan() {
    const tersaring = this.catatanTersaring;
    const adaCatatan = this.catatan.length > 0;

    el.daftarCatatan.innerHTML = tersaring.map((catatan) => this.kartuCatatan(catatan)).join("");

    // Kondisi kosong dibedakan antara "belum ada catatan" dan "tidak cocok filter".
    el.emptyState.classList.toggle("tampil", tersaring.length === 0);
    el.emptyStateJudul.textContent = adaCatatan ? "Tidak ada catatan yang cocok" : "Belum ada catatan";
    el.emptyStatePesan.textContent = adaCatatan
      ? 'Coba kata kunci lain atau pilih filter kategori "Semua".'
      : "Isi form di samping untuk membuat catatan pertama.";

    el.counterCatatan.textContent = `${tersaring.length} catatan`;
    el.ringkasanCatatan.textContent = !adaCatatan
      ? "Belum ada catatan tersimpan"
      : tersaring.length === this.catatan.length
        ? `Menampilkan seluruh ${this.catatan.length} catatan`
        : `Menampilkan ${tersaring.length} dari ${this.catatan.length} catatan`;
  }

  /** Merender tombol filter kategori beserta jumlahnya */
  renderChipKategori() {
    // Disusun menjadi kumpulan object seragam supaya bisa di-destructure
    // dengan pola yang sama semua di bawah ini.
    const pilihan = [
      { kunci: "semua", label: "Semua", ikon: "\u{1F4DA}" },
      ...Object.entries(KATEGORI).map(([kunci, meta]) => ({ kunci, ...meta })),
    ];

    el.chipKategori.innerHTML = pilihan
      .map(({ kunci, label, ikon }) => {
        const aktif = kunci === this.kategoriAktif;
        const jumlah =
          kunci === "semua"
            ? this.catatan.length
            : this.catatan.filter((catatan) => catatan.kategori === kunci).length;

        return `
          <button type="button" class="chip${aktif ? " aktif" : ""}" data-kategori="${kunci}"
                  aria-pressed="${aktif}">
            <span aria-hidden="true">${ikon}</span> ${escapeHtml(label)}
            <span class="chip__jumlah">${jumlah}</span>
          </button>
        `;
      })
      .join("");
  }

  /** Merender angka statistik dan diagram sebaran kategori */
  renderStatistik() {
    // reduce() menghitung total karakter dalam satu kali iterasi.
    const totalKarakter = this.catatan.reduce((total, catatan) => total + catatan.isi.length, 0);
    const jumlahDisematkan = this.catatan.filter((catatan) => catatan.disematkan).length;
    const sebaran = this.sebaranKategori;

    el.statTotal.textContent = this.catatan.length;
    el.statDisematkan.textContent = jumlahDisematkan;
    el.statKategori.textContent = sebaran.length;
    el.statKarakter.textContent = totalKarakter.toLocaleString("id-ID");

    const pembagi = this.catatan.length || 1;
    el.distribusiKategori.innerHTML = sebaran
      .map(({ label, warna, jumlah }) => {
        const persen = Math.round((jumlah / pembagi) * 100);
        return `
          <div class="distribusi__baris">
            <span class="distribusi__nama">${escapeHtml(label)}</span>
            <span class="distribusi__rel">
              <span class="distribusi__isi" style="width:${persen}%;background:${warna}"></span>
            </span>
            <span class="distribusi__jumlah">${jumlah}</span>
          </div>
        `;
      })
      .join("");
  }

  /** Merender panel cuaca untuk status memuat, berhasil, atau gagal */
  renderCuaca({ status, data = null, pesan = "" }) {
    const tersembunyi = [el.cuacaUtama, el.cuacaDetail, el.prakiraan];

    el.widgetCuaca.setAttribute("aria-busy", String(status === "memuat"));

    if (status === "memuat") {
      el.cuacaStatus.className = "cuaca__status";
      el.cuacaStatus.innerHTML =
        '<span class="spinner" aria-hidden="true"></span> Mengambil data cuaca&hellip;';
      el.cuacaStatus.hidden = false;
      tersembunyi.forEach((elemen) => (elemen.hidden = true));
      return;
    }

    if (status === "gagal") {
      el.cuacaStatus.className = "cuaca__status cuaca__status--galat";
      el.cuacaStatus.innerHTML = `
        <span aria-hidden="true">&#9888;&#65039;</span>
        <span>Gagal memuat cuaca: ${escapeHtml(pesan)}</span>
      `;
      el.cuacaStatus.hidden = false;
      tersembunyi.forEach((elemen) => (elemen.hidden = true));
      return;
    }

    el.cuacaStatus.hidden = true;
    tersembunyi.forEach((elemen) => (elemen.hidden = false));

    const { ikon, label, suhu, lembap, angin, waktu, prakiraan } = data;

    el.cuacaIkon.textContent = ikon;
    el.cuacaSuhu.textContent = `${Math.round(suhu)}\u00B0C`;
    el.cuacaDeskripsi.textContent = `${label} \u00B7 ${CuacaService.LOKASI.nama}`;
    el.cuacaLembap.textContent = `${lembap}%`;
    el.cuacaAngin.textContent = `${Math.round(angin)} km/j`;
    el.cuacaDiperbarui.textContent = formatTanggal(waktu, { denganWaktu: true });

    el.prakiraanList.innerHTML = prakiraan
      .map(({ tanggal, ikon: ikonHari, label: labelHari, suhuMaks, suhuMin }, indeks) => {
        const hari = indeks === 0 ? "Hari ini" : kapitalisasi(namaHari(tanggal));
        return `
          <li class="prakiraan__item">
            <span class="prakiraan__hari">${escapeHtml(hari)}</span>
            <span class="prakiraan__ikon" aria-hidden="true">${ikonHari}</span>
            <span class="prakiraan__suhu">${Math.round(suhuMaks)}\u00B0 <span>/ ${Math.round(suhuMin)}\u00B0</span></span>
            <span class="meta__item">${escapeHtml(labelHari)}</span>
          </li>
        `;
      })
      .join("");
  }

  /** Merender panel kutipan untuk status memuat, berhasil, atau gagal */
  renderKutipan({ status, data = null, pesan = "" }) {
    if (status === "memuat") {
      el.kutipanTeks.textContent = "Memuat kutipan\u2026";
      el.kutipanPenulis.textContent = "\u2014";
      return;
    }

    if (status === "gagal") {
      el.kutipanTeks.textContent = "Kutipan tidak dapat dimuat.";
      el.kutipanPenulis.textContent = pesan;
      return;
    }

    el.kutipanTeks.textContent = `\u201C${data.quote}\u201D`;
    el.kutipanPenulis.textContent = data.author;
  }

  /* ------------------------- 7. MODE FORM ------------------------- */

  /** Menghapus semua penanda error pada form */
  setModeForm(sedangEdit, catatan = null) {
    if (sedangEdit && catatan) {
      this.catatanSedangDiedit = catatan.id;
      el.judulForm.textContent = "Edit Catatan";
      el.subjudulForm.textContent = "Perubahan akan langsung tersimpan";
      el.btnSimpan.textContent = "\u2713 Simpan Perubahan";
      el.btnBatal.hidden = false;

      // Destructuring dari objek catatan untuk mengisi form.
      const { judul, isi, kategori, prioritas, disematkan } = catatan;
      el.inputJudul.value = judul;
      el.inputIsi.value = isi;
      el.inputKategori.value = kategori;
      el.inputPrioritas.value = prioritas;
      el.inputPin.checked = disematkan;
    } else {
      this.catatanSedangDiedit = null;
      el.judulForm.textContent = "Catatan Baru";
      el.subjudulForm.textContent = "Isi catatan lalu tekan Simpan";
      el.btnSimpan.textContent = "+ Simpan Catatan";
      el.btnBatal.hidden = true;
      el.formCatatan.reset();
    }

    this.perbaruiCounterIsi();
    this.bersihkanValidasi();
  }

  /** Mengatur form agar siap mengedit sebuah catatan tertentu */
  mulaiEdit(id) {
    const catatan = this.catatan.find((item) => item.id === id);
    if (!catatan) return;

    this.setModeForm(true, catatan);
    el.inputJudul.focus();
    el.inputJudul.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /** Memperbarui hitungan karakter pada textarea */
  perbaruiCounterIsi() {
    const panjang = el.inputIsi.value.length;
    el.counterIsi.textContent = `${panjang} / ${BATAS_ISI}`;
    el.counterIsi.style.color = panjang > BATAS_ISI * 0.9 ? "var(--warna-merah)" : "";
  }

  /* ------------------------- 8. MODAL HAPUS ------------------------- */

  bukaModalHapus(id) {
    const catatan = this.catatan.find((item) => item.id === id);
    if (!catatan) return;

    this.idMenungguHapus = id;
    el.modalHapusNama.textContent = catatan.judul;
    el.modalHapus.hidden = false;
    el.btnKonfirmasiHapus.focus();
  }

  tutupModalHapus() {
    el.modalHapus.hidden = true;
    this.idMenungguHapus = null;
  }

  /* ------------- 9. ASINKRON: CUACA DAN KUTIPAN ------------- */

  /**
   * Mengambil data cuaca dan kutipan secara PARALEL.
   *
   * Memakai Promise.allSettled, bukan Promise.all, supaya satu sumber yang
   * gagal tidak membuat seluruh widget kosong. Status tiap request tetap
   * diperiksa lewat nilai "fulfilled" atau "rejected".
   */
  async muatWidget({ refetchKutipan = false } = {}) {
    const perluKutipanBaru = refetchKutipan || this.cacheKutipan === null;

    this.renderCuaca({ status: "memuat" });
    if (perluKutipanBaru) this.renderKutipan({ status: "memuat" });

    el.btnMuatCuaca.disabled = true;
    el.btnMuatKutipan.disabled = true;

    // Kedua request dibuat bersamaan, lalu ditunggu bersama-sama.
    const permintaan = [CuacaService.ambil()];
    if (perluKutipanBaru) permintaan.push(ambilJson(API_KUTIPAN));

    const hasil = await Promise.allSettled(permintaan);
    const hasilCuaca = hasil[0];
    const hasilKutipan = hasil[1];

    if (hasilCuaca.status === "fulfilled") {
      this.renderCuaca({ status: "sukses", data: hasilCuaca.value });
    } else {
      this.renderCuaca({ status: "gagal", pesan: hasilCuaca.reason.message });
      tampilkanToast("Data cuaca gagal dimuat.", "galat");
    }

    if (hasilKutipan === undefined) {
      // Kutipan masih memakai hasil cache dari pemanggilan sebelumnya.
      this.renderKutipan({ status: "sukses", data: this.cacheKutipan });
    } else if (hasilKutipan.status === "fulfilled") {
      this.cacheKutipan = hasilKutipan.value;
      this.renderKutipan({ status: "sukses", data: hasilKutipan.value });
    } else {
      this.renderKutipan({ status: "gagal", pesan: hasilKutipan.reason.message });
    }

    el.btnMuatCuaca.disabled = false;
    el.btnMuatKutipan.disabled = false;
  }

  /* ------------------------- 10. EKSPOR DAN IMPOR ------------------------- */

  /** Unduh seluruh catatan sebagai berkas JSON */
  eksporCatatan() {
    if (this.catatan.length === 0) {
      tampilkanToast("Belum ada catatan untuk diekspor.", "info");
      return;
    }

    const muatan = {
      aplikasi: "HayuMencatat",
      dieksporPada: new Date().toISOString(),
      jumlah: this.catatan.length,
      catatan: this.catatan.map((catatan) => catatan.keObjek()),
    };

    const berkas = new Blob([JSON.stringify(muatan, null, 2)], { type: "application/json" });
    const tautan = document.createElement("a");
    tautan.href = URL.createObjectURL(berkas);
    tautan.download = `catatan-hayumencatat-${new Date().toISOString().slice(0, 10)}.json`;
    tautan.click();
    URL.revokeObjectURL(tautan.href);

    tampilkanToast(`${muatan.jumlah} catatan berhasil diekspor.`, "sukses");
  }

  /** Pulihkan catatan dari berkas JSON hasil ekspor */
  imporCatatan(berkas) {
    const pembaca = new FileReader();

    pembaca.onload = () => {
      try {
        const { catatan } = JSON.parse(pembaca.result);

        if (!Array.isArray(catatan)) {
          throw new Error("Struktur berkas tidak dikenali.");
        }

        const valid = catatan.filter(
          (item) => item && typeof item.judul === "string" && typeof item.isi === "string"
        );

        if (valid.length === 0) {
          throw new Error("Tidak ada catatan valid di dalam berkas.");
        }

        this.gantiSeluruhCatatan(valid);
        this.render();
        tampilkanToast(`${valid.length} catatan berhasil diimpor.`, "sukses");
      } catch (kesalahan) {
        tampilkanToast(`Impor gagal: ${kesalahan.message}`, "galat");
      } finally {
        el.inputImpor.value = "";
      }
    };

    pembaca.onerror = () => {
      tampilkanToast("Berkas tidak dapat dibaca.", "galat");
      el.inputImpor.value = "";
    };

    pembaca.readAsText(berkas);
  }

  /* ------------------------- 11. EVENT LISTENER ------------------------- */

  pasangEvent() {
    /* --- Submit form: menambah atau memperbarui --- */
    el.formCatatan.addEventListener("submit", (acara) => {
      acara.preventDefault();

      const { valid, data } = this.validasiForm();

      if (!valid) {
        tampilkanToast("Periksa kembali kolom yang ditandai merah.", "galat");
        return;
      }

      if (this.catatanSedangDiedit !== null) {
        this.perbaruiCatatan(this.catatanSedangDiedit, data);
        tampilkanToast("Catatan berhasil diperbarui.", "sukses");
      } else {
        this.tambahCatatan(data);
        tampilkanToast("Catatan berhasil ditambahkan.", "sukses");
      }

      this.simpanKeStorage();
      this.setModeForm(false);
      this.render();
      el.inputJudul.focus();
    });

    /* --- Batal edit --- */
    el.btnBatal.addEventListener("click", () => {
      this.setModeForm(false);
      tampilkanToast("Perubahan dibatalkan.", "info");
    });

    /* --- Penghitung karakter --- */
    el.inputIsi.addEventListener("input", () => this.perbaruiCounterIsi());

    /* --- Pencarian, dengan debounce --- */
    el.inputCari.addEventListener(
      "input",
      tunda((acara) => {
        this.kataKunci = bersihkanTeks(acara.target.value).toLowerCase();
        this.renderCatatan();
      })
    );

    /* --- Filter kategori, memakai event delegation --- */
    el.chipKategori.addEventListener("click", (acara) => {
      const chip = acara.target.closest("[data-kategori]");
      if (!chip) return;

      this.kategoriAktif = chip.dataset.kategori;
      this.render();
    });

    /* --- Urutan --- */
    el.inputUrutkan.addEventListener("change", (acara) => {
      this.urutan = acara.target.value;
      this.renderCatatan();
    });

    /* --- Aksi pada kartu catatan, memakai event delegation --- */
    el.daftarCatatan.addEventListener("click", (acara) => {
      const pemicu = acara.target.closest("[data-aksi]");
      if (!pemicu) return;

      // Destructuring dari dataset elemen tombol.
      const { aksi, id } = pemicu.dataset;
      const idAngka = Number(id);

      if (aksi === "edit") {
        this.mulaiEdit(idAngka);
        return;
      }

      if (aksi === "hapus") {
        this.bukaModalHapus(idAngka);
        return;
      }

      if (aksi === "semat") {
        this.toggleSematkan(idAngka);
        this.simpanKeStorage();
        this.render();
        tampilkanToast("Status sematan diperbarui.", "sukses");
        return;
      }

      if (aksi === "buka") {
        pemicu.classList.toggle("catatan__isi--dipotong");
      }
    });

    /* --- Modal hapus --- */
    el.btnKonfirmasiHapus.addEventListener("click", () => {
      const id = this.idMenungguHapus;
      if (id === null) return;

      this.hapusCatatan(id);
      this.tutupModalHapus();

      // Bila catatan yang sedang diedit ikut terhapus, form dikembalikan ke mode baru.
      if (this.catatanSedangDiedit === id) this.setModeForm(false);

      this.simpanKeStorage();
      this.render();
      tampilkanToast("Catatan berhasil dihapus.", "sukses");
    });

    el.btnBatalHapus.addEventListener("click", () => this.tutupModalHapus());

    el.modalHapus.addEventListener("click", (acara) => {
      if (acara.target === el.modalHapus) this.tutupModalHapus();
    });

    /* --- Ekspor, impor, dan hapus semua --- */
    el.btnEkspor.addEventListener("click", () => this.eksporCatatan());

    el.btnImpor.addEventListener("click", () => el.inputImpor.click());

    el.inputImpor.addEventListener("change", (acara) => {
      const [berkas] = acara.target.files;
      if (berkas) this.imporCatatan(berkas);
    });

    el.btnResetSemua.addEventListener("click", () => {
      if (this.catatan.length === 0) {
        tampilkanToast("Tidak ada catatan untuk dihapus.", "info");
        return;
      }

      this.gantiSeluruhCatatan([]);
      this.setModeForm(false);
      this.render();
      tampilkanToast("Semua catatan telah dihapus.", "sukses");
    });

    /* --- Widget data eksternal --- */
    el.btnMuatCuaca.addEventListener("click", () => this.muatWidget());
    el.btnMuatKutipan.addEventListener("click", () => this.muatWidget({ refetchKutipan: true }));

    /* --- Pintasan papan ketik --- */
    document.addEventListener("keydown", (acara) => {
      if (acara.key === "Escape") {
        if (!el.modalHapus.hidden) this.tutupModalHapus();
        else if (this.catatanSedangDiedit !== null) this.setModeForm(false);
        return;
      }

      // Ctrl atau Cmd + S mencegah dialog simpan bawaan browser, lalu menyimpan.
      if ((acara.ctrlKey || acara.metaKey) && acara.key.toLowerCase() === "s") {
        acara.preventDefault();
        el.formCatatan.requestSubmit();
      }
    });
  }
}

/* ------------------------------------------------------------------ */
/*  TITIK MASUK APLIKASI                                               */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const dashboard = new DashboardApp();
  dashboard.init();

  // Expos instance agar mudah diperiksa dari console browser saat debugging.
  window.dashboard = dashboard;
});

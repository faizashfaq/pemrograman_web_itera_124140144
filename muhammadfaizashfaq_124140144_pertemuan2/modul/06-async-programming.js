/* =====================================================================
   MODUL 06 - ASYNC PROGRAMMING
   Praktikum PAW - Pertemuan 2 - Muhammad Faiz Ashfaq (124140144)
   Topik: penggabungan endpoint, retry backoff, loading state, error boundary, pagination, debounced search
   ===================================================================== */
const wadah = document.getElementById("result");
const aman = (teks) => String(teks).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Data lokal HayuMencatat supaya modul ini tetap berjalan tanpa internet.
const DAFTAR_CATATAN = [
  { id: 1, judul: "Tugas Praktikum PAW", kategori: "tugas" },
  { id: 2, judul: "Slide Pertemuan 2 ES6", kategori: "kuliah" },
  { id: 3, judul: "Ide widget cuaca ITERA", kategori: "ide" },
  { id: 4, judul: "Bayar spp semester 5", kategori: "pribadi" },
  { id: 5, judul: "Rangkuman Array Methods", kategori: "kuliah" },
  { id: 6, judul: "Ide dark mode HayuMencatat", kategori: "ide" },
  { id: 7, judul: "Jadwal Ujian Akhir", kategori: "tugas" },
];
// Penundaan singkat untuk meniru proses request yang sebenarnya.
const tunda = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mengganti isi sebuah daftar <li>, dipakai oleh LATIHAN 6.5 dan 6.6.
const tulisDaftar = (elemen, isi) => {
  const baris = isi.map((catatan) => "<li>" + aman("id " + catatan.id + " - " + catatan.judul + " [" + catatan.kategori + "]") + "</li>");
  elemen.innerHTML = baris.join("");
};

// Endpoint /api/catatan/:id
const apiCatatan = (id, jedaMs = 400) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const catatan = DAFTAR_CATATAN.find((item) => item.id === id);
      if (!catatan) return reject(new Error("Catatan dengan id " + id + " tidak ditemukan"));
      resolve({ ...catatan, endpoint: "/api/catatan/" + id });
    }, jedaMs);
  });

// Endpoint /api/statistik yang sengaja dibuat selalu gagal.
const apiStatistik = (jedaMs = 600) =>
  new Promise((_resolve, reject) =>
    setTimeout(() => reject(new Error("Endpoint /api/statistik rusak (HTTP 503)")), jedaMs));

// Endpoint /api/catatan?q= untuk pencarian pada LATIHAN 6.6.
const apiCari = (kata, jedaMs = 400) =>
  new Promise((resolve) => {
    const kunci = String(kata).trim().toLowerCase();
    setTimeout(() => resolve(kunci === "" ? [] : DAFTAR_CATATAN.filter((c) => c.judul.toLowerCase().includes(kunci))), jedaMs);
  });

async function jalankanModul() {
  // ---------------------------------------------------------------------
  // LATIHAN 6.1 - BUAT FUNGSI YANG FETCH DATA DARI BEBERAPA ENDPOINT DAN GABUNGKAN HASILNYA
  async function gabungkanDataHayuMencatat() {
    const [catatan, statistik] = await Promise.allSettled([apiCatatan(1, 400), apiStatistik(600)]);
    const hitung = (status) => [catatan, statistik].filter((item) => item.status === status).length;
    return {
      catatan: catatan.status === "fulfilled" ? catatan.value : null,
      statistik: statistik.status === "fulfilled" ? statistik.value : null,
      berhasil: hitung("fulfilled"),
      gagal: hitung("rejected"),
      alasan: statistik.status === "rejected" ? statistik.reason.message : "-",
    };
  }
  const mulaiGabung = Date.now();
  const g = await gabungkanDataHayuMencatat();
  const baris61 = `kedua endpoint dipanggil bersamaan memakai Promise.allSettled, jeda 400 ms dan 600 ms
endpoint /api/catatan/1 : fulfilled
endpoint /api/statistik : rejected, alasan ${g.alasan}
objek gabungan : { "catatan": ${JSON.stringify(g.catatan)}, "statistik": ${g.statistik === null ? "null karena request gagal, bukan berarti penggabungan gagal" : JSON.stringify(g.statistik)} }
ringkasan : ${g.berhasil} endpoint berhasil, ${g.gagal} endpoint gagal
durasi paralel terukur ${Date.now() - mulaiGabung} ms, bukan 400 + 600 = 1000 ms`;
  console.log("6.1 ->", baris61);
  wadah.innerHTML += `
  <h3>LATIHAN 6.1 - Buat fungsi yang fetch data dari beberapa endpoint dan gabungkan hasilnya</h3>
  <pre>${aman(baris61)}</pre>`;

  // ---------------------------------------------------------------------
  // LATIHAN 6.2 - IMPLEMENTASI MEKANISME RETRY DENGAN EXPONENTIAL BACKOFF
  let hitunganApi = 0;
  // Endpoint selalu gagal sampai ambangBatas percobaan, lalu berhasil.
  const apiSibuk = (ambangBatas, jedaMs = 120) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        hitunganApi += 1;
        if (hitunganApi < ambangBatas) return reject(new Error("HTTP 503, server sedang sibuk"));
        resolve({ id: 1, judul: "Tugas Praktikum PAW", percobaanSukses: hitunganApi });
      }, jedaMs);
    });

  // Jeda menunggu berlipat ganda: 200 ms, lalu 400 ms, lalu 800 ms.
  async function jalankanDenganRetry(jalankan, maksPercobaan, jedaAwal = 200) {
    const jejak = [];
    let jedaDipakai = 0;
    let galatTerakhir = new Error("fungsi tidak pernah dijalankan");
    for (let percobaan = 1; percobaan <= maksPercobaan; percobaan += 1) {
      try {
        return { berhasil: true, data: await jalankan(), percobaan: percobaan, jejak: jejak, jeda: jedaDipakai };
      } catch (galat) {
        galatTerakhir = galat;
        jejak.push("percobaan " + percobaan + " dari " + maksPercobaan + " gagal: " + galat.message);
        if (percobaan === maksPercobaan) break;
        const jeda = jedaAwal * Math.pow(2, percobaan - 1);
        const mulaiTunggu = Date.now();
        await tunda(jeda);
        jedaDipakai += jeda;
        jejak.push(`  jeda exponential ${jeda} ms = ${jedaAwal} x 2^${percobaan - 1}, ditunggu ${Date.now() - mulaiTunggu} ms`);
      }
    }
    return { berhasil: false, data: null, percobaan: maksPercobaan, jejak: jejak, jeda: jedaDipakai, galat: galatTerakhir.message };
  }
  const retrySukses = await jalankanDenganRetry(() => apiSibuk(4), 4);
  const retryGagal = await jalankanDenganRetry(() => apiSibuk(9), 3);
  const baris62 = `kasus 1, endpoint pulih pada percobaan keempat
${retrySukses.jejak.join("\n")}
percobaan total ${retrySukses.percobaan}, jeda ${retrySukses.jeda} ms (200 + 400 + 800), akhir: berhasil, data ${JSON.stringify(retrySukses.data)}

kasus 2, endpoint tidak pulih dalam 3 percobaan
${retryGagal.jejak.join("\n")}
percobaan total ${retryGagal.percobaan}, jeda ${retryGagal.jeda} ms (200 + 400), akhir: menyerah, alasan ${retryGagal.galat}`;
  console.log("6.2 ->", baris62);
  wadah.innerHTML += `
  <h3>LATIHAN 6.2 - Implementasi mekanisme retry dengan exponential backoff</h3>
  <pre>${aman(baris62)}</pre>`;

  // ---------------------------------------------------------------------
  // LATIHAN 6.3 - BUAT LOADING STATES UNTUK OPERASI ASYNC DI UI
  let percobaanMuat = 0;
  // Status "Memuat..." diganti hasil atau pesan gagal setelah promise selesai.
  // Elemen dicari ulang sesudah await karena bagian lain menambah isi wadah
  // lewat innerHTML sehingga node lama sudah lepas dari dokumen.
  async function muatDenganLoadingState(kemauGagal) {
    percobaanMuat += 1;
    const nomor = percobaanMuat;
    document.getElementById("status63").textContent = "Memuat...";
    document.getElementById("keluaran63").textContent = "";
    try {
      const catatan = kemauGagal ? await apiStatistik(600) : await apiCatatan(1, 600);
      document.getElementById("status63").textContent = "Selesai";
      document.getElementById("keluaran63").textContent =
        `percobaan ${nomor}\nstatus : Selesai\ndata : ${JSON.stringify(catatan)}`;
      console.log("6.3 -> percobaan " + nomor + ", status Selesai, data " + JSON.stringify(catatan));
    } catch (galat) {
      document.getElementById("status63").textContent = "Gagal";
      document.getElementById("keluaran63").textContent =
        `percobaan ${nomor}\nstatus : Gagal\npesan : ${galat.message}`;
      console.log("6.3 -> percobaan " + nomor + ", status Gagal, pesan " + galat.message);
    }
  }
  function pemicuMuat() {
    muatDenganLoadingState(percobaanMuat % 2 === 1).catch((galat) => console.warn("6.3", galat.message));
  }
  wadah.innerHTML += `
  <h3>LATIHAN 6.3 - Buat loading states untuk operasi async di UI</h3>
  <p>Status: <span id="status63" class="angka">Belum ada permintaan</span> <button id="tombolMuat63" type="button">Muat catatan</button></p>
  <pre id="keluaran63">Klik pertama berhasil, klik berikutnya gagal, lalu status bergantian.</pre>`;
  pemicuMuat();

  // ---------------------------------------------------------------------
  // LATIHAN 6.4 - BANGUN ERROR BOUNDARY UNTUK ERROR ASYNC
  // Pembatas error menangkap galat lalu menampilkan pesan fallback yang rapi.
  async function denganBatasError(nama, jalankan) {
    try {
      const data = await jalankan();
      return { ringkas: "sukses : " + nama, isi: `<p class="catatan catatan--sukses"><strong>Sukses.</strong> ${aman(nama)} termuat tanpa galat. Data: ${aman(JSON.stringify(data))}</p>` };
    } catch (galat) {
      return { ringkas: "tertangkap : " + nama, isi: `<p class="catatan catatan--galat"><strong>Gagal dimuat.</strong> ${aman(nama)}. Galat tertangkap di batas ini: ${aman(galat.name + ": " + galat.message)}. Bagian halaman lain tetap berjalan normal.</p>` };
    }
  }
  const kasusBatasError = [
    ["Catatan id 2, kondisi sukses", () => apiCatatan(2, 300)],
    ["Statistik HayuMencatat, server 503", () => apiStatistik(400)],
    ["Catatan id 99, tidak ada", () => apiCatatan(99, 300)],
  ];
  wadah.innerHTML += `
  <h3>LATIHAN 6.4 - Bangun error boundary untuk error async</h3>
  <div id="wadah64"></div>
  <pre id="keluaran64">Menjalankan tiga kasus melalui batas error...</pre>`;
  const hasilBatasError = [];
  for (const [nama, jalankan] of kasusBatasError) {
    const hasil = await denganBatasError(nama, jalankan);
    document.getElementById("wadah64").innerHTML += hasil.isi;
    hasilBatasError.push(hasil.ringkas);
  }
  console.log("6.4 ->", hasilBatasError.join("\n"));
  document.getElementById("keluaran64").textContent =
    `kasus ${kasusBatasError.length}, sukses ${hasilBatasError.filter((item) => item.startsWith("sukses")).length}, tertangkap ${hasilBatasError.filter((item) => item.startsWith("tertangkap")).length}
${hasilBatasError.join("\n")}`;

  // ---------------------------------------------------------------------
  // LATIHAN 6.5 - IMPLEMENTASI PAGINATION DENGAN ASYNC/AWAIT
  const UKURAN_HALAMAN = 3;
  const TOTAL_HALAMAN = Math.ceil(DAFTAR_CATATAN.length / UKURAN_HALAMAN);
  let halamanAktif = 1;
  async function ambilHalamanCatatan(nomor) {
    await tunda(300);
    return DAFTAR_CATATAN.slice((nomor - 1) * UKURAN_HALAMAN, nomor * UKURAN_HALAMAN);
  }
  async function tampilkanHalaman(nomor) {
    halamanAktif = nomor;
    document.getElementById("info65").textContent = "Memuat halaman " + nomor + " dari " + TOTAL_HALAMAN + "...";
    document.getElementById("daftar65").innerHTML = "<li>Memuat...</li>";
    try {
      const isi = await ambilHalamanCatatan(nomor);
      if (nomor !== halamanAktif) return;
      document.getElementById("info65").textContent = `Halaman ${nomor} dari ${TOTAL_HALAMAN}, menampilkan ${isi.length} dari ${DAFTAR_CATATAN.length} catatan dengan ${UKURAN_HALAMAN} per halaman`;
      tulisDaftar(document.getElementById("daftar65"), isi);
      console.log("6.5 -> halaman " + nomor + " dari " + TOTAL_HALAMAN + ", isi " + isi.length + " item");
      document.getElementById("tombolSebelumnya65").disabled = nomor <= 1;
      document.getElementById("tombolBerikutnya65").disabled = nomor >= TOTAL_HALAMAN;
    } catch (galat) {
      document.getElementById("info65").textContent = "Gagal memuat halaman: " + galat.message;
      document.getElementById("daftar65").innerHTML = "";
    }
  }
  wadah.innerHTML += `
  <h3>LATIHAN 6.5 - Implementasi pagination dengan async/await</h3>
  <button id="tombolSebelumnya65" class="secondary" type="button">Sebelumnya</button> <button id="tombolBerikutnya65" type="button">Berikutnya</button>
  <span id="info65" class="angka">Belum ada halaman dimuat</span>
  <ul id="daftar65"></ul>`;
  await tampilkanHalaman(1);

  // ---------------------------------------------------------------------
  // LATIHAN 6.6 - BUAT DEBOUNCED SEARCH DENGAN ASYNC API CALLS
  const jedaDebounceMs = 300;
  let handleTimerDebounce = null;
  let nomorRequest = 0;
  let requestTerdaftar = 0;
  const jejakRequest = [];

  // Hanya request terakhir yang boleh menulis ke layar, yang lain diabaikan.
  async function cariDenganDebounce(kata) {
    nomorRequest += 1;
    requestTerdaftar = nomorRequest;
    const token = nomorRequest;
    jejakRequest.push("request " + token + " dikirim dengan kata kunci " + JSON.stringify(kata));
    document.getElementById("jejak66").textContent = jejakRequest.slice(-8).join("\n");
    try {
      const hasil = await apiCari(kata, 500);
      if (token !== requestTerdaftar) {
        jejakRequest.push("  request " + token + " diabaikan karena ada ketikan baru");
        document.getElementById("jejak66").textContent = jejakRequest.slice(-8).join("\n");
        return;
      }
      document.getElementById("status66").textContent =
        `request ${token} selesai, ${hasil.length} catatan cocok untuk ${JSON.stringify(kata)}`;
      tulisDaftar(document.getElementById("daftar66"), hasil);
      console.log("6.6 -> request " + token + " " + JSON.stringify(kata) + ", " + hasil.length + " catatan cocok");
    } catch (galat) {
      document.getElementById("status66").textContent = "Pencarian gagal: " + galat.message;
      document.getElementById("daftar66").innerHTML = "";
    }
  }

  // Tiap ketikan mengatur ulang timer, sehingga hanya ketikan terakhir yang memanggil API.
  const jalankanDebounce = (kata) => {
    if (handleTimerDebounce !== null) clearTimeout(handleTimerDebounce);
    document.getElementById("status66").textContent = "Menunggu " + jedaDebounceMs + " ms sebelum memanggil API...";
    handleTimerDebounce = setTimeout(() => {
      handleTimerDebounce = null;
      cariDenganDebounce(kata).catch((galat) => console.warn("6.6", galat.message));
    }, jedaDebounceMs);
  };
  wadah.innerHTML += `
  <h3>LATIHAN 6.6 - Buat debounced search dengan async API calls</h3>
  <input id="inputCari66" type="text" value="tugas" />
  <p>Status: <span id="status66" class="angka">Belum ada pencarian</span></p>
  <ul id="daftar66"></ul>
  <pre id="jejak66">Jejak request akan tampil di sini.</pre>`;

  // Listener pada wadah memakai delegasi event, sehingga tetap berlaku
  // walau bagian lain menambah isi wadah lewat innerHTML.
  wadah.addEventListener("click", (evt) => {
    const id = evt.target.id;
    if (id === "tombolMuat63") pemicuMuat();
    if (id === "tombolSebelumnya65") tampilkanHalaman(Math.max(1, halamanAktif - 1)).catch(() => {});
    if (id === "tombolBerikutnya65") tampilkanHalaman(Math.min(TOTAL_HALAMAN, halamanAktif + 1)).catch(() => {});
  });
  wadah.addEventListener("input", (evt) => {
    if (evt.target.id === "inputCari66") jalankanDebounce(evt.target.value);
  });

  // Keadaan awal supaya bagian 6.6 langsung punya isi.
  jalankanDebounce("tugas");
}

jalankanModul().catch((galat) => {
  wadah.innerHTML += `<p class="catatan catatan--galat">Modul berhenti pada kesalahan: ${aman(galat.message)}</p>`;
});

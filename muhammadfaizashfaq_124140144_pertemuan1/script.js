/* =====================================================================
   Mini POS - Kasir & Keranjang Belanja Sederhana
   Praktikum Pengembangan Aplikasi Web - Pertemuan 1
   Nama  : Muhammad Faiz Ashfaq
   NIM   : 124140144
   Kelas : RA
   ---------------------------------------------------------------------
   Ringkasan alur logika:
   1) Validasi input form (nama min 3 char, harga min 500, qty min 1)
   2) Tambah item ke array `keranjang` lalu render ke tabel HTML
   3) Hitung subtotal, total, diskon ( otomatis + kode promo ), total akhir
   4) Hitung kembalian dari uang bayar
   5) Simpan/muat keranjang lewat localStorage (JSON.stringify / JSON.parse)
   ===================================================================== */

/* ------------------------------------------------------------------ */
/*  KONSTANTA & STATE                                                 */
/* ------------------------------------------------------------------ */
const BATAS_HARGA_MINIMUM = 500;
const BATAS_TOTAL_DISKON = 50000;
const PERSEN_DISKON = 0.1;
const KODE_PROMO_VALID = "HEMAT10";
const KUNCI_STORAGE = "minipos_keranjang_124140144";

/** @type {Array<{id:number, nama:string, harga:number, qty:number}>} */
let keranjang = [];
let promoTerpakai = false;
let idBerikutnya = 1;

/* ------------------------------------------------------------------ */
/*  UTILITAS: format angka Rupiah & DOM                                */
/* ------------------------------------------------------------------ */
const formatterRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

/** Ubah angka menjadi "Rp1.500" */
function formatRupiah(angka) {
  return formatterRupiah.format(angka).replace(/\s/g, "");
}

/** Ambil elemen berdasarkan id */
const $ = (id) => document.getElementById(id);

const el = {
  formBarang: $("formBarang"),
  namaBarang: $("namaBarang"),
  hargaSatuan: $("hargaSatuan"),
  jumlah: $("jumlah"),
  formFeedback: $("formFeedback"),

  isiKeranjang: $("isiKeranjang"),
  tabelKeranjang: $("tabelKeranjang"),
  emptyState: $("emptyState"),
  counterBarang: $("counterBarang"),
  ringkasanKeranjang: $("ringkasanKeranjang"),

  kodePromo: $("kodePromo"),
  btnPromo: $("btnPromo"),
  btnPromoReset: $("btnPromoReset"),

  totalBelanja: $("totalBelanja"),
  totalDiskon: $("totalDiskon"),
  labelDiskon: $("labelDiskon"),
  totalAkhir: $("totalAkhir"),

  formBayar: $("formBayar"),
  uangBayar: $("uangBayar"),
  kembalianBox: $("kembalianBox"),
  kembalian: $("kembalian"),
  kembalianNote: $("kembalianNote"),
  btnProsesBayar: $("btnProsesBayar"),
  btnTransaksiBaru: $("btnTransaksiBaru"),
};

/* ------------------------------------------------------------------ */
/*  1. VALIDASI INPUT FORM                                            */
/* ------------------------------------------------------------------ */

/**
 * Menampilkan / menghapus pesan error pada sebuah field.
 * @param {HTMLInputElement} input
 * @param {string} pesan - pesan kosong berarti field dianggap valid
 */
function tampilkanError(input, pesan) {
  const target = document.getElementById(`error-${input.id}`);
  input.classList.remove("gagal-diisi", "berhasil-diisi");

  if (pesan) {
    input.classList.add("gagal-diisi");
    input.setAttribute("aria-invalid", "true");
    target.textContent = pesan;
  } else {
    input.classList.add("berhasil-diisi");
    input.removeAttribute("aria-invalid");
    target.textContent = "";
  }
}

/** Menghapus semua penanda validasi pada form barang */
function bersihkanValidasi() {
  [el.namaBarang, el.hargaSatuan, el.jumlah].forEach((input) => {
    input.classList.remove("gagal-diisi", "berhasil-diisi");
    input.removeAttribute("aria-invalid");
    document.getElementById(`error-${input.id}`).textContent = "";
  });
}

/**
 * Validasi seluruh isian form barang.
 * @returns {{valid:boolean, data:{nama:string, harga:number, qty:number}}}
 */
function validasiFormBarang() {
  const namaMentah = el.namaBarang.value;
  const hargaMentah = el.hargaSatuan.value;
  const qtyMentah = el.jumlah.value;

  // --- Nama Barang: wajib diisi, minimal 3 karakter ---
  let namaValid = false;
  if (namaMentah.trim() === "") {
    tampilkanError(el.namaBarang, "Nama barang wajib diisi.");
  } else if (namaMentah.trim().length < 3) {
    tampilkanError(
      el.namaBarang,
      `Nama barang minimal 3 karakter (saat ini ${namaMentah.trim().length}).`
    );
  } else {
    tampilkanError(el.namaBarang, "");
    namaValid = true;
  }

  // --- Harga Satuan: wajib angka positif, minimal Rp500 ---
  let hargaValid = false;
  let harga = 0;
  if (hargaMentah.trim() === "") {
    tampilkanError(el.hargaSatuan, "Harga satuan wajib diisi.");
  } else if (!Number.isFinite(Number(hargaMentah))) {
    tampilkanError(el.hargaSatuan, "Harga harus berupa angka, bukan teks.");
  } else {
    harga = Number(hargaMentah);
    if (harga <= 0) {
      tampilkanError(el.hargaSatuan, "Harga harus lebih besar dari 0.");
    } else if (harga < BATAS_HARGA_MINIMUM) {
      tampilkanError(
        el.hargaSatuan,
        `Harga minimal ${formatRupiah(BATAS_HARGA_MINIMUM)}.`
      );
    } else {
      tampilkanError(el.hargaSatuan, "");
      hargaValid = true;
    }
  }

  // --- Jumlah / Qty: wajib bilangan bulat, minimal 1 ---
  let qtyValid = false;
  let qty = 0;
  if (qtyMentah.trim() === "") {
    tampilkanError(el.jumlah, "Jumlah wajib diisi.");
  } else if (!Number.isFinite(Number(qtyMentah))) {
    tampilkanError(el.jumlah, "Jumlah harus berupa angka.");
  } else {
    qty = Number(qtyMentah);
    if (!Number.isInteger(qty)) {
      tampilkanError(el.jumlah, "Jumlah harus bilangan bulat (tanpa desimal).");
    } else if (qty < 1) {
      tampilkanError(el.jumlah, "Jumlah minimal 1.");
    } else {
      tampilkanError(el.jumlah, "");
      qtyValid = true;
    }
  }

  return {
    valid: namaValid && hargaValid && qtyValid,
    data: { nama: namaMentah.trim(), harga, qty },
  };
}

/* ------------------------------------------------------------------ */
/*  2. MANAJEMEN KERANJANG                                            */
/* ------------------------------------------------------------------ */

/** Menambah satu item ke keranjang (hanya dipanggil bila validasi lolos). */
function tambahKeKeranjang({ nama, harga, qty }) {
  keranjang.push({ id: idBerikutnya++, nama, harga, qty });
}

/** Menghapus item berdasarkan id, lalu render ulang. */
function hapusDariKeranjang(id) {
  const baris = document.querySelector(`tr[data-id="${id}"]`);

  const hapusItemDariArray = () => {
    keranjang = keranjang.filter((item) => item.id !== id);
    simpanKeranjang();
    renderKeranjang();
    hitungSemua();
    bersihkanValidasi();
  };

  // animasi singkat sebelum baris benar-benar dihapus dari array
  if (baris) {
    baris.classList.add("baris-terhapus");
    setTimeout(hapusItemDariArray, 200);
  } else {
    hapusItemDariArray();
  }
}

/* ------------------------------------------------------------------ */
/*  3. RENDER TABEL KERANJANG                                          */
/* ------------------------------------------------------------------ */
function renderKeranjang() {
  const adaBarang = keranjang.length > 0;

  // tampilkan/sembunyikan tabel vs kondisi kosong
  el.tabelKeranjang.style.display = adaBarang ? "" : "none";
  $("tableWrapper").style.display = adaBarang ? "" : "none";
  el.emptyState.classList.toggle("sembunyi", adaBarang);

  // ringkasan jumlah barang
  const totalItem = keranjang.reduce((jumlah, item) => jumlah + item.qty, 0);
  el.counterBarang.textContent = `${adaBarang ? totalItem : 0} item`;
  el.ringkasanKeranjang.textContent = adaBarang
    ? `${keranjang.length} jenis barang, ${totalItem} pcs di keranjang`
    : "Belum ada barang di keranjang";

  // bangun baris tabel dengan method map()
  el.isiKeranjang.innerHTML = keranjang
    .map((item, index) => {
      const subtotal = item.harga * item.qty;
      return `
      <tr data-id="${item.id}" class="baris-baru">
        <td class="col-no" data-label="No">${index + 1}</td>
        <td data-label="Nama Barang"><span class="nama-item">${escapeHtml(item.nama)}</span></td>
        <td class="col-harga" data-label="Harga Satuan">${formatRupiah(item.harga)}</td>
        <td class="col-qty" data-label="Qty">${item.qty}</td>
        <td class="col-subtotal" data-label="Subtotal">
          <span class="subtotal-cell">${formatRupiah(subtotal)}</span>
        </td>
        <td class="col-aksi">
          <button type="button" class="btn-hapus" data-hapus="${item.id}">Hapus</button>
        </td>
      </tr>`;
    })
    .join("");
}

/** Melindungi tampilan dari karakter HTML pada nama barang. */
function escapeHtml(teks) {
  return teks.replace(/[&<>"']/g, (karakter) => {
    const peta = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return peta[karakter];
  });
}

/* ------------------------------------------------------------------ */
/*  4. KALKULATOR: TOTAL, DISKON, TOTAL AKHIR                          */
/* ------------------------------------------------------------------ */
function hitungTotalBelanja() {
  return keranjang.reduce((total, item) => total + item.harga * item.qty, 0);
}

/**
 * Menghitung nominal diskon.
 * Diskon 10% berlaku bila: (a) total >= Rp50.000 OTOMATIS, atau
 * (b) kasir memasukkan kode promo HEMAT10. Keduanya tidak ditumpuk,
 * potongan maksimal 10%.
 */
function hitungDiskon(total) {
  const otomatis = total >= BATAS_TOTAL_DISKON;
  const alasan = [];

  if (otomatis) alasan.push(`Otomatis (total ≥ ${formatRupiah(BATAS_TOTAL_DISKON)})`);
  if (promoTerpakai) alasan.push(`Kode promo ${KODE_PROMO_VALID}`);

  const berlaku = otomatis || promoTerpakai;
  const nominal = berlaku ? Math.round(total * PERSEN_DISKON) : 0;

  return { berlaku, nominal, alasan };
}

/** Menggambar seluruh angka ringkasan ke layar. */
function hitungSemua() {
  const total = hitungTotalBelanja();
  const diskon = hitungDiskon(total);
  const totalAkhir = total - diskon.nominal;

  el.totalBelanja.textContent = formatRupiah(total);
  el.totalDiskon.textContent = diskon.nominal > 0 ? `-${formatRupiah(diskon.nominal)}` : formatRupiah(0);
  el.totalDiskon.classList.toggle("nol", diskon.nominal === 0);
  el.totalAkhir.textContent = formatRupiah(totalAkhir);
  el.labelDiskon.textContent = diskon.alasan.length ? `(${diskon.alasan.join(" + ")})` : "";

  hitungKembalian();
}

/* ------------------------------------------------------------------ */
/*  5. KALKULATOR KEMBALIAN                                           */
/* ------------------------------------------------------------------ */
function hitungKembalian() {
  const total = hitungTotalBelanja();
  const diskon = hitungDiskon(total);
  const totalAkhir = total - diskon.nominal;
  const uangMentah = el.uangBayar.value;

  el.kembalianBox.classList.remove("negatif", "positif");
  el.kembalianNote.textContent = "";
  el.kembalianNote.style.color = "var(--warna-teks-soft)";

  // --- Keranjang masih kosong ---
  if (keranjang.length === 0) {
    el.kembalian.textContent = formatRupiah(0);
    el.kembalianNote.textContent = "Keranjang masih kosong, tidak ada yang perlu dibayar.";
    return;
  }

  // --- Uang bayar belum diinputkan ---
  if (uangMentah.trim() === "") {
    el.kembalian.textContent = formatRupiah(0);
    el.kembalianNote.textContent =
      "Masukkan uang bayar untuk menghitung kembalian.";
    return;
  }

  const uangBayar = Number(uangMentah);

  if (!Number.isFinite(uangBayar) || uangBayar < 0) {
    el.kembalian.textContent = formatRupiah(0);
    el.kembalianNote.textContent = "Uang bayar tidak valid.";
    el.kembalianNote.style.color = "var(--warna-merah)";
    return;
  }

  const kembalian = uangBayar - totalAkhir;

  if (kembalian < 0) {
    // Uang belum cukup -> transaksi tidak dapat diproses, sehingga TIDAK ada kembalian.
    // Nominal kekurangan hanya disampaikan lewat pesan di bawahnya.
    el.kembalianBox.classList.add("negatif");
    el.kembalian.textContent = formatRupiah(0);
    el.kembalianNote.textContent =
      "Uang belum mencukupi! Kurang " + formatRupiah(Math.abs(kembalian)) + ".";
    el.kembalianNote.style.color = "var(--warna-merah)";
  } else if (kembalian === 0) {
    el.kembalian.textContent = formatRupiah(0);
    el.kembalianNote.textContent = "Pembayaran pas, tidak ada kembalian.";
    el.kembalianNote.style.color = "var(--warna-teks-soft)";
  } else {
    el.kembalianBox.classList.add("positif");
    el.kembalian.textContent = formatRupiah(kembalian);
    el.kembalianNote.textContent = "Kembalian untuk pelanggan.";
    el.kembalianNote.style.color = "var(--warna-hijau)";
  }
}

/* ------------------------------------------------------------------ */
/*  5b. VALIDASI PEMBAYARAN                                           */
/*      Pembayaran hanya boleh diproses bila uang bayar sudah diisi,   */
/*      berupa angka valid, dan nilainya mencukupi total akhir.        */
/* ------------------------------------------------------------------ */

/**
 * Memeriksa apakah tombol "Proses Pembayaran" boleh dijalankan.
 * @returns {{valid: boolean, tipe: string, pesan: string}}
 *        tipe: "ok" | "keranjangKosong" | "uangKosong" | "uangTidakValid" | "uangKurang"
 */
function periksaPembayaran() {
  const total = hitungTotalBelanja();
  const diskon = hitungDiskon(total);
  const totalAkhir = total - diskon.nominal;
  const uangMentah = el.uangBayar.value.trim();

  // 1) Keranjang masih kosong
  if (keranjang.length === 0) {
    return {
      valid: false,
      tipe: "keranjangKosong",
      pesan: "Pembayaran tidak dapat diproses: keranjang masih kosong.",
    };
  }

  // 2) Uang bayar BELUM diinputkan
  if (uangMentah === "") {
    return {
      valid: false,
      tipe: "uangKosong",
      pesan: "Pembayaran tidak dapat diproses: uang bayar belum diisi.",
    };
  }

  // 3) Uang bayar bukan angka / bernilai negatif
  const uangBayar = Number(uangMentah);
  if (!Number.isFinite(uangBayar) || uangBayar < 0) {
    return {
      valid: false,
      tipe: "uangTidakValid",
      pesan: "Pembayaran tidak dapat diproses: uang bayar tidak valid.",
    };
  }

  // 4) Uang bayar belum mencukupi total akhir
  if (uangBayar < totalAkhir) {
    return {
      valid: false,
      tipe: "uangKurang",
      pesan:
        "Pembayaran tidak dapat diproses: uang belum mencukupi! Kurang " +
        formatRupiah(totalAkhir - uangBayar) +
        ".",
    };
  }

  // 5) Lolos — pembayaran diproses
  return {
    valid: true,
    tipe: "ok",
    pesan:
      uangBayar === totalAkhir
        ? "Pembayaran diproses. Uang pas, tidak ada kembalian."
        : "Pembayaran diproses. Kembalian dihitung otomatis.",
  };
}

/* ------------------------------------------------------------------ */
/*  6. PENYIMPANAN PERSISTEN (LOCALSTORAGE)                            */
/* ------------------------------------------------------------------ */
function simpanKeranjang() {
  try {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(keranjang));
  } catch (error) {
    console.error("Gagal menyimpan keranjang:", error);
  }
}

/** Memuat keranjang dari localStorage saat halaman pertama kali dibuka. */
function muatKeranjang() {
  try {
    const dataTersimpan = localStorage.getItem(KUNCI_STORAGE);
    if (!dataTersimpan) return;

    const parsed = JSON.parse(dataTersimpan);
    if (Array.isArray(parsed)) {
      keranjang = parsed.map((item) => ({
        id: item.id,
        nama: String(item.nama ?? ""),
        harga: Number(item.harga) || 0,
        qty: Number(item.qty) || 0,
      }));
      idBerikutnya = keranjang.reduce((maks, item) => Math.max(maks, item.id), 0) + 1;
    }
  } catch (error) {
    console.error("Data keranjang rusak, memuat keranjang kosong:", error);
    localStorage.removeItem(KUNCI_STORAGE);
  }
}

/* ------------------------------------------------------------------ */
/*  7. TRANSAKSI BARU / RESET                                          */
/* ------------------------------------------------------------------ */
function transaksiBaru() {
  keranjang = [];
  promoTerpakai = false;
  idBerikutnya = 1;

  localStorage.removeItem(KUNCI_STORAGE);

  el.formBarang.reset();
  el.formBayar.reset();
  el.kodePromo.value = "";
  bersihkanValidasi();
  bersihkanPesan("#formFeedback");
  bersihkanPesan("#error-kodePromo");
  bersihkanPesan("#error-uangBayar");
  el.uangBayar.classList.remove("gagal-diisi", "berhasil-diisi");
  el.uangBayar.removeAttribute("aria-invalid");
  el.kembalianBox.classList.remove("negatif", "positif");
  el.kembalianNote.style.color = "var(--warna-teks-soft)";
  el.kembalianNote.style.fontWeight = "";

  renderKeranjang();
  hitungSemua();

  el.namaBarang.focus();
}

function bersihkanPesan(selector) {
  const elemen = document.querySelector(selector);
  if (elemen) elemen.textContent = "";
}

/* ------------------------------------------------------------------ */
/*  8. EVENT HANDLER                                                  */
/* ------------------------------------------------------------------ */
el.formBarang.addEventListener("submit", (event) => {
  event.preventDefault();
  const hasil = validasiFormBarang();

  if (!hasil.valid) {
    // barang TIDAK masuk keranjang bila ada field tidak valid
    el.formFeedback.className = "form-feedback form-feedback--gagal";
    el.formFeedback.textContent = "Data belum lengkap/valid. Periksa pesan merah di bawah input.";
    return;
  }

  tambahKeKeranjang(hasil.data);
  simpanKeranjang();
  renderKeranjang();
  hitungSemua();

  // form otomatis di-reset setelah berhasil
  el.formBarang.reset();
  bersihkanValidasi();

  el.formFeedback.className = "form-feedback form-feedback--sukses";
  el.formFeedback.textContent = `"${hasil.data.nama}" × ${hasil.data.qty} ditambahkan ke keranjang.`;
  el.namaBarang.focus();
});

/* Tombol hapus (event delegation) */
el.isiKeranjang.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-hapus]");
  if (!tombol) return;
  hapusDariKeranjang(Number(tombol.dataset.hapus));
});

/* Kode promo */
el.btnPromo.addEventListener("click", () => {
  const kode = el.kodePromo.value.trim().toUpperCase();
  const pesanError = document.getElementById("error-kodePromo");

  if (kode === KODE_PROMO_VALID) {
    promoTerpakai = true;
    pesanError.textContent = "";
  } else {
    promoTerpakai = false;
    pesanError.textContent =
      kode === "" ? "Masukkan kode promo terlebih dahulu." : `Kode "${kode}" tidak valid.`;
  }
  hitungSemua();
});

el.btnPromoReset.addEventListener("click", () => {
  promoTerpakai = false;
  el.kodePromo.value = "";
  document.getElementById("error-kodePromo").textContent = "";
  hitungSemua();
});

/* Perhitungan kembalian (otomatis saat mengetik) */
el.uangBayar.addEventListener("input", () => {
  // pesan error bawah input dihapus begitu kasir mulai mengetik ulang
  if (el.uangBayar.classList.contains("gagal-diisi") && el.uangBayar.value.trim() !== "") {
    tampilkanError(el.uangBayar, "");
  }
  hitungKembalian();
});

el.btnProsesBayar.addEventListener("click", () => {
  hitungKembalian(); // segarkan tampilan kembalian sesuai kondisi terkini

  const hasil = periksaPembayaran();

  el.kembalianNote.style.fontWeight = "700";
  el.kembalianNote.textContent = hasil.pesan;
  el.kembalianNote.style.color = hasil.valid ? "var(--warna-hijau)" : "var(--warna-merah)";

  // tandai field uang bayar bila kosong / tidak valid
  if (hasil.tipe === "uangKosong") {
    tampilkanError(el.uangBayar, "Uang bayar wajib diisi.");
    el.uangBayar.focus();
    return;
  }
  if (hasil.tipe === "uangTidakValid") {
    tampilkanError(el.uangBayar, "Uang bayar harus berupa angka yang valid.");
    el.uangBayar.focus();
    return;
  }
  if (hasil.tipe === "uangKurang") {
    el.kembalianBox.classList.add("negatif");
    el.kembalianBox.classList.remove("positif");
    el.uangBayar.focus();
    return;
  }
  if (hasil.tipe === "keranjangKosong") {
    el.kembalianBox.classList.remove("positif");
    el.namaBarang.focus();
    return;
  }

  // Pembayaran berhasil diproses
  if (hasil.tipe === "ok") {
    el.uangBayar.classList.remove("gagal-diisi");
    el.uangBayar.classList.add("berhasil-diisi");
    document.getElementById("error-uangBayar").textContent = "";
    if (Number(el.uangBayar.value) > hitungTotalAkhir()) {
      el.kembalianBox.classList.add("positif");
    }
  }
});

/** Mengembalikan total akhir (total belanja - diskon). */
function hitungTotalAkhir() {
  const total = hitungTotalBelanja();
  return total - hitungDiskon(total).nominal;
}

el.btnTransaksiBaru.addEventListener("click", () => {
  if (
    keranjang.length > 0 &&
    !window.confirm("Kosongkan keranjang dan mulai transaksi baru?")
  ) {
    return;
  }
  transaksiBaru();
});

/* Bersihkan penanda error saat pengguna mengetik ulang */
[el.namaBarang, el.hargaSatuan, el.jumlah].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("gagal-diisi")) {
      tampilkanError(input, "");
    }
  });
});

/* ------------------------------------------------------------------ */
/*  9. INISIALISASI APLIKASI                                          */
/* ------------------------------------------------------------------ */
function init() {
  muatKeranjang();
  renderKeranjang();
  hitungSemua();
  console.log("Mini POS siap digunakan. Item keranjang tersimpan:", keranjang.length);
}

init();
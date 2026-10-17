/* =====================================================================
   MODUL 04 - CLASSES DAN OBJECT LITERALS
   Praktikum PAW - Pertemuan 2 - Muhammad Faiz Ashfaq (124140144)
   Topik: class, inheritance, getter, setter, computed property names, default parameter, destructuring
   ===================================================================== */
const wadah = document.getElementById("result");
const aman = (teks) =>
  String(teks).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------------------------------------------------------------
// LATIHAN 4.1 - BUAT CLASS PRODUCT DENGAN INHERITANCE KE DIGITALPRODUCT DAN PHYSICALPRODUCT
// ---------------------------------------------------------------------
class Product {
  constructor(nama, harga, jenis, warna = "hitam") {
    this.nama = nama;
    this.harga = harga;
    this.jenis = jenis;
    this.warna = warna;
  }
  // Method induk yang nanti dioverride oleh kedua kelas anak.
  deskripsi() {
    return `${this.nama} | jenis ${this.jenis} | warna ${this.warna} | Rp${this.harga.toLocaleString("id-ID")}`;
  }
}
class DigitalProduct extends Product {
  constructor(nama, harga, format, ukuranFile) {
    super(nama, harga, "digital", "tidak ada"); // super wajib lebih dulu sebelum memakai this
    this.format = format;
    this.ukuranFile = ukuranFile;
  }
  // Override: memanggil versi induk lewat super, lalu menambah data turunan.
  deskripsi() {
    return `${super.deskripsi()} | format ${this.format} | ukuran ${this.ukuranFile} MB`;
  }
}
class PhysicalProduct extends Product {
  constructor(nama, harga, berat, stok) {
    super(nama, harga, "fisik", "merah");
    this.berat = berat;
    this.stok = stok;
  }
  deskripsi() {
    return `${super.deskripsi()} | berat ${this.berat} kg | stok ${this.stok} buah`;
  }
}
const eBook = new DigitalProduct("Ebook JavaScript", 120000, "PDF", 8);
const bukuPAW = new PhysicalProduct("Buku Praktikum PAW", 85000, 0.4, 12);
const baris41 = `eBook   instanceof Product / DigitalProduct : ${eBook instanceof Product} / ${eBook instanceof DigitalProduct}
bukuPAW instanceof PhysicalProduct / Product : ${bukuPAW instanceof PhysicalProduct} / ${bukuPAW instanceof Product}
salah satu pewarisan, keduanya false : ${eBook instanceof PhysicalProduct} / ${bukuPAW instanceof DigitalProduct}
properti turunan : eBook format ${eBook.format} ukuran ${eBook.ukuranFile} MB, bukuPAW berat ${bukuPAW.berat} kg stok ${bukuPAW.stok} buah
override deskripsi() eBook   : ${eBook.deskripsi()}
override deskripsi() bukuPAW : ${bukuPAW.deskripsi()}`;
console.log("4.1 ->", baris41);
wadah.innerHTML += `
  <h3>LATIHAN 4.1 - Buat class Product dengan inheritance ke DigitalProduct dan PhysicalProduct</h3>
  <pre>${aman(baris41)}</pre>
`;
// ---------------------------------------------------------------------
// LATIHAN 4.2 - IMPLEMENTASI GETTER DAN SETTER DALAM CLASS
// ---------------------------------------------------------------------
class NilaiUjian {
  #nilai = 0; // field privat menjadi satu-satunya tempat penyimpanan
  constructor(nama) { this.nama = nama; }
  // Getter membaca nilai yang sudah lolos pemeriksaan setter.
  get nilai() { return this.#nilai; }
  // Setter menjadi penjaga, nilai di luar batas dilempar sebagai galat.
  set nilai(baru) {
    if (typeof baru !== "number" || Number.isNaN(baru)) throw new TypeError("nilai harus berupa angka");
    if (baru < 0) throw new RangeError("nilai tidak boleh negatif");
    if (baru > 100) throw new RangeError("nilai tidak boleh lebih dari 100");
    this.#nilai = baru;
  }
  // Getter turunan yang dihitung dari nilai yang sedang berlaku.
  get keterangan() {
    if (this.#nilai >= 85) return "A";
    if (this.#nilai >= 70) return "B";
    if (this.#nilai >= 60) return "C";
    return "D";
  }
}

const ujian = new NilaiUjian("Ujian Praktikum PAW");
ujian.nilai = 88; // setter menerima, lalu getter membacanya
const laporanGalat = [];
[-5, 120, "delapan"].forEach((percobaan) => {
  try {
    ujian.nilai = percobaan;
  } catch (galat) {
    laporanGalat.push(`  ditolak ${JSON.stringify(percobaan)} -> ${galat.name}: ${galat.message}`);
  }
});
const baris42 = `percobaan yang ditolak setter :
${laporanGalat.join("\n")}
nilai akhir ujian.nilai : ${ujian.nilai} -> tetap 88, karena ketiga percobaan gagal
getter keterangan : ${ujian.keterangan}, pasangan accessor : ${Object.getOwnPropertyNames(NilaiUjian.prototype).join(", ")}`;
console.log("4.2 ->", baris42);
wadah.innerHTML += `
  <h3>LATIHAN 4.2 - Implementasi getter dan setter dalam class</h3>
  <pre>${aman(baris42)}</pre>
`;
// ---------------------------------------------------------------------
// LATIHAN 4.3 - GUNAKAN COMPUTED PROPERTY NAMES UNTUK MEMBUAT OBJECT DENGAN DYNAMIC KEYS
// ---------------------------------------------------------------------
const labelStatistik = ["total", "rataRata", "puncak"];
const angkaStatistik = [128, 86.5, 97];
const statistik = {};
// Kunci ditulis di dalam kurung siku sehingga diambil dari isi array label.
labelStatistik.forEach((label, indeks) => {
  statistik[label] = angkaStatistik[indeks];
});
// Versi ringkas: map lalu Object.fromEntries, kuncinya tetap computed.
const statistikRingkas = Object.fromEntries(labelStatistik.map((label, i) => [`nilai_${label}`, angkaStatistik[i]]));
const baris43 = `daftar label dan angka : ${JSON.stringify(labelStatistik)} oraz ${JSON.stringify(angkaStatistik)}
kunci dinamis yang terbentuk : ${JSON.stringify(Object.keys(statistik))}
pasangan kunci dan nilai : ${Object.entries(statistik).map(([kunci, nilai]) => `${kunci} = ${nilai}`).join(" | ")}
jumlah kunci ${Object.keys(statistik).length} sama dengan jumlah label ${labelStatistik.length}, kunci versi ringkas ${JSON.stringify(Object.keys(statistikRingkas))}`;
console.log("4.3 ->", baris43);
wadah.innerHTML += `
  <h3>LATIHAN 4.3 - Gunakan computed property names untuk membuat object dengan dynamic keys</h3>
  <pre>${aman(baris43)}</pre>
`;
// ---------------------------------------------------------------------
// LATIHAN 4.4 - COMBINE DEFAULT PARAMETERS DENGAN DESTRUCTURING DALAM FUNCTION PARAMETER
// ---------------------------------------------------------------------
function ringkasArtikel(
  { judul = "Tanpa Judul", penulis = "Anonim", tahun = 2026, kataKunci = ["umum"] } = {}, batasJudul = 20
) {
  return {
    judul: judul.length > batasJudul ? judul.slice(0, batasJudul) + "..." : judul,
    penulis,
    tahun,
    jumlahKataKunci: kataKunci.length,
  };
}
const tanpaArgumen = ringkasArtikel();
const sebagianArgumen = ringkasArtikel({ judul: "Rangkuman Pertemuan Dua ES6" }, 12);
const lengkapArgumen = ringkasArtikel({ judul: "Array Method Praktis", penulis: "Faiz", tahun: 2025, kataKunci: ["javascript", "array"] }, 40);
const baris44 = `dipanggil tanpa argumen        : hasil = ${JSON.stringify(tanpaArgumen)}
dipanggil dengan sebagian argumen : hasil = ${JSON.stringify(sebagianArgumen)}
dipanggil dengan seluruh argumen  : hasil = ${JSON.stringify(lengkapArgumen)}
nilai bawaan tanpa argumen : tahun ${tanpaArgumen.tahun}, batasJudul 20, jumlahKataKunci ${tanpaArgumen.jumlahKataKunci}, sedangkan argumen lengkap ${lengkapArgumen.jumlahKataKunci}`;
console.log("4.4 ->", baris44);
wadah.innerHTML += `
  <h3>LATIHAN 4.4 - Combine default parameters dengan destructuring dalam function parameter</h3>
  <pre>${aman(baris44)}</pre>
`;
/* =====================================================================
   MODUL 02 - TEMPLATE LITERALS
   Praktikum PAW - Pertemuan 2 - Muhammad Faiz Ashfaq (124140144)
   Topik: mencoba mengubah nilai const, perbedaan perilaku var di dalam
          dan luar block, bentuk-bentuk arrow function, serta menyusun
          string HTML dengan template literal
   Script klasik (bukan module) tanpa import atau export.
   ===================================================================== */

// Wadah hasil yang sudah disediakan oleh halaman HTML modul.
const wadah = document.getElementById("result");

// Helper agar teks yang ditampilkan ke layar tidak ditafsirkan sebagai tag HTML.
const aman = (teks) => String(teks).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Data catatan yang dipakai pada latihan 2.4.
const daftarCatatan = [
  { judul: "Rangkuman Pertemuan 2", kategori: "kuliah", prioritas: "tinggi" },
  { judul: "Tugas Praktikum PAW", kategori: "tugas", prioritas: "sedang" },
];

// ---------------------------------------------------------------------
// LATIHAN 2.1 - COBA UBAH NILAI CONST DAN LIHAT ERROR YANG MUNCUL
// ---------------------------------------------------------------------
// Nilai const dikunci sejak baris deklarasi, sehingga tidak bisa diarah ulang.
const batasNilai = 100;
let pesanGalat = "tidak ada error, nilai berhasil diubah";
try {
  batasNilai = 85; // baris inilah yang memicu TypeError
} catch (error) {
  pesanGalat = error.name + ": " + error.message;
}
// Percobaan kedua memakai nama baru, jadi tidak ada bentrok dan tidak ada galat.
const tahunSidang = 2026;
const tahunSidangPerbaikan = 2027;
// Pembanding: nilai let memang boleh diganti kapan saja.
let nilaiUji = 60;
nilaiUji = 75;
const laporanConst = `deklarasi const     : batasNilai = ${batasNilai}
percobaan reassign  : ${pesanGalat}
nilai setelah gagal: ${batasNilai} (tetap sama, tidak berubah)
let nilaiUji        : ${nilaiUji} (reassign berhasil, 60 menjadi 75)
tahunSidang         : ${tahunSidang}, tahunSidangPerbaikan: ${tahunSidangPerbaikan}`;
console.log("2.1 ->\n" + laporanConst);
wadah.innerHTML += `
  <h3>LATIHAN 2.1 - Coba ubah nilai const dan lihat error yang muncul</h3>
  <pre>${aman(laporanConst)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 2.2 - BANDINGKAN BEHAVIOR VAR DI DALAM DAN LUAR BLOCK
// ---------------------------------------------------------------------
// Dua variabel ini disiapkan lebih dulu agar isinya bisa dibaca dari luar blok.
let catatanLetTersimpan = "nilai let tidak ada di luar blok";
let totalLetTersimpan = 0;
{
  var catatanVar = "Catatan kuliah, ditulis dengan var";
  var totalVar = 3;
  let catatanLet = "Catatan tugas, ditulis dengan let";
  let totalLet = 2;
  // Nilai let disalin ke variabel luar sebelum blok ditutup.
  catatanLetTersimpan = catatanLet;
  totalLetTersimpan = totalLet;
  console.log("2.2 di dalam blok ->", catatanVar, "|", catatanLet);
}
// Di luar blok, variabel var masih bisa dibaca karena cakupannya fungsi.
const laporanVar = `${catatanVar} | total ${totalVar}`;
// Variabel let sudah hilang bersama bloknya, sehingga penyebutannya gagal.
let laporanLet = "tidak ada error";
try {
  laporanLet = `${catatanLet} | total ${totalLet}`;
} catch (error) {
  laporanLet = error.name + ": " + error.message;
}
const laporanCakupan = `var di dalam blok : ${catatanVar}
var di luar blok  : ${laporanVar}
let di dalam blok : ${catatanLetTersimpan} | total ${totalLetTersimpan}
let di luar blok  : ${laporanLet}
jumlah catatan var: ${totalVar}, jumlah catatan let: ${totalLetTersimpan}`;
console.log("2.2 ->\n" + laporanCakupan);
wadah.innerHTML += `
  <h3>LATIHAN 2.2 - Bandingkan behavior var di dalam dan luar block</h3>
  <pre>${aman(laporanCakupan)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 2.3 - BUAT ARROW FUNCTION DENGAN BEBERAPA SINTAKS
// ---------------------------------------------------------------------
// Bentuk 1: kurung kurawal dengan return eksplisit, untuk logika majemuk.
const sapaFormal = (nama) => {
  return "Halo " + nama + ", selamat datang di Praktikum PAW.";
};
// Bentuk 2: implicit return, hanya berlaku untuk satu baris ekspresi.
const sapaSingkat = (nama) => "Halo " + nama + "!";
// Bentuk 3: objek literal wajib dibungkus kurung agar tidak ambigu dengan blok kode.
const ringkasCatatan = (catatan) => ({ judul: catatan.judul, kategori: catatan.kategori });
// Bentuk 4: satu parameter tanpa kurung, hanya boleh untuk satu nama.
const kalikan = angka => angka * 2;
// Bentuk 5: tanpa parameter, kurung kosong tetap ditulis.
const namaAplikasi = () => "HayuMencatat";
// Bentuk 6: tiga parameter, semua memakai kurung kurawal.
const hitungTotal = (a, b, c) => a + b + c;
const laporanArrow = `sapaFormal("Faiz")   : ${sapaFormal("Faiz")}
sapaSingkat("Faiz") : ${sapaSingkat("Faiz")}
ringkasCatatan      : ${aman(JSON.stringify(ringkasCatatan(daftarCatatan[0])))}
kalikan(21)         : ${kalikan(21)}
namaAplikasi()      : ${namaAplikasi()}
hitungTotal(8, 5, 7): ${hitungTotal(8, 5, 7)}`;
console.log("2.3 ->\n" + laporanArrow);
wadah.innerHTML += `
  <h3>LATIHAN 2.3 - Buat arrow function dengan berbagai sintaks</h3>
  <pre>${aman(laporanArrow)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 2.4 - GUNAKAN TEMPLATE LITERALS UNTUK MEMBUAT HTML STRING
// ---------------------------------------------------------------------
// Setiap elemen daftar dibangun sebagai string HTML dengan template literal.
const barisCatatan = daftarCatatan
  .map((catatan) => `  <li><strong>${catatan.judul}</strong> - kategori ${catatan.kategori} - prioritas ${catatan.prioritas}</li>`)
  .join("\n");
const markupCatatan = `<ul>\n${barisCatatan}\n</ul>`;
// Dipakai lagi untuk membuat string HTML kedua, yaitu jumlah catatan per kategori.
const hitunganKategori = {};
for (const c of daftarCatatan) hitunganKategori[c.kategori] = (hitunganKategori[c.kategori] || 0) + 1;
const barisRingkasan = Object.keys(hitunganKategori)
  .map((kategori) => `  <li>${kategori}: ${hitunganKategori[kategori]} catatan</li>`)
  .join("\n");
const markupRingkasan = `<ul>\n${barisRingkasan}\n  <li>total: ${daftarCatatan.length} catatan</li>\n</ul>`;
const laporanMarkup = `markup daftar :\n${aman(markupCatatan)}
markup ringkasan:\n${aman(markupRingkasan)}
panjang string : ${markupCatatan.length} karakter`;
console.log("2.4 ->\n" + laporanMarkup);
wadah.innerHTML += `
  <h3>LATIHAN 2.4 - Gunakan template literals untuk membuat HTML string</h3>
  <pre>${aman(laporanMarkup)}</pre>
`;
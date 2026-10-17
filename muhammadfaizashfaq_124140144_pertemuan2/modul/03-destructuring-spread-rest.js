/* =====================================================================
   MODUL 03 - DESTRUCTURING, SPREAD DAN REST
   Praktikum PAW - Pertemuan 2 - Muhammad Faiz Ashfaq (124140144)
   Topik: pembacaan objek bersarang dengan destructuring, rest parameter
          pada fungsi statistik, penggabungan objek dengan spread, serta
          destructuring di dalam loop for...of
   Script klasik (bukan module), dimuat lewat tag script src tanpa import.
   ===================================================================== */

// Wadah hasil yang sudah disediakan oleh halaman HTML modul.
const wadah = document.getElementById("result");

// Helper agar teks yang ditampilkan ke layar tidak ditafsirkan sebagai tag HTML.
const aman = (teks) => String(teks).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Data catatan yang dipakai pada latihan 3.4.
const daftarCatatan = [
  { judul: "Rangkuman Pertemuan 2", kategori: "kuliah", prioritas: "tinggi", selesai: false },
  { judul: "Tugas Praktikum PAW", kategori: "tugas", prioritas: "sedang", selesai: false },
  { judul: "Ide widget cuaca ITERA", kategori: "ide", prioritas: "rendah", selesai: true },
];

// ---------------------------------------------------------------------
// LATIHAN 3.1 - DESTRUCTURE OBJECT WITH NESTED PROPERTIES MINIMAL 3 LEVEL
// ---------------------------------------------------------------------
// Objek bersarang tiga tingkat: identitas, nama, lalu nama depan dan belakang.
const profilMahasiswa = {
  identitas: { nama: { depan: "Muhammad", belakang: "Ashfaq" }, nim: "124140144", kelas: "RA" },
  alamat: { kota: { nama: "Bandar Lampung", provinsi: "Lampung" }, kodePos: "35145" },
};
// Satu baris destructuring langsung membuka tiga tingkat objek.
const {
  identitas: { nama: { depan: namaDepan, belakang: namaBelakang }, nim, kelas },
  alamat: { kota: { nama: namaKota, provinsi: namaProvinsi }, kodePos },
} = profilMahasiswa;
const namaLengkap = namaDepan + " " + namaBelakang;
const laporanNested = `cara lama (3 baris)   : profilMahasiswa.identitas.nama.depan, .identitas.nama.belakang, .identitas.nim
baca property langsung: ${profilMahasiswa.identitas.nama.depan}, ${profilMahasiswa.identitas.nama.belakang}, ${profilMahasiswa.identitas.nim}
hasil satu baris      : ${namaLengkap}
nim dan kelas         : ${nim}, ${kelas}
kota                  : ${namaKota}, ${namaProvinsi}, kode pos ${kodePos}
jumlah baris kode     : 1 baris destructuring menggantikan 3 baris akses manual`;
console.log("3.1 ->\n" + laporanNested);
wadah.innerHTML += `
  <h3>LATIHAN 3.1 - Destructure object dengan nested properties minimal 3 level</h3>
  <pre>${aman(laporanNested)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 3.2 - BUAT FUNCTION YANG MENERIMA REST PARAMETERS DAN MENGEMBALIKAN STATISTIK (MIN, MAX, AVERAGE)
// ---------------------------------------------------------------------
// Tiga titik pada parameter membuat seluruh argumen dikumpulkan jadi satu array.
function statistikAngka(...angka) {
  if (angka.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }
  const total = angka.reduce((jumlah, nilai) => jumlah + nilai, 0);
  return {
    min: Math.min(...angka),
    max: Math.max(...angka),
    average: Number((total / angka.length).toFixed(2)),
  };
}
const nilaiPraktikum = [82, 91, 76, 88, 95];
const nilaiUjian = [70, 68, 74];
const statistikPraktikum = statistikAngka(...nilaiPraktikum);
const statistikUjian = statistikAngka(...nilaiUjian);
const totalNilai = nilaiPraktikum.reduce((jumlah, nilai) => jumlah + nilai, 0);
const laporanStatistik = `data nilai praktikum : ${aman(JSON.stringify(nilaiPraktikum))}
jumlah data          : ${nilaiPraktikum.length}, jumlah seluruh nilai: ${totalNilai}
hasil fungsi         : ${aman(JSON.stringify(statistikPraktikum))}
cek manual min       : ${Math.min(...nilaiPraktikum)}
cek manual max       : ${Math.max(...nilaiPraktikum)}
cek manual average   : ${(totalNilai / nilaiPraktikum.length).toFixed(2)}
data ujian           : ${aman(JSON.stringify(nilaiUjian))} -> ${aman(JSON.stringify(statistikUjian))}
tanpa argumen        : ${aman(JSON.stringify(statistikAngka()))}`;
console.log("3.2 ->\n" + laporanStatistik);
wadah.innerHTML += `
  <h3>LATIHAN 3.2 - Buat function yang menerima rest parameters dan mengembalikan statistik (min, max, average)</h3>
  <pre>${aman(laporanStatistik)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 3.3 - MERGE 3 OBJECTS DENGAN SPREAD OPERATOR DAN OVERRIDE BEBERAPA PROPERTIES
// ---------------------------------------------------------------------
// Tiga sumber pengaturan yang masing-masing punya beberapa properti yang sama.
const pengaturanDasar = { fontUkuran: 14, modeGelap: false, bahasa: "id", widgetCuaca: false };
const pengaturanPengguna = { fontUkuran: 18, widgetCuaca: true, bahasa: "id" };
const pengaturanSistem = { fontUkuran: 16, bahasa: "en", sinkronisasiOtomatis: true };
// Urutan spread menentukan pemenang saat nama properti bentrok.
const gabungan = { ...pengaturanDasar, ...pengaturanPengguna, ...pengaturanSistem };
const gabunganTerbalik = { ...pengaturanDasar, ...pengaturanSistem, ...pengaturanPengguna };
// Menyalin objek hasil gabung tidak mengubah objek gabung maupun sumbernya.
const salinanGabungan = { ...gabungan, widgetCuaca: false };
const propertiBentrok = ["fontUkuran", "widgetCuaca", "bahasa"];
const barisBentrok = propertiBentrok
  .map((nama) => `  <li>${nama}: dasar ${pengaturanDasar[nama]} -> pengguna ${pengaturanPengguna[nama] ?? "-"}` +
    ` -> sistem ${pengaturanSistem[nama] ?? "-"} -> akhir ${gabungan[nama]}</li>`)
  .join("\n");
const laporanMerge = `gabungan (urutan benar): ${aman(JSON.stringify(gabungan))}
gabungan terbalik     : ${aman(JSON.stringify(gabunganTerbalik))}
beda urutan penimpaan  : fontUkuran ${gabungan.fontUkuran} vs ${gabunganTerbalik.fontUkuran}, bahasa ${gabungan.bahasa} vs ${gabunganTerbalik.bahasa}
salinan baru          : ${aman(JSON.stringify(salinanGabungan))}
nilai sumber tetap    : widgetCuaca pada pengaturanDasar = ${pengaturanDasar.widgetCuaca}
properti yang di-override:
<ul>
${barisBentrok}
</ul>`;
console.log("3.3 ->\n" + laporanMerge);
wadah.innerHTML += `
  <h3>LATIHAN 3.3 - Merge 3 objects dengan spread operator dan override beberapa properties</h3>
  <pre>${aman(laporanMerge)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 3.4 - GUNAKAN DESTRUCTURING DALAM LOOP FOR...OF
// ---------------------------------------------------------------------
// Destructuring ditulis di dalam kurung siku for...of agar tiap iterasi punya variabel.
const barisIterasi = [];
let nomor = 1;
let jumlahSelesai = 0;
for (const { judul, kategori, prioritas, selesai } of daftarCatatan) {
  barisIterasi.push(`${nomor}. ${judul} | kategori ${kategori} | prioritas ${prioritas} | selesai ${selesai}`);
  if (selesai) jumlahSelesai += 1;
  nomor += 1;
}
const laporanLoop = `jumlah iterasi    : ${daftarCatatan.length}
ringkasan tiap iterasi:
${barisIterasi.join("\n")}
catatan selesai     : ${jumlahSelesai} dari ${daftarCatatan.length}
nomor iterasi terakhir: ${nomor - 1}`;
console.log("3.4 ->\n" + laporanLoop);
wadah.innerHTML += `
  <h3>LATIHAN 3.4 - Gunakan destructuring dalam loop for...of</h3>
  <pre>${aman(laporanLoop)}</pre>
`;
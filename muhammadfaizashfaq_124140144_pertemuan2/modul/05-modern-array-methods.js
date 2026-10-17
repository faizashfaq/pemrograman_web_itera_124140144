/* =====================================================================
   MODUL 05 - MODERN ARRAY METHODS
   Praktikum PAW - Pertemuan 2 - Muhammad Faiz Ashfaq (124140144)
   Topik: reduce, group by, rata-rata data objek, flat, flatMap,
          serta rangkaian filter, map, dan reduce
   ===================================================================== */
const wadah = document.getElementById("result");
const aman = (teks) =>
  String(teks).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Data catatan HayuMencatat yang dipakai pada seluruh latihan di modul ini.
const dataCatatan = [
  { id: 1, judul: "Tugas Praktikum PAW", kategori: "tugas", nilai: 82, selesai: false, aktif: true },
  { id: 2, judul: "Slide Pertemuan 2 ES6", kategori: "kuliah", nilai: 90, selesai: true, aktif: true },
  { id: 3, judul: "Ide widget cuaca ITERA", kategori: "ide", nilai: 74, selesai: false, aktif: true },
  { id: 4, judul: "Bayar spp semester 5", kategori: "pribadi", nilai: 88, selesai: false, aktif: false },
  { id: 5, judul: "Rangkuman Array Methods", kategori: "kuliah", nilai: 95, selesai: true, aktif: true },
  { id: 6, judul: "Ide dark mode HayuMencatat", kategori: "ide", nilai: 68, selesai: false, aktif: true },
  { id: 7, judul: "Jadwal Ujian Akhir", kategori: "tugas", nilai: 79, selesai: false, aktif: true },
];

// ---------------------------------------------------------------------
// LATIHAN 5.1 - IMPLEMENTASI FUNSI GROUPBY MENGGUNAKAN REDUCE
// ---------------------------------------------------------------------
function groupBy(array, kunci) {
  return array.reduce((kelompok, item) => {
    // Kunci boleh berupa nama properti atau fungsi yang mengembalikan kunci.
    const namaKunci = typeof kunci === "function" ? kunci(item) : item[kunci];
    if (kelompok[namaKunci] === undefined) kelompok[namaKunci] = [];
    kelompok[namaKunci].push(item.judul);
    return kelompok;
  }, {});
}

const kelompokKategori = groupBy(dataCatatan, "kategori");
const kelompokStatus = groupBy(dataCatatan, (catatan) => (catatan.selesai ? "selesai" : "belum"));
const isiPerKelompok = Object.entries(kelompokKategori)
  .map(([nama, isi]) => `  ${nama} (${isi.length} data) : ${JSON.stringify(isi)}`)
  .join("\n");

const baris51 = `jumlah data masukan : ${dataCatatan.length}
kunci hasil groupBy kategori : ${Object.keys(kelompokKategori).join(", ")}
isi tiap kelompok :
${isiPerKelompok}
total isi semua kelompok : ${Object.values(kelompokKategori).reduce((jumlah, isi) => jumlah + isi.length, 0)} -> sama dengan ${dataCatatan.length}
groupBy memakai fungsi kunci : ${JSON.stringify(Object.keys(kelompokStatus))}`;
console.log("5.1 ->", baris51);
wadah.innerHTML += `
  <h3>LATIHAN 5.1 - Implementasi fungsi groupBy menggunakan reduce()</h3>
  <pre>${aman(baris51)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 5.2 - BUAT FUNGSI UNTUK MENGHITUNG RATA-RATA DARI ARRAY OF OBJECTS
// ---------------------------------------------------------------------
function rataRata(arrayOfObjects, properti) {
  const total = arrayOfObjects.reduce((jumlah, item) => jumlah + item[properti], 0);
  return arrayOfObjects.length > 0 ? total / arrayOfObjects.length : 0;
}

const daftarNilai = dataCatatan.map((catatan) => catatan.nilai);
const totalNilai = dataCatatan.reduce((jumlah, catatan) => jumlah + catatan.nilai, 0);
const rataSemua = rataRata(dataCatatan, "nilai");
const rataAktif = rataRata(dataCatatan.filter((catatan) => catatan.aktif), "nilai");
const cekManual = (82 + 90 + 74 + 88 + 95 + 68 + 79) / 7;

const baris52 = `daftar nilai tiap catatan : ${daftarNilai.join(" + ")}
jumlah nilai hasil reduce  : ${totalNilai}
jumlah data               : ${dataCatatan.length}
perhitungan               : ${totalNilai} / ${dataCatatan.length} = ${rataSemua}
dibulatkan dua angka      : ${rataSemua.toFixed(2)}
rata-rata catatan aktif saja : ${rataAktif.toFixed(2)}
cek hitungan manual        : (82 + 90 + 74 + 88 + 95 + 68 + 79) / 7 = ${cekManual.toFixed(2)} -> sama dengan hasil fungsi`;
console.log("5.2 ->", baris52);
wadah.innerHTML += `
  <h3>LATIHAN 5.2 - Buat fungsi untuk menghitung rata-rata dari array of objects</h3>
  <pre>${aman(baris52)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 5.3 - TRANSFORM STRUKTUR ARRAY BERSARANG MENJADI STRUKTUR FLAT
// ---------------------------------------------------------------------
// Menghitung banyak elemen paling dalam, dipakai sebagai pembanding.
const hitungElemen = (array) =>
  array.reduce((jumlah, isi) => jumlah + (Array.isArray(isi) ? hitungElemen(isi) : 1), 0);

const arrayBersarang = [[1, 2, 3], [4, [5, 6]], [7, [8, [9, 10]]]];
const rataSatuTingkat = arrayBersarang.flat(1);
const rataDuaTingkat = arrayBersarang.flat(2);
const rataSepenuhnya = arrayBersarang.flat(Infinity);
const dariFlatMap = [[1, 2], [3, 4], [5, 6]].flatMap((isi) => isi);

const baris53 = `struktur sebelum, panjang ${arrayBersarang.length} : ${JSON.stringify(arrayBersarang)}
jumlah elemen paling dalam : ${hitungElemen(arrayBersarang)}
flat(1), panjang ${rataSatuTingkat.length} : ${JSON.stringify(rataSatuTingkat)}
flat(2), panjang ${rataDuaTingkat.length} : ${JSON.stringify(rataDuaTingkat)}
flat(Infinity), panjang ${rataSepenuhnya.length} : ${JSON.stringify(rataSepenuhnya)}
flatMap memecah tiap isi, panjang ${dariFlatMap.length} : ${JSON.stringify(dariFlatMap)}
cek pertambahan panjang : ${rataSatuTingkat.length} + ${rataDuaTingkat.length - rataSatuTingkat.length} + ${rataSepenuhnya.length - rataDuaTingkat.length} = ${rataSepenuhnya.length} -> sama dengan jumlah elemen paling dalam`;
console.log("5.3 ->", baris53);
wadah.innerHTML += `
  <h3>LATIHAN 5.3 - Transform struktur array bersarang menjadi struktur flat</h3>
  <pre>${aman(baris53)}</pre>
`;

// ---------------------------------------------------------------------
// LATIHAN 5.4 - GABUNGKAN FILTER, MAP, DAN REDUCE UNTUK ANALISIS DATA KOMPLEKS
// ---------------------------------------------------------------------
const langkahFilter = dataCatatan.filter((catatan) => catatan.aktif && !catatan.selesai);
const langkahMap = langkahFilter.map((catatan) => catatan.judul);
const langkahReduce = langkahMap.reduce((total, judul) => total + judul.length, 0);
const rataPanjang = langkahReduce / langkahMap.length;
const dirangkai = dataCatatan
  .filter((catatan) => catatan.aktif && !catatan.selesai)
  .map((catatan) => catatan.judul)
  .reduce((total, judul) => total + judul.length, 0);

const baris54 = `jumlah data awal : ${dataCatatan.length}
langkah 1 filter, catatan aktif dan belum selesai : ${langkahFilter.length} data
  ${JSON.stringify(langkahFilter.map((catatan) => `${catatan.judul} (nilai ${catatan.nilai})`))}
langkah 2 map, mengambil judul saja : ${langkahMap.length} judul
  ${JSON.stringify(langkahMap)}
langkah 3 reduce, menjumlah panjang karakter : ${langkahReduce} karakter
rincian panjang tiap judul : ${langkahMap.map((judul) => `${judul} = ${judul.length}`).join(" | ")}
rata-rata panjang judul : ${langkahReduce} / ${langkahMap.length} = ${rataPanjang.toFixed(2)}
hasil satu rangkaian langsung : ${dirangkai} karakter -> sama dengan langkah 3`;
console.log("5.4 ->", baris54);
wadah.innerHTML += `
  <h3>LATIHAN 5.4 - Gabungkan filter, map, dan reduce untuk analisis data kompleks</h3>
  <pre>${aman(baris54)}</pre>
`;
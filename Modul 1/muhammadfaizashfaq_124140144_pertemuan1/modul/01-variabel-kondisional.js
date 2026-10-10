/* =====================================================================
   LATIHAN 1 - VARIABEL & KONDISIONAL
   Praktikum PAW - Pertemuan 1 - Muhammad Faiz Ashfaq (124140144)
   Topik: var/let/const, template literals, if-else, ternary, switch-case
   ===================================================================== */

// ---------------------------------------------------------------------
// LATIHAN 1.1 - Data diri memakai const dan let
// ---------------------------------------------------------------------
const namaLengkap = "Muhammad Faiz Ashfaq";
let umur = 20;
let kotaAsal = "Bandar Lampung";
const NIM = "124140144";

console.log("=== 1.1 Data Diri ===");
console.log("Nama  : " + namaLengkap);
console.log("Umur  : " + umur);
console.log("Kota  : " + kotaAsal);

document.getElementById("result").innerHTML += `
  <h3>1.1 Data Diri</h3>
  <ul>
    <li>Nama Lengkap : <strong>${namaLengkap}</strong></li>
    <li>Umur          : <strong>${umur}</strong> tahun</li>
    <li>Kota Asal     : <strong>${kotaAsal}</strong></li>
    <li>NIM           : <strong>${NIM}</strong></li>
  </ul>
  <hr>
`;

// ---------------------------------------------------------------------
// LATIHAN 1.2 - Program pengecekan kelulusan (nilai >= 70)
// ---------------------------------------------------------------------
function cekKelulusan(nilai) {
  if (nilai >= 70) {
    return "LULUS";
  } else {
    return "TIDAK LULUS";
  }
}

console.log("=== 1.2 Cek Kelulusan ===");
const daftarNilai = [95, 70, 69, 55, 88];
daftarNilai.forEach((nilai) => {
  console.log(`Nilai ${nilai} -> ${cekKelulusan(nilai)}`);
});

document.getElementById("result").innerHTML += `
  <h3>1.2 Pengecekan Kelulusan (syarat nilai &ge; 70)</h3>
  <table>
    <thead>
      <tr><th>No</th><th>Nilai</th><th>Hasil</th></tr>
    </thead>
    <tbody>
      ${daftarNilai
        .map(
          (nilai, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="angka">${nilai}</td>
          <td><strong>${cekKelulusan(nilai)}</strong></td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
  <hr>
`;

// ---------------------------------------------------------------------
// LATIHAN 1.3 - Kategori umur
// anak: <12 | remaja: 12-17 | dewasa: 18-59 | lansia: >=60
// ---------------------------------------------------------------------
function kategoriUmur(umur) {
  if (umur < 12) return "Anak";
  else if (umur < 18) return "Remaja";
  else if (umur < 60) return "Dewasa";
  else return "Lansia";
}

console.log("=== 1.3 Kategori Umur ===");
const daftarUmur = [7, 12, 16, 18, 45, 59, 60, 75];
daftarUmur.forEach((u) => console.log(`Umur ${u} -> ${kategoriUmur(u)}`));

document.getElementById("result").innerHTML += `
  <h3>1.3 Kategori Umur</h3>
  <p><strong>Kategori:</strong> anak (&lt;12), remaja (12&ndash;17), dewasa (18&ndash;59), lansia (&ge;60)</p>
  <ul>
    ${daftarUmur
      .map((u) => `<li>Umur ${u} &rarr; <strong>${kategoriUmur(u)}</strong></li>`)
      .join("")}
  </ul>
  <hr>
`;

// ---------------------------------------------------------------------
// LATIHAN 1.4 - Switch-case konversi angka hari (1-7) ke nama hari
//               dalam bahasa Inggris
// ---------------------------------------------------------------------
function konversiHari(angka) {
  let namaHari = "";
  switch (angka) {
    case 1:
      namaHari = "Monday";
      break;
    case 2:
      namaHari = "Tuesday";
      break;
    case 3:
      namaHari = "Wednesday";
      break;
    case 4:
      namaHari = "Thursday";
      break;
    case 5:
      namaHari = "Friday";
      break;
    case 6:
      namaHari = "Saturday";
      break;
    case 7:
      namaHari = "Sunday";
      break;
    default:
      namaHari = "Invalid day number (harus 1-7)";
  }
  return namaHari;
}

console.log("=== 1.4 Konversi Hari ===");
for (let angka = 1; angka <= 7; angka++) {
  console.log(`${angka} -> ${konversiHari(angka)}`);
}
console.log(`${9} -> ${konversiHari(9)}`);

document.getElementById("result").innerHTML += `
  <h3>1.4 Konversi Hari (Switch Case)</h3>
  <ul>
    ${[1, 2, 3, 4, 5, 6, 7]
      .map((a) => `<li>Angka <strong>${a}</strong> &rarr; <strong>${konversiHari(a)}</strong></li>`)
      .join("")}
    <li>Angka <strong>9</strong> &rarr; <strong>${konversiHari(9)}</strong> (default)</li>
  </ul>
  <hr>
`;

// ---------------------------------------------------------------------
// LATIHAN 1.5 - Kalkulator sederhana grade nilai dengan ternary operator
// ---------------------------------------------------------------------
function gradeNilai(nilai) {
  return nilai >= 90
    ? "A"
    : nilai >= 80
      ? "B"
      : nilai >= 70
        ? "C"
        : nilai >= 60
          ? "D"
          : "E";
}

console.log("=== 1.5 Grade Nilai (Ternary) ===");
const nilaiUjian = [95, 85, 75, 65, 45];
nilaiUjian.forEach((n) => console.log(`Nilai ${n} -> Grade ${gradeNilai(n)}`));

document.getElementById("result").innerHTML += `
  <h3>1.5 Kalkulator Grade Nilai (Ternary Operator)</h3>
  <table>
    <thead>
      <tr><th>No</th><th>Nilai</th><th>Grade</th></tr>
    </thead>
    <tbody>
      ${nilaiUjian
        .map(
          (n, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="angka">${n}</td>
          <td><strong>${gradeNilai(n)}</strong></td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;
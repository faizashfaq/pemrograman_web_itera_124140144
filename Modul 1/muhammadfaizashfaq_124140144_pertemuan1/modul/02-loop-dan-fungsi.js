/* =====================================================================
   LATIHAN 2 - LOOP & FUNGSI
   Praktikum PAW - Pertemuan 1 - Muhammad Faiz Ashfaq (124140144)
   Topik: for, while, function, event handler

   Daftar latihan (menurut ketentuan modul):
   2.1 Loop cetak tabel perkalian 1-10 untuk angka pilihan sendiri
   2.2 Fungsi menghitung faktorial dari sebuah angka
   2.3 Fungsi memeriksa apakah sebuah angka adalah bilangan prima
   2.4 Kalkulator BMI (Body Mass Index) dengan fungsi dan event handler
   2.5 Program FizzBuzz untuk angka 1-100
   ===================================================================== */

const hasil = document.getElementById("result");

/* =====================================================================
   2.1 - LOOP CETAK TABEL PERKALIAN 1-10 UNTUK ANGKA PILIHAN KITA
   ===================================================================== */

/**
 * Membangun baris tabel perkalian untuk sebuah angka.
 * @param {number} angka - angka pengali
 * @returns {string} baris HTML tabel 1-10
 */
function cetakTabelPerkalian(angka) {
  let baris = "";
  for (let i = 1; i <= 10; i++) {
    baris += `
      <tr>
        <td class="angka">${angka} &times; ${i}</td>
        <td class="angka"><strong>${angka * i}</strong></td>
      </tr>`;
  }
  return baris;
}

/** Membaca angka dari input; default 7 bila kosong atau di luar rentang 1-20. */
function bacaAngkaPerkalian() {
  const input = document.getElementById("inputAngka");
  let angka = parseInt(input.value, 10);

  if (!Number.isFinite(angka) || angka < 1 || angka > 20) {
    angka = 7;
    input.value = angka;
  }
  return angka;
}

/** Menggambar tabel perkalian ke dalam elemen target. */
function tampilkanTabelPerkalian(angka) {
  document.getElementById("tabelPerkalian").innerHTML = `
    <table>
      <thead>
        <tr><th>Perhitungan</th><th>Hasil</th></tr>
      </thead>
      <tbody>${cetakTabelPerkalian(angka)}</tbody>
    </table>`;
}

console.log("=== 2.1 Tabel Perkalian ===");

hasil.innerHTML += `
  <h3>2.1 Tabel Perkalian 1&ndash;10</h3>
  <p><em>Ketik angka pada kolom "Angka pilihan Anda" lalu tekan "Cetak Tabel".</em></p>
  <div id="tabelPerkalian"></div>
  <hr>`;

document.getElementById("btnPerkalian").addEventListener("click", () => {
  const angka = bacaAngkaPerkalian();
  console.log("Mencetak tabel perkalian untuk angka " + angka);
  tampilkanTabelPerkalian(angka);
});

// cetak tabel default saat halaman dibuka
tampilkanTabelPerkalian(bacaAngkaPerkalian());

/* =====================================================================
   2.2 - FUNGSI MENGHITUNG FAKTORIAL DARI SEBUAH ANGKA
   ===================================================================== */

/**
 * Menghitung faktorial (n!) dengan loop.
 * @param {number} angka - bilangan bulat non-negatif
 * @returns {number|string} hasil faktorial, atau pesan bila input tidak valid
 */
function faktorial(angka) {
  if (!Number.isInteger(angka)) {
    return "Input harus bilangan bulat";
  }
  if (angka < 0) {
    return "Faktorial tidak dapat dihitung untuk angka negatif";
  }

  let hasilKali = 1;
  for (let i = 2; i <= angka; i++) {
    hasilKali *= i;
  }
  return hasilKali;
}

console.log("=== 2.2 Faktorial ===");
for (let n = 1; n <= 10; n++) {
  console.log(n + "! = " + faktorial(n));
}

hasil.innerHTML += `
  <h3>2.2 Fungsi Faktorial</h3>
  <ul>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      .map((n) => `<li>${n}! = <strong>${faktorial(n)}</strong></li>`)
      .join("")}
  </ul>
  <p><em>Penanganan input tidak valid:</em></p>
  <ul>
    <li>faktorial(-3) = <strong>${faktorial(-3)}</strong></li>
    <li>faktorial(2.5) = <strong>${faktorial(2.5)}</strong></li>
  </ul>
  <hr>`;

/* =====================================================================
   2.3 - FUNGSI MEMERIKSA BILANGAN PRIMA
   ===================================================================== */

/**
 * Memeriksa apakah sebuah angka merupakan bilangan prima.
 * Hanya perlu menguji pembagi sampai akar kuadrat dari angka.
 * @param {number} angka
 * @returns {boolean} true bila prima
 */
function bilanganPrima(angka) {
  if (!Number.isInteger(angka) || angka < 2) return false;
  if (angka === 2) return true;
  if (angka % 2 === 0) return false;

  for (let i = 3; i * i <= angka; i += 2) {
    if (angka % i === 0) return false;
  }
  return true;
}

console.log("=== 2.3 Bilangan Prima ===");
const daftarPrima = [];
for (let n = 2; n <= 30; n++) {
  if (bilanganPrima(n)) {
    daftarPrima.push(n);
  }
}
console.log("Bilangan prima 2-30: " + daftarPrima.join(", "));

hasil.innerHTML += `
  <h3>2.3 Fungsi Cek Bilangan Prima</h3>
  <p><strong>Bilangan prima 2&ndash;30:</strong> ${daftarPrima.join(", ")}</p>
  <table>
    <thead><tr><th>Angka</th><th>Prima?</th></tr></thead>
    <tbody>
      ${[1, 2, 3, 4, 9, 11, 15, 17, 25, 29]
        .map(
          (n) => `
        <tr>
          <td class="angka">${n}</td>
          <td><strong>${bilanganPrima(n) ? "YA" : "TIDAK"}</strong></td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
  <hr>`;

/* =====================================================================
   2.4 - KALKULATOR BMI (BODY MASS INDEX) DENGAN FUNGSI DAN EVENT HANDLER
   Rumus: BMI = berat (kg) / (tinggi dalam meter)^2
   ===================================================================== */

/**
 * Menghitung nilai BMI.
 * @param {number} berat - berat badan dalam kilogram
 * @param {number} tinggiCm - tinggi badan dalam sentimeter
 * @returns {number|string} nilai BMI, atau pesan bila input tidak valid
 */
function hitungBMI(berat, tinggiCm) {
  if (!Number.isFinite(berat) || !Number.isFinite(tinggiCm)) {
    return "Berat dan tinggi harus berupa angka";
  }
  if (berat <= 0) {
    return "Berat badan harus lebih besar dari 0";
  }
  if (tinggiCm <= 0) {
    return "Tinggi badan harus lebih besar dari 0";
  }

  const tinggiMeter = tinggiCm / 100;
  return berat / (tinggiMeter * tinggiMeter);
}

/**
 * Menentukan kategori BMI beserta kelas warna untuk tampilan.
 * @param {number} bmi
 * @returns {{kategori: string, kelas: string}}
 */
function kategoriBMI(bmi) {
  if (bmi < 18.5) {
    return { kategori: "Kekurangan berat badan", kelas: "bmi-kurus" };
  } else if (bmi < 25) {
    return { kategori: "Berat badan normal", kelas: "bmi-normal" };
  } else if (bmi < 30) {
    return { kategori: "Kelebihan berat badan (obesitas ringan)", kelas: "bmi-lebih" };
  }
  return { kategori: "Obesitas", kelas: "bmi-obesitas" };
}

console.log("=== 2.4 Kalkulator BMI ===");
[[70, 170], [55, 160], [85, 175], [95, 165]].forEach(([b, t]) => {
  const bmi = hitungBMI(b, t);
  console.log(b + "kg / " + t + "cm -> BMI " + bmi.toFixed(1) + " (" + kategoriBMI(bmi).kategori + ")");
});

// Event handler: form kalkulator BMI
const formBmi = document.getElementById("formBmi");
const pesanBmi = document.getElementById("pesanBmi");

// tempat hasil BMI ditampilkan (bagian 2.4, tetap di dalam #result agar berurutan)
hasil.innerHTML += `
  <h3>2.4 Kalkulator BMI (Body Mass Index)</h3>
  <p>
    Rumus: <strong>BMI = Berat (kg) &divide; (Tinggi dalam meter) &sup2;</strong><br>
    Kategori: kurus &lt; 18,5 &middot; normal 18,5&ndash;24,9 &middot;
    kelebihan 25&ndash;29,9 &middot; obesitas &ge; 30
  </p>
  <div id="outputBmi"></div>
  <hr>`;

const outputBmi = () => document.getElementById("outputBmi");

formBmi.addEventListener("submit", function (event) {
  event.preventDefault();

  const berat = parseFloat(document.getElementById("inputBerat").value);
  const tinggiCm = parseFloat(document.getElementById("inputTinggi").value);
  const bmi = hitungBMI(berat, tinggiCm);

  // validasi input
  if (typeof bmi === "string") {
    pesanBmi.textContent = bmi;
    outputBmi().innerHTML = "";
    return;
  }

  pesanBmi.textContent = "";

  const info = kategoriBMI(bmi);
  outputBmi().innerHTML = `
    <div class="bmi-kartu ${info.kelas}">
      <p><bmi-nilai>${bmi.toFixed(1)}</bmi-nilai> &mdash; BMI</p>
      <p class="bmi-kategori">${info.kategori}</p>
      <p style="font-size:13px">Berat ${berat} kg &middot; Tinggi ${tinggiCm} cm</p>
    </div>`;
});

// isi contoh awal supaya tidak terlihat kosong
document.getElementById("inputBerat").value = 70;
document.getElementById("inputTinggi").value = 170;
formBmi.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));

/* =====================================================================
   2.5 - PROGRAM FIZZBUZZ UNTUK ANGKA 1-100
   Kelipatan 3 -> "Fizz" | Kelipatan 5 -> "Buzz" | Kelipatan keduanya -> "FizzBuzz"
   ===================================================================== */

/**
 * Mengembalikan teks untuk satu angka pada program FizzBuzz.
 * @param {number} angka
 * @returns {string} "FizzBuzz" | "Fizz" | "Buzz" | angka (string)
 */
function fizzBuzz(angka) {
  if (angka % 15 === 0) return "FizzBuzz";
  if (angka % 3 === 0) return "Fizz";
  if (angka % 5 === 0) return "Buzz";
  return String(angka);
}

/** Menentukan kelas warna untuk tampilan FizzBuzz. */
function kelasFizzBuzz(teks) {
  if (teks === "FizzBuzz") return "fb-fizzbuzz";
  if (teks === "Fizz") return "fb-fizz";
  if (teks === "Buzz") return "fb-buzz";
  return "fb-angka";
}

console.log("=== 2.5 FizzBuzz (1-100) ===");
const daftarFizzBuzz = [];
for (let i = 1; i <= 100; i++) {
  daftarFizzBuzz.push(fizzBuzz(i));
}
console.log(daftarFizzBuzz.join(" "));

hasil.innerHTML += `
  <h3>2.5 Program FizzBuzz (1&ndash;100)</h3>
  <p>
    Kelipatan 3 &rarr; <strong>Fizz</strong> &middot;
    Kelipatan 5 &rarr; <strong>Buzz</strong> &middot;
    Kelipatan keduanya (15) &rarr; <strong>FizzBuzz</strong> &middot;
    Selain itu &rarr; angka itu sendiri.
  </p>
  <div class="fizzbuzz">
    ${daftarFizzBuzz
      .map((teks) => `<span class="${kelasFizzBuzz(teks)}">${teks}</span>`)
      .join("")}
  </div>
  <p style="margin-top:12px"><em>Jumlah "FizzBuzz" (kelipatan 15) dari 1-100: <strong>6</strong></em></p>`;
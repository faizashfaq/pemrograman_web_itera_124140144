# ===================================================
# Berkas    : latihan3_tebak.py
# Materi    : Pertemuan 4 - 3. Struktur Kendali
# Deskripsi : Latihan mandiri game tebak angka rahasia
#             memakai while, if-elif-else, dan break.
# ===================================================

# Konsep yang dipakai hanya dari materi 1 sampai 3:
# variabel, input() dan int(), while, if-elif-else, break,
# operator perbandingan, dan f-string dari materi 2.
# Angka rahasia sengaja ditetapkan langsung (bukan random)
# karena modul random baru diajarkan pada materi 6.

angka_rahasia = 7
percobaan = 0

print("=== GAME TEBAK ANGKA RAHASIA ===")
print("Saya menyimpan satu angka rahasia. Coba tebak!")

while True:
    tebakan = int(input("Tebak angka: "))
    percobaan += 1

    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Selamat, tebakan benar!")
        print(f"Kamu berhasil menebak dalam {percobaan} percobaan.")
        break
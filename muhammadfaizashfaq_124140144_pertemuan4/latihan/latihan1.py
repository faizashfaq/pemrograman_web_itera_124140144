# ===================================================
# Berkas    : latihan1.py
# Materi    : Pertemuan 4 - 1. Pengenalan & Eksekusi Python
# Deskripsi : Latihan mandiri mencetak profil diri memakai
#             print(), parameter sep, dan escape character.
# ===================================================

# Konsep yang dipakai hanya dari materi 1:
# komentar, variabel sederhana, print(), sep, dan escape character.
# f-string, method string, dan fungsi belum dipakai karena baru
# diajarkan pada materi berikutnya.

nama = "Muhammad Faiz Ashfaq"
nim = "124140144"
angkatan = 2024
minat = "Web Development & Kecerdasan Buatan"

# 1. Mencetak profil dengan beberapa argumen dan pemisah " | ".
print("=== PROFIL PRAKTIKAN ===")
print("Nama", nama, sep=" | ")
print("NIM", nim, sep=" | ")
print("Angkatan", angkatan, sep=" | ")
print("Minat", minat, sep=" | ")

# 2. Kartu identitas berbingkai karakter pagar (#).
#    Nilai ditulis langsung di dalam kartu agar perataannya rapi
#    tanpa f-string atau method string (belum diajarkan di materi 1).
print("\n=== KARTU IDENTITAS ===")
print("###########################################################")
print("#                   KARTU PRAKTIKAN PAW                   #")
print("###########################################################")
print("# Nama Lengkap      : Muhammad Faiz Ashfaq                #")
print("# NIM               : 124140144                           #")
print("# Angkatan          : 2024                                #")
print("# Minat Penelitian  : Web Development & Kecerdasan Buatan #")
print("# Mata Kuliah       : Praktikum Pengembangan Aplikasi Web #")
print("###########################################################")

# 3. Eksperimen escape character: \t (tab), \n (baris baru), \\ (backslash).
print("\n=== EKSPERIMEN ESCAPE CHARACTER ===")
print("Nama\t:", nama)
print("NIM\t:", nim)
print("Baris pertama\nBaris kedua")
print("Tanda kutip tunggal: ' dan garis miring: \\")
# ===================================================
# Berkas    : main.py
# Materi    : Pertemuan 4 - 6. Modul & Package Python
# Deskripsi : Program utama untuk menguji modul password_gen.
# ===================================================

# Konsep yang dipakai hanya dari materi 1 sampai 6:
# dua cara import (import modul dan from ... import ...),
# lalu memanggil fungsi dari modul tersebut.

# Cara 1: mengimpor seluruh modul.
import password_gen

# Cara 2: mengimpor fungsi tertentu langsung ke namespace.
from password_gen import buat_password_acak

print("=== PENGUJIAN MODUL password_gen ===")
print("Password 8 karakter  :", password_gen.buat_password_acak())
print("Password 12 karakter :", buat_password_acak(12))
print("Password 16 karakter :", buat_password_acak(16))
print("Password 20 karakter :", password_gen.buat_password_acak(20))
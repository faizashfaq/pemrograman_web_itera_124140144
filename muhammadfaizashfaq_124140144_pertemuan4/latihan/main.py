import password_gen

from password_gen import buat_password_acak

print("=== PENGUJIAN MODUL password_gen ===")
print("Password 8 karakter  :", password_gen.buat_password_acak())
print("Password 12 karakter :", buat_password_acak(12))
print("Password 16 karakter :", buat_password_acak(16))
print("Password 20 karakter :", password_gen.buat_password_acak(20))
import random
import string

PANJANG_BAWAAN = 8
KARAKTER_HURUF = string.ascii_letters
KARAKTER_ANGKA = string.digits
KARAKTER_SIMBOL = "!@#$%^&*"


def buat_password_acak(panjang: int = PANJANG_BAWAAN) -> str:
    semua_karakter = KARAKTER_HURUF + KARAKTER_ANGKA + KARAKTER_SIMBOL
    daftar_karakter = []

    daftar_karakter.append(random.choice(KARAKTER_HURUF))
    daftar_karakter.append(random.choice(KARAKTER_ANGKA))
    daftar_karakter.append(random.choice(KARAKTER_SIMBOL))

    while len(daftar_karakter) < panjang:
        daftar_karakter.append(random.choice(semua_karakter))

    random.shuffle(daftar_karakter)

    password = ""
    for karakter in daftar_karakter:
        password += karakter

    return password


if __name__ == "__main__":
    print("[TEST MODUL] password_gen")
    print("Panjang 8  :", buat_password_acak())
    print("Panjang 16 :", buat_password_acak(16))
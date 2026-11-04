# ===================================================
# Berkas    : password_gen.py
# Materi    : Pertemuan 4 - 6. Modul & Package Python
# Deskripsi : Modul kustom pembangkit password acak.
# ===================================================

# Konsep yang dipakai hanya dari materi 1 sampai 6:
# modul random (choice, shuffle), modul string (ascii_letters,
# digits), list dan .append() dari materi 5, while dari materi 3,
# fungsi dan default parameter dari materi 4, serta
# if __name__ == "__main__" dari materi 6.

import random
import string

PANJANG_BAWAAN = 8
KARAKTER_HURUF = string.ascii_letters
KARAKTER_ANGKA = string.digits
KARAKTER_SIMBOL = "!@#$%^&*"


def buat_password_acak(panjang: int = PANJANG_BAWAAN) -> str:
    """Membuat password acak sepanjang `panjang` karakter.

    Password dijamin mengandung minimal satu huruf, satu angka,
    dan satu simbol. Nilai `panjang` minimal 3.
    """
    semua_karakter = KARAKTER_HURUF + KARAKTER_ANGKA + KARAKTER_SIMBOL
    daftar_karakter = []

    # Sisipkan satu karakter wajib dari tiap jenis.
    daftar_karakter.append(random.choice(KARAKTER_HURUF))
    daftar_karakter.append(random.choice(KARAKTER_ANGKA))
    daftar_karakter.append(random.choice(KARAKTER_SIMBOL))

    # Lengkapi sisanya dengan karakter acak dari semua jenis.
    while len(daftar_karakter) < panjang:
        daftar_karakter.append(random.choice(semua_karakter))

    # Acak urutan agar karakter wajib tidak selalu di depan.
    random.shuffle(daftar_karakter)

    # Susun list menjadi satu string.
    password = ""
    for karakter in daftar_karakter:
        password += karakter

    return password


if __name__ == "__main__":
    print("[TEST MODUL] password_gen")
    print("Panjang 8  :", buat_password_acak())
    print("Panjang 16 :", buat_password_acak(16))
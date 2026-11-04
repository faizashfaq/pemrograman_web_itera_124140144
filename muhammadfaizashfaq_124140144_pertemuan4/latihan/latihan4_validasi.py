# ===================================================
# Berkas    : latihan4_validasi.py
# Materi    : Pertemuan 4 - 4. Modularitas Fungsi
# Deskripsi : Latihan mandiri fungsi validator password.
# ===================================================

# Konsep yang dipakai hanya dari materi 1 sampai 4:
# fungsi (def, parameter, return, docstring, type hint),
# if, for, operator in, len(), dan f-string dari materi 2.


def validasi_password(password: str) -> bool:
    """Mengembalikan True jika password valid, False jika tidak.

    Password valid apabila panjangnya minimal 8 karakter dan
    mengandung setidaknya satu karakter angka (0-9).
    """
    if len(password) < 8:
        return False

    for karakter in password:
        if karakter in "0123456789":
            return True

    return False


print("=== UJI FUNGSI validasi_password() ===")
print()
print("--- Contoh password VALID ---")
print(f"rahasia1  -> {validasi_password('rahasia1')}")
print(f"abc12345  -> {validasi_password('abc12345')}")
print(f"12345678  -> {validasi_password('12345678')}")
print()
print("--- Contoh password TIDAK VALID ---")
print(f"password  -> {validasi_password('password')}")
print(f"abc12     -> {validasi_password('abc12')}")
print(f"(kosong)  -> {validasi_password('')}")
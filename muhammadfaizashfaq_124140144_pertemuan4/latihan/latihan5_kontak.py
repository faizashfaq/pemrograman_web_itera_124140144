kontak = {
    "Budi Santoso": "0812-3456-7890",
    "Siti Aminah": "0813-9876-5432",
    "Andi Pratama": "0857-1122-3344",
}


def tambah_kontak(daftar: dict, nama: str, nomor: str) -> None:
    if not nama or not nomor:
        print("Nama dan nomor telepon tidak boleh kosong.")
        return

    daftar[nama] = nomor
    print(f"Kontak '{nama}' berhasil disimpan.")


def cari_kontak(daftar: dict, nama: str) -> None:
    nomor = daftar.get(nama)

    if nomor is None:
        print(f"Kontak '{nama}' tidak ditemukan.")
    else:
        print(f"{nama} : {nomor}")


def tampilkan_kontak(daftar: dict) -> None:
    print("\n--- DAFTAR KONTAK ---")

    nomor_urut = 1
    for nama, nomor in daftar.items():
        print(f"{nomor_urut}. {nama} : {nomor}")
        nomor_urut += 1

    print(f"Total: {len(daftar)} kontak")


def tampilkan_menu() -> None:
    print("\n=== KATALOG KONTAK ===")
    print("1. Tambah kontak")
    print("2. Cari kontak")
    print("3. Tampilkan semua kontak")
    print("4. Keluar")


while True:
    tampilkan_menu()
    pilihan = input("Pilih menu (1-4): ")

    if pilihan == "1":
        nama = input("Nama kontak   : ")
        nomor = input("Nomor telepon : ")
        tambah_kontak(kontak, nama, nomor)
    elif pilihan == "2":
        nama = input("Cari nama kontak: ")
        cari_kontak(kontak, nama)
    elif pilihan == "3":
        tampilkan_kontak(kontak)
    elif pilihan == "4":
        print("Sampai jumpa!")
        break
    else:
        print("Pilihan tidak valid. Masukkan angka 1-4.")
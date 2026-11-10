from library_item import LibraryItem, Book, Magazine
from library import Library


# ============================================================
# SKRIP UJI
# ============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("SISTEM MANAJEMEN PERPUSTAKAAN SEDERHANA")
    print("=" * 60)

    # 1. Membuat perpustakaan
    perpus = Library("Perpustakaan ITERA")

    # 2. Menambahkan beberapa buku dan majalah
    print("\n--- Menambahkan item ---")
    buku1 = Book("BK-001", "Pemrograman Python", "Andi Prasetyo", 320)
    buku2 = Book("BK-002", "Basis Data Relasional", "Siti Rahma", 280)
    majalah1 = Magazine("MG-001", "National Geographic", 156, "Oktober 2026")
    majalah2 = Magazine("MG-002", "Info Komputer", 210, "November 2026")

    perpus.tambah_item(buku1)
    perpus.tambah_item(buku2)
    perpus.tambah_item(majalah1)
    perpus.tambah_item(majalah2)

    # 3. Menampilkan katalog item yang tersedia
    perpus.tampilkan_item_tersedia()

    # 4. Mencari item berdasarkan judul atau id
    print("\n--- Pencarian item ---")
    perpus.cari_item("python")    # cari berdasarkan judul
    perpus.cari_item("MG-002")    # cari berdasarkan id

    # 5. Demonstrasi status ketersediaan item (property is_dipinjam)
    print("\n--- Demonstrasi status ketersediaan ---")
    print(f"Sebelum: '{buku1._judul}' is_dipinjam = {buku1.is_dipinjam}")
    buku1.is_dipinjam = True       # ubah status lewat property setter
    print(f"Sesudah: '{buku1._judul}' is_dipinjam = {buku1.is_dipinjam}")

    # Katalog tersedia kini tidak lagi menampilkan buku1
    perpus.tampilkan_item_tersedia()

class Library:
    """Class Library — menyimpan dan mengelola koleksi item perpustakaan."""

    def __init__(self, nama):
        """Constructor: koleksi disimpan private agar state terjaga."""
        self.nama = nama
        self.__koleksi = []

    def tambah_item(self, item):
        """Menambahkan satu item (Book/Magazine) ke koleksi perpustakaan."""
        self.__koleksi.append(item)
        print(f"Item '{item._judul}' berhasil ditambahkan ke {self.nama}")

    def tampilkan_item_tersedia(self):
        """Menampilkan katalog seluruh item yang tersedia (tidak dipinjam).

        Polymorphism: get_detail() milik masing-masing objek yang dipanggil.
        """
        print(f"\nKatalog {self.nama} — item tersedia:")
        jumlah = 0
        for item in self.__koleksi:
            if not item.is_dipinjam:
                print(f"  - {item.get_detail()}")
                jumlah += 1
        if jumlah == 0:
            print("  (tidak ada item yang tersedia)")

    def cari_item(self, kunci):
        """Mencari item berdasarkan judul atau id (tidak case-sensitive).

        Mengembalikan list item yang cocok.
        """
        kunci = kunci.lower()
        hasil = [
            item for item in self.__koleksi
            if kunci in item._judul.lower() or kunci in item._item_id.lower()
        ]
        print(f"\nHasil pencarian '{kunci}' ({len(hasil)} item ditemukan):")
        for item in hasil:
            print(f"  - {item.get_detail()}")
        return hasil

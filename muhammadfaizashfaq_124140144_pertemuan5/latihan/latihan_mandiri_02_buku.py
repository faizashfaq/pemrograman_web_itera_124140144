class Buku:
    """Class Buku — merepresentasikan sebuah buku."""

    def __init__(self, judul, penulis, jumlah_halaman, harga):
        """Constructor: inisialisasi atribut instance milik tiap objek."""
        self.judul = judul
        self.penulis = penulis
        self.jumlah_halaman = jumlah_halaman
        self.harga = harga

    def hitung_harga_diskon(self, persen):
        """Mengembalikan harga buku setelah diskon (persen dalam 0-100)."""
        harga_diskon = self.harga - (self.harga * persen / 100)
        return harga_diskon

    def __str__(self):
        """Representasi ramah pembaca — otomatis dipakai oleh print()."""
        return (f"Buku '{self.judul}' karya {self.penulis} "
                f"({self.jumlah_halaman} halaman) — Rp {self.harga:,}")

    def __len__(self):
        """Dunder len: mengembalikan jumlah halaman buku."""
        return self.jumlah_halaman

if __name__ == "__main__":
    print("=" * 60)
    print("LATIHAN MANDIRI 2: CLASS BUKU")
    print("=" * 60)

    buku1 = Buku("Pemrograman Web dengan Python", "Andi Prasetyo", 320, 150000)
    buku2 = Buku("Dasar-Dasar Algoritma", "Siti Rahma", 250, 120000)

    # __str__ dipanggil otomatis saat print()
    print(buku1)
    print(buku2)
    print()

    # hitung_harga_diskon()
    print(f"Diskon 20% untuk '{buku1.judul}': "
          f"Rp {buku1.hitung_harga_diskon(20):,.0f}")
    print(f"Diskon 15% untuk '{buku2.judul}': "
          f"Rp {buku2.hitung_harga_diskon(15):,.0f}")
    print()

    # __len__ dipanggil otomatis oleh len()
    print(f"len(buku1) -> {len(buku1)} halaman")
    print(f"len(buku2) -> {len(buku2)} halaman")

class Kendaraan:
    """Class induk — superclass dari semua jenis kendaraan."""

    def __init__(self, merk, tahun):
        """Constructor superclass: inisialisasi atribut umum kendaraan."""
        self.merk = merk
        self.tahun = tahun

    def deskripsi(self):
        """Deskripsi dasar kendaraan — akan di-override oleh subclass."""
        return f"Kendaraan merk {self.merk} tahun {self.tahun}"


class Truk(Kendaraan):
    """Subclass Truk — mewarisi class Kendaraan."""

    def __init__(self, merk, tahun, kapasitas_maksimal_ton):
        # super() memanggil constructor Kendaraan untuk atribut umum
        super().__init__(merk, tahun)
        self.kapasitas_maksimal_ton = kapasitas_maksimal_ton
        self.muatan_saat_ini = 0.0

    def muat_barang(self, berat_ton):
        """Memuat barang dengan validasi terhadap kapasitas maksimal."""
        if self.muatan_saat_ini + berat_ton > self.kapasitas_maksimal_ton:
            sisa = self.kapasitas_maksimal_ton - self.muatan_saat_ini
            print(f"Gagal! Muatan melebihi kapasitas. Sisa kapasitas: {sisa} ton")
        else:
            self.muatan_saat_ini += berat_ton
            print(f"Berhasil memuat {berat_ton} ton. "
                  f"Total muatan sekarang: {self.muatan_saat_ini} ton")

    def deskripsi(self):
        """Override deskripsi() milik Kendaraan, ditambah info truk."""
        dasar = super().deskripsi()  # panggil versi superclass
        return (f"{dasar} — Truk dengan kapasitas maksimal "
                f"{self.kapasitas_maksimal_ton} ton")

if __name__ == "__main__":
    print("=" * 60)
    print("LATIHAN MANDIRI 3: SUBCLASS TRUK")
    print("=" * 60)

    truk1 = Truk("Hino Dutro", 2023, 5.0)

    # Override deskripsi() versi Truk
    print(truk1.deskripsi())
    print()

    # muat_barang() dengan validasi kapasitas
    truk1.muat_barang(3.0)      # valid
    truk1.muat_barang(1.5)      # valid (total 4.5 ton)
    truk1.muat_barang(1.0)      # gagal (total 5.5 ton > kapasitas 5.0)
    print()

    # Pembuktian hubungan inheritance
    print(f"isinstance(truk1, Truk)      -> {isinstance(truk1, Truk)}")
    print(f"isinstance(truk1, Kendaraan) -> {isinstance(truk1, Kendaraan)}")
    print(f"issubclass(Truk, Kendaraan)  -> {issubclass(Truk, Kendaraan)}")

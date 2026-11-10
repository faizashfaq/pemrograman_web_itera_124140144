class Karyawan:
    """Class Karyawan — gaji pokok disembunyikan (private)."""

    def __init__(self, nama, jabatan, gaji_pokok):
        """Constructor: gaji lewat setter agar langsung tervalidasi UMR."""
        self.nama = nama
        self.jabatan = jabatan
        self.gaji_pokok = gaji_pokok  # memicu setter di bawah

    @property
    def gaji_pokok(self):
        """Getter: membaca nilai __gaji_pokok."""
        return self.__gaji_pokok

    @gaji_pokok.setter
    def gaji_pokok(self, nilai):
        """Setter: validasi gaji tidak boleh di bawah UMR Rp 3.200.000."""
        UMR_MINIMAL = 3_200_000
        if nilai < UMR_MINIMAL:
            print(f"Gagal! Gaji Rp {nilai:,} di bawah UMR "
                  f"Rp {UMR_MINIMAL:,} — nilai tidak diubah")
        else:
            self.__gaji_pokok = nilai

    def hitung_gaji_bersih(self, pajak_persen):
        """Menghitung gaji bersih setelah dipotong pajak (persen 0-100)."""
        pajak = self.__gaji_pokok * pajak_persen / 100
        return self.__gaji_pokok - pajak

if __name__ == "__main__":
    print("=" * 60)
    print("LATIHAN MANDIRI 4: CLASS KARYAWAN")
    print("=" * 60)

    karyawan1 = Karyawan("Budi Santoso", "Backend Developer", 7_500_000)

    # Getter property
    print(f"Nama      : {karyawan1.nama}")
    print(f"Jabatan   : {karyawan1.jabatan}")
    print(f"Gaji pokok: Rp {karyawan1.gaji_pokok:,}")
    print()

    # Setter menolak gaji di bawah UMR
    print("Coba set gaji Rp 2.500.000 (di bawah UMR):")
    karyawan1.gaji_pokok = 2_500_000
    print(f"Gaji pokok tetap: Rp {karyawan1.gaji_pokok:,}")
    print()

    # Setter menerima gaji valid
    print("Coba set gaji Rp 8.000.000 (valid):")
    karyawan1.gaji_pokok = 8_000_000
    print(f"Gaji pokok baru : Rp {karyawan1.gaji_pokok:,}")
    print()

    # hitung_gaji_bersih()
    print(f"Gaji bersih (pajak 10%): Rp {karyawan1.hitung_gaji_bersih(10):,.0f}")

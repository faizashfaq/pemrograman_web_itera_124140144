from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Abstract class — cetak biru untuk semua item perpustakaan.

    Subclass wajib meng-override method abstract get_detail().
    """

    def __init__(self, item_id, judul):
        """Constructor: atribut dilindungi access modifier.

        _item_id dan _judul protected (konvensi underscore tunggal),
        __is_dipinjam private (name mangling) dan hanya diakses
        melalui property is_dipinjam.
        """
        self._item_id = item_id
        self._judul = judul
        self.__is_dipinjam = False

    @property
    def is_dipinjam(self):
        """Getter property: status apakah item sedang dipinjam."""
        return self.__is_dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, status):
        """Setter property: mengubah status peminjaman item."""
        self.__is_dipinjam = status

    @abstractmethod
    def get_detail(self):
        """Abstract: mengembalikan detail item sesuai jenisnya.

        Setiap subclass wajib meng-override method ini.
        """
        pass


class Book(LibraryItem):
    """Subclass untuk item berupa buku."""

    def __init__(self, item_id, judul, penulis, jumlah_halaman):
        # super() memanggil constructor LibraryItem untuk atribut umum
        super().__init__(item_id, judul)
        self.penulis = penulis
        self.jumlah_halaman = jumlah_halaman

    def get_detail(self):
        """Implementasi detail khusus buku (override abstract method)."""
        status = "dipinjam" if self.is_dipinjam else "tersedia"
        return (f"[Buku] {self._judul} — oleh {self.penulis}, "
                f"{self.jumlah_halaman} halaman ({status})")


class Magazine(LibraryItem):
    """Subclass untuk item berupa majalah."""

    def __init__(self, item_id, judul, edisi, tanggal_terbit):
        super().__init__(item_id, judul)
        self.edisi = edisi
        self.tanggal_terbit = tanggal_terbit

    def get_detail(self):
        """Implementasi detail khusus majalah (override abstract method)."""
        status = "dipinjam" if self.is_dipinjam else "tersedia"
        return (f"[Majalah] {self._judul} — edisi {self.edisi}, "
                f"terbit {self.tanggal_terbit} ({status})")

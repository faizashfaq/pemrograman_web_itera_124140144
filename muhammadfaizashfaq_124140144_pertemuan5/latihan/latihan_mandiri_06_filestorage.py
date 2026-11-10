from abc import ABC, abstractmethod


class FileStorage(ABC):
    """Abstract class — cetak biru untuk semua jenis penyimpanan file.

    Tidak dapat diinstansiasi langsung; subclass wajib meng-override
    kedua method abstract di bawah ini.
    """

    @abstractmethod
    def upload_file(self, nama_file, data_bytes):
        """Abstract: mengunggah file ke penyimpanan."""
        pass

    @abstractmethod
    def download_file(self, nama_file):
        """Abstract: mengunduh file dari penyimpanan."""
        pass


class LocalDiskStorage(FileStorage):
    """Implementasi FileStorage pada penyimpanan lokal."""

    def upload_file(self, nama_file, data_bytes):
        """Implementasi upload ke disk lokal."""
        print(f"[LOCAL] '{nama_file}' ({len(data_bytes)} bytes) "
              f"disimpan ke disk lokal")

    def download_file(self, nama_file):
        """Implementasi download dari disk lokal."""
        print(f"[LOCAL] '{nama_file}' diunduh dari disk lokal")


class CloudStorage(FileStorage):
    """Implementasi FileStorage pada penyimpanan cloud."""

    def upload_file(self, nama_file, data_bytes):
        """Implementasi upload ke cloud."""
        print(f"[CLOUD] '{nama_file}' ({len(data_bytes)} bytes) "
              f"diunggah ke cloud")

    def download_file(self, nama_file):
        """Implementasi download dari cloud."""
        print(f"[CLOUD] '{nama_file}' diunduh dari cloud")

if __name__ == "__main__":
    print("=" * 60)
    print("LATIHAN MANDIRI 6: ABSTRACT CLASS FILESTORAGE")
    print("=" * 60)

    # Abstract class tidak dapat diinstansiasi langsung
    try:
        storage = FileStorage()
    except TypeError as e:
        print(f"Instansiasi FileStorage ditolak -> TypeError: {e}")
    print()

    # Objek dari kedua subclass implementasi
    local = LocalDiskStorage()
    cloud = CloudStorage()

    # Polymorphism: interface sama, implementasi berbeda
    daftar_storage = [local, cloud]
    for storage in daftar_storage:
        storage.upload_file("laporan.pdf", b"Isi laporan praktikum PAW")
        storage.download_file("laporan.pdf")
        print()

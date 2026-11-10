class NotifikasiEmail:
    """Channel notifikasi via email."""

    def __init__(self, penerima):
        """Setiap channel menyimpan alamat penerapanya sendiri."""
        self.penerima = penerima

    def kirim(self, pesan, penerima):
        """Kirim pesan melalui email (alamat email penerima)."""
        print(f"[EMAIL] ke {penerima}: {pesan}")


class NotifikasiSMS:
    """Channel notifikasi via SMS."""

    def __init__(self, penerima):
        """Setiap channel menyimpan nomor HP penerapanya sendiri."""
        self.penerima = penerima

    def kirim(self, pesan, penerima):
        """Kirim pesan melalui SMS (nomor HP penerima)."""
        print(f"[SMS] ke {penerima}: {pesan}")


class NotifikasiWhatsApp:
    """Channel notifikasi via WhatsApp."""

    def __init__(self, penerima):
        """Setiap channel menyimpan nomor WA penerapanya sendiri."""
        self.penerima = penerima

    def kirim(self, pesan, penerima):
        """Kirim pesan melalui WhatsApp (nomor WA penerima)."""
        print(f"[WHATSAPP] ke {penerima}: {pesan}")


def broadcast_pengumuman(daftar_channel, pesan):
    """Mengirim pesan yang sama ke semua channel.

    Polymorphism dalam koleksi: objek-objek berbeda merespons method
    kirim() yang sama sesuai perilakunya masing-masing, tanpa if-elif.
    """
    for channel in daftar_channel:
        channel.kirim(pesan, channel.penerima)

if __name__ == "__main__":
    print("=" * 60)
    print("LATIHAN MANDIRI 5: NOTIFIKASI MULTI-CHANNEL")
    print("=" * 60)

    daftar_channel = [
        NotifikasiEmail("faiz@student.itera.ac.id"),
        NotifikasiSMS("0812-3456-7890"),
        NotifikasiWhatsApp("0857-1234-5678"),
    ]

    pesan = "Praktikum PAW pertemuan 6 dimulai Senin depan!"

    # Satu panggilan, semua channel menanggapi sesuai perilakunya
    broadcast_pengumuman(daftar_channel, pesan)

# ============================================================
# PEMODELAN ENTITAS SISTEM KASIR TOKO ONLINE
# ============================================================
#
# ENTITAS 1: Produk
#   Atribut data (minimal 3):
#     - id_produk : identitas unik produk
#     - nama      : nama produk yang ditampilkan
#     - harga     : harga satuan produk (Rupiah)
#     - stok      : jumlah stok barang yang tersedia
#   Metode perilaku (minimal 2):
#     - ubah_harga(harga_baru) : memperbarui harga produk
#     - cek_stok()             : menampilkan ketersediaan stok produk
#
# ENTITAS 2: Keranjang
#   Atribut data (minimal 3):
#     - daftar_produk : kumpulan produk yang dimasukkan pembeli
#     - total_harga   : akumulasi harga seluruh item di keranjang
#     - pemilik       : pengguna yang memiliki keranjang
#   Metode perilaku (minimal 2):
#     - tambah_produk(produk) : memasukkan produk ke dalam keranjang
#     - hitung_total()        : menjumlahkan seluruh harga item di keranjang
#
# ENTITAS 3: Pengguna
#   Atribut data (minimal 3):
#     - nama_lengkap : identitas nama pembeli
#     - email        : akun login pengguna
#     - saldo        : saldo dompet digital untuk pembayaran
#   Metode perilaku (minimal 2):
#     - checkout(keranjang)  : memproses pembelian isi keranjang
#     - top_up_saldo(jumlah) : menambah saldo dompet digital pengguna

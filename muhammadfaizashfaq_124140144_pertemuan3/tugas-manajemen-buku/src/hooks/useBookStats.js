/**
 * Custom hook untuk menghitung ringkasan koleksi buku.
 * Dipakai di halaman Beranda dan Statistik agar logika perhitungan
 * tidak ditulis ulang di masing-masing komponen.
 */
function useBookStats(books) {
  const total = books.length;
  const owned = books.filter((book) => book.status === 'milik').length;
  const reading = books.filter((book) => book.status === 'baca').length;
  const wishlist = books.filter((book) => book.status === 'beli').length;

  const toPercentage = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

  return {
    total,
    owned,
    reading,
    wishlist,
    ownedPercentage: toPercentage(owned),
    readingPercentage: toPercentage(reading),
    wishlistPercentage: toPercentage(wishlist),
  };
}

export default useBookStats;

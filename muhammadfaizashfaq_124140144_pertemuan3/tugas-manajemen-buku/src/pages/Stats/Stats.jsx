import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import './Stats.css';

const BREAKDOWN = [
  { key: 'owned', percentageKey: 'ownedPercentage', label: 'Milik', className: 'progress-owned' },
  {
    key: 'reading',
    percentageKey: 'readingPercentage',
    label: 'Sedang Dibaca',
    className: 'progress-reading',
  },
  {
    key: 'wishlist',
    percentageKey: 'wishlistPercentage',
    label: 'Ingin Dibeli',
    className: 'progress-wishlist',
  },
];

function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  if (stats.total === 0) {
    return (
      <main className="page">
        <section className="page-heading">
          <h1>Statistik Koleksi</h1>
          <p>Ringkasan buku berdasarkan status yang tersimpan di perangkat ini.</p>
        </section>

        <p className="stats-empty">
          Belum ada buku yang dicatat. Tambahkan buku terlebih dahulu di halaman
          Beranda.
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-heading">
        <h1>Statistik Koleksi</h1>
        <p>Ringkasan buku berdasarkan status yang tersimpan di perangkat ini.</p>
      </section>

      <section className="summary-grid" aria-label="Ringkasan jumlah buku">
        <div className="summary-card summary-card-total">
          <span className="summary-label">Total Buku</span>
          <span className="summary-value">{stats.total}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Milik</span>
          <span className="summary-value">{stats.owned}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Sedang Dibaca</span>
          <span className="summary-value">{stats.reading}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Ingin Dibeli</span>
          <span className="summary-value">{stats.wishlist}</span>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Komposisi Status Buku</h2>

        {BREAKDOWN.map((item) => (
          <div className="progress-row" key={item.key}>
            <div className="progress-label">
              <span>{item.label}</span>
              <span>
                {stats[item.key]} buku - {stats[item.percentageKey]}%
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${item.className}`}
                style={{ width: `${stats[item.percentageKey]}%` }}
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Stats;

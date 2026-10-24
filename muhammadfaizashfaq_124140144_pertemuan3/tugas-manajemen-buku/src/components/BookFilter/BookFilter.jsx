import PropTypes from 'prop-types';
import './BookFilter.css';

const STATUS_OPTIONS = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'milik', label: 'Milik' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
];

function BookFilter({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="book-filter">
      <div className="form-field">
        <label htmlFor="filter-search">Cari Buku</label>
        <input
          id="filter-search"
          type="search"
          value={search}
          placeholder="Cari berdasarkan judul atau nama penulis..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="filter-status">Filter Status</label>
        <select
          id="filter-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  search: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default BookFilter;

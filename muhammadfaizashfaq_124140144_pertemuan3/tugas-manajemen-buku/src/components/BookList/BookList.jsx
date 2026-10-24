import PropTypes from 'prop-types';
import './BookList.css';

const STATUS_LABELS = {
  milik: 'Milik',
  baca: 'Sedang Dibaca',
  beli: 'Ingin Dibeli',
};

function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <p className="book-list-empty">
        Belum ada buku yang ditampilkan. Tambahkan buku baru atau ubah kata kunci
        pencarian serta filter status.
      </p>
    );
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li className="book-item" key={book.id}>
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <span className={`book-status book-status-${book.status}`}>
              {STATUS_LABELS[book.status]}
            </span>
          </div>

          <div className="book-actions">
            <button type="button" className="btn btn-edit" onClick={() => onEdit(book)}>
              Edit
            </button>
            <button type="button" className="btn btn-delete" onClick={() => onDelete(book.id)}>
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookList;

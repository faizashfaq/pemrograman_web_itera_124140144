import { useState } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

const EMPTY_FORM = { title: '', author: '', status: 'milik' };

/**
 * Form tambah/edit buku dengan controlled component.
 * Validasi dilakukan saat submit: judul dan penulis wajib diisi,
 * lalu pesan error ditampilkan di bawah masing-masing kolom.
 *
 * Nilai awal form diturunkan langsung dari props editingBook. Home memberi
 * prop key berdasarkan buku yang diedit sehingga form otomatis di-mount ulang
 * saat beralih antara mode tambah dan mode edit.
 */
function BookForm({ editingBook = null, onSave, onCancelEdit }) {
  const [form, setForm] = useState(() =>
    editingBook
      ? {
          title: editingBook.title,
          author: editingBook.author,
          status: editingBook.status,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    // Hapus pesan error pada kolom yang sedang diperbaiki
    setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Judul buku wajib diisi.';
    if (!form.author.trim()) nextErrors.author = 'Nama penulis wajib diisi.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
    });

    if (!editingBook) setForm(EMPTY_FORM);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2 className="book-form-title">{editingBook ? 'Edit Buku' : 'Tambah Buku'}</h2>

      <div className="book-form-grid">
        <div className="form-field">
          <label htmlFor="book-title">Judul Buku</label>
          <input
            id="book-title"
            name="title"
            type="text"
            placeholder="Contoh: Bumi Manusia"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="book-author">Nama Penulis</label>
          <input
            id="book-author"
            name="author"
            type="text"
            placeholder="Contoh: Pramoedya Ananta Toer"
            value={form.author}
            onChange={handleChange}
            className={errors.author ? 'input-error' : ''}
            aria-invalid={Boolean(errors.author)}
          />
          {errors.author && <p className="error-message">{errors.author}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="book-status">Status</label>
          <select
            id="book-status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="milik">Milik</option>
            <option value="baca">Sedang Dibaca</option>
            <option value="beli">Ingin Dibeli</option>
          </select>
        </div>
      </div>

      <div className="book-form-actions">
        <button type="submit" className="btn btn-primary">
          {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {editingBook && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  editingBook: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  }),
  onSave: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default BookForm;

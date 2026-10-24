import { useState } from 'react';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookForm from '../../components/BookForm/BookForm';
import BookList from '../../components/BookList/BookList';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import './Home.css';

function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [editingBook, setEditingBook] = useState(null);
  const stats = useBookStats(books);

  // Pencarian judul/penulis dan filter status dihitung dari data Context
  const keyword = search.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    const matchesKeyword =
      !keyword ||
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === 'semua' || book.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const handleSave = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(null);
      return;
    }
    addBook(bookData);
  };

  return (
    <main className="page">
      <section className="page-heading">
        <h1>Manajemen Buku Pribadi</h1>
        <p>Catat buku yang Anda miliki, sedang dibaca, atau ingin dibeli.</p>
      </section>

      <section className="stats-bar" aria-label="Ringkasan koleksi buku">
        <div className="stat-card stat-card-total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Buku</span>
        </div>
        <div className="stat-card stat-card-owned">
          <span className="stat-value">{stats.owned}</span>
          <span className="stat-label">Milik</span>
        </div>
        <div className="stat-card stat-card-reading">
          <span className="stat-value">{stats.reading}</span>
          <span className="stat-label">Sedang Dibaca</span>
        </div>
        <div className="stat-card stat-card-wishlist">
          <span className="stat-value">{stats.wishlist}</span>
          <span className="stat-label">Ingin Dibeli</span>
        </div>
      </section>

      <section className="card">
        {/* key memaksa form di-mount ulang saat beralih antara mode tambah dan edit */}
        <BookForm
          key={editingBook ? editingBook.id : 'new'}
          editingBook={editingBook}
          onSave={handleSave}
          onCancelEdit={() => setEditingBook(null)}
        />
      </section>

      <section className="card">
        <BookFilter
          search={search}
          status={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />

        <p className="results-info">
          Menampilkan <strong>{filteredBooks.length}</strong> dari{' '}
          <strong>{books.length}</strong> buku
        </p>

        <BookList books={filteredBooks} onEdit={setEditingBook} onDelete={deleteBook} />
      </section>
    </main>
  );
}

export default Home;

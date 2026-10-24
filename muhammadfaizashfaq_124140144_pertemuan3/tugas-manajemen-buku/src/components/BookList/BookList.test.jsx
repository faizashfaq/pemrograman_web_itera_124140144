import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import BookList from './BookList';

const books = [
  { id: 1, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'milik' },
  { id: 2, title: 'Filosofi Teras', author: 'Henry Manampiring', status: 'baca' },
];

describe('Komponen BookList', () => {
  test('merender judul, penulis, dan status setiap buku', () => {
    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.getByText('Pramoedya Ananta Toer')).toBeInTheDocument();
    expect(screen.getByText('Filosofi Teras')).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
  });

  test('memanggil onDelete dengan id buku saat tombol hapus diklik', () => {
    const handleDelete = vi.fn();
    render(<BookList books={books} onEdit={vi.fn()} onDelete={handleDelete} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Hapus' })[1]);

    expect(handleDelete).toHaveBeenCalledWith(2);
  });

  test('memanggil onEdit dengan objek buku saat tombol edit diklik', () => {
    const handleEdit = vi.fn();
    render(<BookList books={books} onEdit={handleEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);

    expect(handleEdit).toHaveBeenCalledWith(books[0]);
  });
});

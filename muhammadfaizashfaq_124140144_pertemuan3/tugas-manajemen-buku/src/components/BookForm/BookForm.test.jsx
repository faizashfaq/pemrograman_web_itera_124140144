import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import BookForm from './BookForm';

describe('Komponen BookForm', () => {
  test('menampilkan pesan error saat form dikirim dalam keadaan kosong', () => {
    const handleSave = vi.fn();
    render(<BookForm onSave={handleSave} onCancelEdit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }));

    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  test('memanggil onSave dengan data buku yang sudah diisi', () => {
    const handleSave = vi.fn();
    render(<BookForm onSave={handleSave} onCancelEdit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Judul Buku'), {
      target: { value: '  Bumi Manusia  ' },
    });
    fireEvent.change(screen.getByLabelText('Nama Penulis'), {
      target: { value: 'Pramoedya Ananta Toer' },
    });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'baca' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }));

    expect(handleSave).toHaveBeenCalledWith({
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      status: 'baca',
    });
  });

  test('mengisi form dan menampilkan tombol simpan saat mode edit', () => {
    const editingBook = {
      id: 1,
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'milik',
    };

    render(
      <BookForm editingBook={editingBook} onSave={vi.fn()} onCancelEdit={vi.fn()} />
    );

    expect(screen.getByLabelText('Judul Buku')).toHaveValue('Laskar Pelangi');
    expect(screen.getByLabelText('Nama Penulis')).toHaveValue('Andrea Hirata');
    expect(screen.getByLabelText('Status')).toHaveValue('milik');
    expect(screen.getByRole('button', { name: 'Simpan Perubahan' })).toBeInTheDocument();
  });
});

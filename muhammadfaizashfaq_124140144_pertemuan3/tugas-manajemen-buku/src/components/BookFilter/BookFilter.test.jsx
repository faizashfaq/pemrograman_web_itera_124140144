import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import BookFilter from './BookFilter';

describe('Komponen BookFilter', () => {
  test('memanggil onSearchChange saat pengguna mengetik kata kunci', () => {
    const handleSearchChange = vi.fn();
    render(
      <BookFilter
        search=""
        status="semua"
        onSearchChange={handleSearchChange}
        onStatusChange={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('Cari Buku'), {
      target: { value: 'bumi' },
    });

    expect(handleSearchChange).toHaveBeenCalledWith('bumi');
  });

  test('memanggil onStatusChange saat filter status diganti', () => {
    const handleStatusChange = vi.fn();
    render(
      <BookFilter
        search=""
        status="semua"
        onSearchChange={vi.fn()}
        onStatusChange={handleStatusChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Filter Status'), {
      target: { value: 'beli' },
    });

    expect(handleStatusChange).toHaveBeenCalledWith('beli');
  });
});

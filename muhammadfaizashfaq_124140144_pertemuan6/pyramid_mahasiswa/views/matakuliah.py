from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)

from ..models import Matakuliah

# Field wajib yang harus ada pada payload pembuatan data mata kuliah
REQUIRED_FIELDS = ['kode_mk', 'nama_mk', 'sks', 'semester']


def _parse_positive_int(value, field_name):
    """Mengubah nilai menjadi integer positif.

    Mengembalikan tuple ``(nilai, error)``. Jika valid, ``error`` bernilai
    ``None``. Jika tidak valid, ``nilai`` bernilai ``None`` dan ``error``
    berisi pesan kesalahan.
    """
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None, (
            f'Field {field_name} harus berupa angka bulat (integer)!'
        )

    if number <= 0:
        return None, (
            f'Field {field_name} harus lebih besar dari 0!'
        )

    return number, None


# 1. READ ALL: Menampilkan daftar seluruh mata kuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil semua data mata kuliah."""
    dbsession = request.dbsession
    matakuliahs = (
        dbsession.query(Matakuliah).order_by(Matakuliah.id.asc()).all()
    )
    return {'matakuliahs': [mk.to_dict() for mk in matakuliahs]}


# 2. READ ONE: Menampilkan detail satu mata kuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu mata kuliah berdasarkan ID di URL."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = (
        dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    )

    if matakuliah is None:
        return HTTPNotFound(
            json_body={
                'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
            }
        )

    return {'matakuliah': matakuliah.to_dict()}


# 3. CREATE: Menambahkan data mata kuliah baru
@view_config(
    route_name='matakuliah_add', request_method='POST', renderer='json'
)
def matakuliah_add(request):
    """View untuk menambahkan mata kuliah baru dari payload JSON."""
    try:
        json_data = request.json_body

        # Validasi keberadaan field wajib
        for field in REQUIRED_FIELDS:
            if field not in json_data or json_data[field] in (None, ''):
                return HTTPBadRequest(
                    json_body={'error': f'Field {field} wajib diisi!'}
                )

        # Validasi sks dan semester harus integer positif
        sks, error = _parse_positive_int(json_data['sks'], 'sks')
        if error:
            return HTTPBadRequest(json_body={'error': error})

        semester, error = _parse_positive_int(json_data['semester'], 'semester')
        if error:
            return HTTPBadRequest(json_body={'error': error})

        matakuliah = Matakuliah(
            kode_mk=json_data['kode_mk'],
            nama_mk=json_data['nama_mk'],
            sks=sks,
            semester=semester,
        )

        dbsession = request.dbsession
        dbsession.add(matakuliah)
        # Flush session untuk mengeksekusi query INSERT dan mendapatkan
        # nilai primary key id yang di-generate PostgreSQL.
        dbsession.flush()

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 4. UPDATE: Mengubah data mata kuliah yang sudah ada
@view_config(
    route_name='matakuliah_update', request_method='PUT', renderer='json'
)
def matakuliah_update(request):
    """View untuk mengupdate data mata kuliah berdasarkan ID."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = (
        dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    )
    if matakuliah is None:
        return HTTPNotFound(
            json_body={
                'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
            }
        )

    try:
        json_data = request.json_body

        if 'kode_mk' in json_data:
            matakuliah.kode_mk = json_data['kode_mk']
        if 'nama_mk' in json_data:
            matakuliah.nama_mk = json_data['nama_mk']

        if 'sks' in json_data:
            sks, error = _parse_positive_int(json_data['sks'], 'sks')
            if error:
                return HTTPBadRequest(json_body={'error': error})
            matakuliah.sks = sks

        if 'semester' in json_data:
            semester, error = _parse_positive_int(
                json_data['semester'], 'semester'
            )
            if error:
                return HTTPBadRequest(json_body={'error': error})
            matakuliah.semester = semester

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 5. DELETE: Menghapus data mata kuliah
@view_config(
    route_name='matakuliah_delete', request_method='DELETE', renderer='json'
)
def matakuliah_delete(request):
    """View untuk menghapus mata kuliah berdasarkan ID."""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = (
        dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    )
    if matakuliah is None:
        return HTTPNotFound(
            json_body={
                'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
            }
        )

    dbsession.delete(matakuliah)

    return {
        'success': True,
        'message': f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus'
    }

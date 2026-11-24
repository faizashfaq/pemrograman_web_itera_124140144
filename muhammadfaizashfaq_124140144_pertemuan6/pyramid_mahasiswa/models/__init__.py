from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
import zope.sqlalchemy

# Import model classes untuk memastikan mereka ter-register oleh SQLAlchemy
from .mahasiswa import Mahasiswa  # noqa: F401  (Daftarkan model Mahasiswa)
from .matakuliah import Matakuliah  # noqa: F401  (Daftarkan model Matakuliah)

# Jalankan configure_mappers setelah seluruh model diimpor
configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager):
    """Mendapatkan SQLAlchemy Session yang terikat dengan zope.sqlalchemy."""
    dbsession = session_factory()
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession


def includeme(config):
    """Inisialisasi konfigurasi database saat Pyramid startup."""
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    # use pyramid_tm to hook the transaction lifecycle to the request
    config.include('pyramid_tm')

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    config.registry['dbsession_factory'] = session_factory

    # make request.dbsession available for use in views
    config.add_request_method(
        # r.tm is the transaction manager used by pyramid_tm
        lambda r: get_tm_session(session_factory, r.tm),
        'dbsession',
        reify=True
    )

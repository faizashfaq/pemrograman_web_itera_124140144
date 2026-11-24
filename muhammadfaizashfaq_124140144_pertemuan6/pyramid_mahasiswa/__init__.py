from pyramid.config import Configurator


def main(global_config, **settings):
    """Fungsi pabrik WSGI utama.

    Mengembalikan aplikasi Pyramid yang sudah dikonfigurasi. Konfigurasi
    diambil dari file INI (development.ini / production.ini) melalui
    PasteDeploy.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan()
    return config.make_wsgi_app()

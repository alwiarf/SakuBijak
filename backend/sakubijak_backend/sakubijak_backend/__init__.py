from pyramid.config import Configurator


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        # 1. Sertakan konfigurasi untuk pyramid_jinja2 (untuk mengatasi error renderer)
        # Pastikan Anda sudah menginstal pyramid_jinja2: pip install pyramid_jinja2
        config.include('pyramid_jinja2')
        config.add_jinja2_renderer('.jinja2') # Memberitahu Pyramid untuk mengenali ekstensi .jinja2

        # 2. Sertakan konfigurasi dari paket models (yang menginisialisasi session database, dll.)
        config.include('.models') 
        
        # 3. Sertakan konfigurasi dari paket routes (yang mendefinisikan rute-rute Anda)
        config.include('.routes') 

        # 4. (Opsional) Konfigurasi CORS jika diperlukan dan sudah terinstal
        # Jika pyramid_cors belum terinstal, biarkan ini dikomentari.
        # config.include('pyramid_cors')
        # config.add_settings({
        #     'cors.origins': ['http://localhost:5173'], # Ganti dengan URL frontend Anda
        #     'cors.expose_headers': 'Content-Type,Date,Content-Length,Authorization,X-Request-ID',
        #     'cors.allow_headers': 'Content-Type,Date,Content-Length,Authorization,X-Request-ID,Accept',
        #     'cors.allow_credentials': 'true',
        #     'cors.max_age': '3600'
        # })
        # config.add_cors_preflight_handler()

        # 5. Memindai semua @view_config decorator di paket saat ini (dan sub-paketnya)
        # Ini akan menemukan @view_config di views/api_auth.py dan views/default.py
        config.scan() 
        
    return config.make_wsgi_app()
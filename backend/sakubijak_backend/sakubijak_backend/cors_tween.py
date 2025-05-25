# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\cors_tween.py

class CORSTweenFactory:
    def __init__(self, handler, registry): # <--- TAMBAHKAN 'registry' DI SINI
        self.handler = handler
        self.registry = registry # Simpan registry jika Anda memerlukannya nanti

    def __call__(self, request):
        # Ambil allowed_origin dari settings yang ada di registry
        # Ini adalah cara yang lebih baik daripada request.registry.settings di dalam __call__
        # karena registry sudah tersedia saat factory diinisialisasi.
        allowed_origin = self.registry.settings.get('cors.allowed_origin', 'http://localhost:5173')
        
        # Jika ini adalah preflight request (OPTIONS)
        if request.method == 'OPTIONS':
            response = request.response
            response.headers.update({
                'Access-Control-Allow-Origin': allowed_origin,
                'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '3600'
            })
            return response
        
        # Untuk request lainnya, proses request melalui handler
        response = self.handler(request)
        
        # Tambahkan header CORS ke respons aktual
        origin_header = request.headers.get('Origin')
        if origin_header == allowed_origin:
             response.headers['Access-Control-Allow-Origin'] = allowed_origin
             response.headers['Access-Control-Allow-Credentials'] = 'true'
             # response.headers['Access-Control-Expose-Headers'] = 'Content-Length, X-My-Custom-Header'

        return response

def includeme(config):
    config.add_tween('sakubijak_backend.cors_tween.CORSTweenFactory', 
                     over='pyramid.tweens.excview_tween_factory')
    
    # Pastikan setting 'cors.allowed_origin' didefinisikan di file .ini Anda
    # Contoh di development.ini:
    # [app:main]
    # cors.allowed_origin = http://localhost:5173
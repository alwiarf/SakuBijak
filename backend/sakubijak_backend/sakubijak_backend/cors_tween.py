class CORSTweenFactory:
    def __init__(self, handler, registry):
        self.handler = handler
        self.registry = registry

    def __call__(self, request):
        allowed_origin = self.registry.settings.get('cors.allowed_origin', 'http://localhost:5173')
        
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
        return response

def includeme(config):
    config.add_tween('sakubijak_backend.cors_tween.CORSTweenFactory', 
                     over='pyramid.tweens.excview_tween_factory')

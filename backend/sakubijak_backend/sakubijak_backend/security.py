import jwt
from pyramid.authentication import CallbackAuthenticationPolicy
from pyramid.interfaces import IAuthenticationPolicy
from zope.interface import implementer

from .models import User

from pyramid.security import (
    Allow,
    Authenticated,
    ALL_PERMISSIONS
)

@implementer(IAuthenticationPolicy)
class JWTAuthenticationPolicy(CallbackAuthenticationPolicy):
    def __init__(self, secret_key, algorithm='HS256', realm='Realm', auth_type='Bearer'):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.realm = realm
        self.auth_type = auth_type.lower() # Simpan dalam lowercase untuk perbandingan case-insensitive

    def unauthenticated_userid(self, request):
        """
        Mencoba mengekstrak dan memvalidasi token JWT dari request.
        Mengembalikan userid (user_id dari payload) jika token valid, None jika tidak.
        """
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # Header Authorization harusnya: "Bearer <token>"
            scheme, token = auth_header.split(' ', 1)
        except ValueError:
            # Format header salah
            return None

        if scheme.lower() != self.auth_type:
            # Skema autentikasi bukan Bearer
            return None

        if not token:
            return None

        try:
            # Decode token
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )

            user_id = payload.get('user_id')
            return user_id # Kembalikan user_id dari payload token

        except jwt.ExpiredSignatureError:
            # Token sudah kedaluwarsa
            request.jwt_error = 'Token kedaluwarsa'
            return None
        except jwt.InvalidTokenError as e:
            # Token tidak valid karena alasan lain (misalnya, signature salah, format payload salah)
            request.jwt_error = f'Token tidak valid: {e}'
            return None
        except Exception as e:
            # Error lain saat decode
            request.jwt_error = f'Error saat memproses token: {e}'
            return None

    def callback(self, userid, request):
        if userid:
            return [userid] # Mengindikasikan pengguna terautentikasi dengan userid tersebut
        return None

    # Metode remember dan forget tidak relevan untuk autentikasi stateless JWT
    def remember(self, request, userid, **kw):
        return []

    def forget(self, request, **kw):
        return []
    
class RootACLFactory:
    __acl__ = [
        (Allow, Authenticated, 'view_self'),
        (Allow, Authenticated, 'edit_self'), # Izinkan semua pengguna terautentikasi untuk permission 'view_self'
    ]

    def __init__(self, request):
        pass # Request tidak digunakan di sini untuk ACL sederhana
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized, HTTPCreated # HTTPOk tidak perlu eksplisit jika renderer='json'
import transaction
from passlib.context import CryptContext
import jwt # Impor library jwt
import datetime # Untuk mengatur waktu kedaluwarsa token

from ..models import User

# Konfigurasi context untuk hashing password (sudah ada dari register_view)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@view_config(route_name='api_auth_register', request_method='POST', renderer='json')
def register_view(request):
    """
    View untuk registrasi pengguna baru.
    Menerima JSON body dengan 'name', 'email', dan 'password'.
    """
    try:
        json_body = request.json_body
    except ValueError:
        request.response.status_code = 400
        return {'error': 'Permintaan JSON tidak valid.'}

    name = json_body.get('name')
    email = json_body.get('email')
    password = json_body.get('password')

    if not all([name, email, password]):
        request.response.status_code = 400
        return {'error': 'Nama, email, dan password wajib diisi.'}
    
    if len(password) < 6:
        request.response.status_code = 400
        return {'error': 'Password minimal harus 6 karakter.'}
    
    if '@' not in email or '.' not in email.split('@')[-1]:
        request.response.status_code = 400
        return {'error': 'Format email tidak valid.'}

    try:
        existing_user = request.dbsession.query(User).filter_by(email=email).first()
        if existing_user:
            request.response.status_code = 409 # Conflict
            return {'error': 'Email sudah terdaftar.'}
    except Exception as e:
        print(f"Database error while checking existing user: {e}")
        request.response.status_code = 500
        return {'error': 'Terjadi masalah pada server saat memeriksa email.'}

    hashed_password = get_password_hash(password)
    new_user = User(name=name, email=email, hashed_password=hashed_password)
    
    try:
        with transaction.manager:
            request.dbsession.add(new_user)
            request.dbsession.flush() 
        
        user_data = {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }
        
        request.response.status_code = 201 # Created
        return {
            'message': 'Registrasi berhasil!',
            'user': user_data
        }
    except Exception as e:
        print(f"Error saat menyimpan user: {e}")
        request.response.status_code = 500
        return {'error': 'Gagal menyimpan pengguna ke database.'}

@view_config(route_name='api_auth_login', request_method='POST', renderer='json')
def login_view(request):
    """
    View untuk login pengguna.
    Menerima JSON body dengan 'email' dan 'password'.
    Mengembalikan JWT jika berhasil.
    """
    try:
        json_body = request.json_body
    except ValueError:
        request.response.status_code = 400
        return {'error': 'Permintaan JSON tidak valid.'}

    email = json_body.get('email')
    password = json_body.get('password')

    if not all([email, password]):
        request.response.status_code = 400
        return {'error': 'Email dan password wajib diisi.'}

    try:
        user = request.dbsession.query(User).filter_by(email=email).first()
    except Exception as e:
        print(f"Database error while fetching user: {e}")
        request.response.status_code = 500
        return {'error': 'Terjadi masalah pada server saat mengambil data pengguna.'}

    if user and verify_password(password, user.hashed_password):
        # Login berhasil, buat JWT
        settings = request.registry.settings
        secret_key = settings.get('jwt.secret_key')
        algorithm = settings.get('jwt.algorithm', 'HS256')
        expiration_delta_seconds = int(settings.get('jwt.expiration_delta_seconds', 3600))

        if not secret_key:
            # Seharusnya tidak terjadi jika development.ini dikonfigurasi
            print("ERROR: JWT Secret Key tidak dikonfigurasi!")
            request.response.status_code = 500
            return {'error': 'Konfigurasi server error.'}

        payload = {
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expiration_delta_seconds)
        }
        
        try:
            token = jwt.encode(payload, secret_key, algorithm=algorithm)
        except Exception as e:
            print(f"Error encoding JWT: {e}")
            request.response.status_code = 500
            return {'error': 'Gagal membuat token autentikasi.'}

        user_data_for_response = {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
        
        request.response.status_code = 200 # OK
        return {
            'message': 'Login berhasil!',
            'access_token': token, # Kirim token ke klien
            'token_type': 'bearer',
            'expires_in': expiration_delta_seconds,
            'user': user_data_for_response 
        }
    else:
        # Login gagal
        request.response.status_code = 401 # Unauthorized
        return {'error': 'Email atau password salah.'}
    
@view_config(route_name='api_users_me', request_method='GET', renderer='json', permission='view_self') # Tambahkan permission
def users_me_view(request):
    """
    Mengembalikan detail pengguna yang sedang login.
    Memerlukan autentikasi (token JWT valid).
    """
    # request.authenticated_userid akan berisi user_id dari payload token
    # jika token valid dan authentication policy kita bekerja.
    logged_in_user_id = request.authenticated_userid

    if not logged_in_user_id:
        # Ini seharusnya tidak terjadi jika permission='view_self' bekerja dengan benar,
        # karena Pyramid akan mengembalikan 403 Forbidden sebelumnya.
        # Tapi sebagai fallback:
        request.response.status_code = 401
        return {'error': 'Tidak terautentikasi'}

    try:
        user = request.dbsession.query(User).filter_by(id=logged_in_user_id).first()
        if user:
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            }
            return {'user': user_data}
        else:
            request.response.status_code = 404 # Not Found
            return {'error': 'Pengguna tidak ditemukan.'}
    except Exception as e:
        print(f"Database error while fetching user details: {e}")
        request.response.status_code = 500
        return {'error': 'Terjadi masalah pada server saat mengambil detail pengguna.'}
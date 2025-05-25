# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\views\api_auth.py

from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPCreated
import transaction
from passlib.context import CryptContext # Untuk hashing password

from ..models import User # Impor model User Anda

# Konfigurasi context untuk hashing password (lakukan sekali)
# Anda bisa menggunakan berbagai skema, bcrypt adalah pilihan yang baik.
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
        # Mengembalikan respons JSON untuk error bad request
        request.response.status_code = 400
        return {'error': 'Permintaan JSON tidak valid.'}

    name = json_body.get('name')
    email = json_body.get('email')
    password = json_body.get('password')

    # Validasi input dasar
    if not all([name, email, password]):
        request.response.status_code = 400
        return {'error': 'Nama, email, dan password wajib diisi.'}
    
    if len(password) < 6: # Contoh validasi panjang password
        request.response.status_code = 400
        return {'error': 'Password minimal harus 6 karakter.'}
    
    # Validasi format email (sederhana)
    if '@' not in email or '.' not in email.split('@')[-1]:
        request.response.status_code = 400
        return {'error': 'Format email tidak valid.'}

    # Cek apakah email sudah ada
    try:
        existing_user = request.dbsession.query(User).filter_by(email=email).first()
        if existing_user:
            request.response.status_code = 409 # Conflict
            return {'error': 'Email sudah terdaftar.'}
    except Exception as e:
        # Log error database jika perlu
        print(f"Database error while checking existing user: {e}")
        request.response.status_code = 500
        return {'error': 'Terjadi masalah pada server saat memeriksa email.'}


    # Hash password
    hashed_password = get_password_hash(password)

    # Buat user baru
    new_user = User(name=name, email=email, hashed_password=hashed_password)
    
    try:
        with transaction.manager:
            request.dbsession.add(new_user)
            # Flush diperlukan untuk mendapatkan ID sebelum commit otomatis oleh transaction manager
            # jika Anda ingin mengembalikan ID tersebut.
            request.dbsession.flush() 
        
        # Setelah flush (atau commit oleh transaction manager), ID seharusnya sudah ada
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
        # Log error e jika perlu
        print(f"Error saat menyimpan user: {e}")
        request.response.status_code = 500 # Internal Server Error
        return {'error': 'Gagal menyimpan pengguna ke database.'}
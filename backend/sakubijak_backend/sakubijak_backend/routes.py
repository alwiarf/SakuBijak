# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\routes.py

def includeme(config):
    # Menambahkan static view untuk folder 'static'.
    # Ini berguna jika Anda memiliki file statis yang ingin disajikan langsung oleh Pyramid.
    # Baris ini mungkin sudah ada atau bisa ditambahkan di __init__.py utama juga.
    config.add_static_view('static', 'static', cache_max_age=3600)
    
    # Rute untuk halaman 'home' (view default yang sudah ada)
    config.add_route('home', '/') # Asumsi view default ada di path /

    # --- Rute untuk API Autentikasi ---
    # Prefiks /api untuk semua endpoint API kita
    config.add_route('api_auth_register', '/api/auth/register')
    
    # Tambahkan rute lain di sini nanti, misalnya:
    # config.add_route('api_auth_login', '/api/auth/login')
    
    # --- Rute untuk API Kategori (Contoh) ---
    # config.add_route('api_categories_collection', '/api/categories') 
    # config.add_route('api_category_item', '/api/categories/{category_id}')
    
    # --- Rute untuk API Transaksi (Contoh) ---
    # config.add_route('api_transactions_collection', '/api/transactions')
    # config.add_route('api_transaction_item', '/api/transactions/{transaction_id}')
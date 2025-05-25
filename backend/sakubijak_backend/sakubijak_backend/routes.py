# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\routes.py

def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # --- Rute untuk API Autentikasi ---
    config.add_route('api_auth_register', '/api/auth/register')
    config.add_route('api_auth_login', '/api/auth/login')
    config.add_route('api_users_me', '/api/users/me')

    # --- Rute untuk API Kategori (Contoh) ---
    # config.add_route('api_categories_collection', '/api/categories') 
    # config.add_route('api_category_item', '/api/categories/{category_id}')
    
    # --- Rute untuk API Transaksi (Contoh) ---
    # config.add_route('api_transactions_collection', '/api/transactions')
    # config.add_route('api_transaction_item', '/api/transactions/{transaction_id}')
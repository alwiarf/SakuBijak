def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # --- Rute untuk API Autentikasi ---
    config.add_route('api_auth_register', '/api/auth/register')
    config.add_route('api_auth_login', '/api/auth/login')
    
    # --- Rute untuk API User (Protected) ---
    config.add_route('api_users_me', '/api/users/me')

    # --- Rute untuk API Kategori (Protected) ---
    config.add_route('api_categories_collection', '/api/categories') 
    config.add_route('api_category_item', '/api/categories/{category_id}')
    
    # --- Rute untuk API Transaksi (Protected) ---
    config.add_route('api_transactions_collection', '/api/transactions')
    # TAMBAHKAN RUTE BARU DI BAWAH INI untuk operasi pada satu transaksi
    config.add_route('api_transaction_item', '/api/transactions/{transaction_id}')

    # API Dashboard
    config.add_route('api_dashboard_summary', '/api/dashboard/summary')
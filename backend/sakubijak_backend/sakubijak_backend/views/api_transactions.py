from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPBadRequest, 
    HTTPCreated, 
    HTTPOk, 
    HTTPForbidden, 
    HTTPNotFound,
    HTTPNoContent
)
import transaction
import datetime

from ..models import Transaction, Category, User # Impor model yang relevan

# Permission string yang sudah kita definisikan (atau bisa buat baru jika perlu)
VIEW_PERMISSION = 'view_self' 
EDIT_PERMISSION = 'edit_self'

# Helper untuk validasi tanggal (opsional, tapi baik untuk dimiliki)
def validate_date_format(date_string):
    try:
        datetime.datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except ValueError:
        return False

@view_config(
    route_name='api_transactions_collection', # Rute ini akan kita buat nanti
    request_method='POST',
    renderer='json',
    permission=EDIT_PERMISSION 
)
def create_transaction_view(request):
    """
    Membuat transaksi baru untuk pengguna yang sedang login.
    Menerima JSON body dengan description, amount, date, category_id.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    try:
        json_body = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    description = json_body.get('description')
    amount_str = json_body.get('amount') # Terima sebagai string dulu untuk validasi
    date_str = json_body.get('date') # Terima sebagai string YYYY-MM-DD
    category_id = json_body.get('category_id')

    # Validasi input
    if not all([description, amount_str, date_str, category_id]):
        raise HTTPBadRequest(json_body={'error': 'Deskripsi, jumlah, tanggal, dan ID kategori wajib diisi.'})

    if not isinstance(description, str) or not description.strip():
        raise HTTPBadRequest(json_body={'error': 'Deskripsi tidak boleh kosong.'})

    try:
        amount = float(amount_str) # Coba konversi ke float
        if amount <= 0:
            raise ValueError("Jumlah harus positif.")
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Jumlah harus berupa angka positif.'})

    if not validate_date_format(date_str):
        raise HTTPBadRequest(json_body={'error': 'Format tanggal tidak valid (YYYY-MM-DD).'})
    
    date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()

    try:
        category_id = int(category_id)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'ID Kategori tidak valid.'})

    # Periksa apakah kategori ada dan milik pengguna
    category = request.dbsession.query(Category).filter_by(id=category_id, user_id=user_id).first()
    if not category:
        raise HTTPBadRequest(json_body={'error': 'Kategori tidak valid atau bukan milik Anda.'})

    new_transaction = Transaction(
        description=description,
        amount=amount, # Simpan sebagai numeric/float
        date=date_obj,
        user_id=user_id,
        category_id=category_id
    )
    
    try:
        with transaction.manager:
            request.dbsession.add(new_transaction)
            request.dbsession.flush() # Untuk mendapatkan ID transaksi baru

        transaction_data = {
            'id': new_transaction.id,
            'description': new_transaction.description,
            'amount': float(new_transaction.amount), # Konversi kembali ke float untuk JSON jika disimpan sebagai Numeric
            'date': new_transaction.date.isoformat(),
            'category_id': new_transaction.category_id,
            'user_id': new_transaction.user_id,
            'category_name': category.name # Tambahkan nama kategori untuk kemudahan frontend
        }
        return HTTPCreated(json_body={
            'message': 'Transaksi berhasil ditambahkan!',
            'transaction': transaction_data
        })
    except Exception as e:
        print(f"Error saat menyimpan transaksi: {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal menyimpan transaksi ke database.'})

@view_config(
    route_name='api_transactions_collection', # Rute yang sama, tapi method GET
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_transactions_view(request):
    """
    Mengembalikan semua transaksi milik pengguna yang sedang login.
    Mendukung filter via query params: from_date, to_date, category_id.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    # Ambil parameter filter dari query string
    from_date_str = request.params.get('from_date')
    to_date_str = request.params.get('to_date')
    category_id_filter = request.params.get('category_id')
    
    # Tambahkan parameter pagination nanti jika diperlukan
    # page = int(request.params.get('page', 1))
    # per_page = int(request.params.get('per_page', 10))

    try:
        query = request.dbsession.query(Transaction).filter_by(user_id=user_id)

        if from_date_str:
            if not validate_date_format(from_date_str):
                raise HTTPBadRequest(json_body={'error': 'Format from_date tidak valid (YYYY-MM-DD).'})
            query = query.filter(Transaction.date >= datetime.datetime.strptime(from_date_str, '%Y-%m-%d').date())
        
        if to_date_str:
            if not validate_date_format(to_date_str):
                raise HTTPBadRequest(json_body={'error': 'Format to_date tidak valid (YYYY-MM-DD).'})
            query = query.filter(Transaction.date <= datetime.datetime.strptime(to_date_str, '%Y-%m-%d').date())

        if category_id_filter:
            try:
                cat_id = int(category_id_filter)
                # Pastikan kategori milik user juga (opsional, tapi baik untuk keamanan)
                category = request.dbsession.query(Category).filter_by(id=cat_id, user_id=user_id).first()
                if category:
                    query = query.filter(Transaction.category_id == cat_id)
                else:
                    # Jika kategori tidak ditemukan atau bukan milik user, bisa kembalikan list kosong
                    # atau error tergantung preferensi. Di sini kita abaikan filter jika kategori tidak valid.
                    pass 
            except ValueError:
                raise HTTPBadRequest(json_body={'error': 'Format category_id tidak valid.'})

        transactions = query.order_by(Transaction.date.desc(), Transaction.created_at.desc()).all()
        
        transactions_data = []
        for t in transactions:
            category_name = request.dbsession.query(Category.name).filter_by(id=t.category_id, user_id=user_id).scalar() or "N/A"
            transactions_data.append({
                'id': t.id,
                'description': t.description,
                'amount': float(t.amount),
                'date': t.date.isoformat(),
                'category_id': t.category_id,
                'category_name': category_name, # Tambahkan nama kategori
                'user_id': t.user_id,
                'created_at': t.created_at.isoformat() if t.created_at else None,
                'updated_at': t.updated_at.isoformat() if t.updated_at else None,
            })
            
        return HTTPOk(json_body={'transactions': transactions_data})
    except HTTPBadRequest: # Re-raise bad request dari validasi filter
        raise
    except Exception as e:
        print(f"Error saat mengambil transaksi: {e}")
        request.response.status_code = 500
        return {'error': 'Gagal mengambil data transaksi dari server.'}
    
@view_config(
    route_name='api_transaction_item',
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_transaction_detail_view(request):
    """
    Mengembalikan detail satu transaksi spesifik milik pengguna yang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    transaction_id_str = request.matchdict.get('transaction_id')
    if not transaction_id_str:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi diperlukan.'})
    
    try:
        transaction_id = int(transaction_id_str)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi tidak valid.'})

    try:
        # Query transaksi dan join dengan kategori untuk mendapatkan nama kategori
        transaction = (
            request.dbsession.query(Transaction, Category.name.label("category_name"))
            .join(Category, Transaction.category_id == Category.id)
            .filter(Transaction.id == transaction_id, Transaction.user_id == user_id)
            .first()
        )
        
        if not transaction: # Hasil query adalah tuple (Transaction, category_name) atau None
            raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'})

        t, category_name = transaction # Unpack tuple
        transaction_data = {
            'id': t.id,
            'description': t.description,
            'amount': float(t.amount),
            'date': t.date.isoformat(),
            'category_id': t.category_id,
            'category_name': category_name,
            'user_id': t.user_id,
            'created_at': t.created_at.isoformat() if t.created_at else None,
            'updated_at': t.updated_at.isoformat() if t.updated_at else None,
        }
        return HTTPOk(json_body={'transaction': transaction_data})
    except Exception as e:
        print(f"Error saat mengambil detail transaksi: {e}")
        request.response.status_code = 500
        return {'error': 'Gagal mengambil detail transaksi dari server.'}


@view_config(
    route_name='api_transaction_item',
    request_method='PUT',
    renderer='json',
    permission=EDIT_PERMISSION
)
def update_transaction_view(request):
    """
    Memperbarui transaksi yang sudah ada milik pengguna yang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    transaction_id_str = request.matchdict.get('transaction_id')
    if not transaction_id_str:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi diperlukan.'})
    try:
        transaction_id = int(transaction_id_str)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi tidak valid.'})

    try:
        json_body = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    # Ambil field yang boleh diupdate
    description = json_body.get('description')
    amount_str = json_body.get('amount')
    date_str = json_body.get('date')
    category_id_str = json_body.get('category_id')
    
    # Validasi dasar: setidaknya satu field harus ada untuk diupdate
    if not any([description, amount_str, date_str, category_id_str]):
        raise HTTPBadRequest(json_body={'error': 'Tidak ada data yang dikirim untuk diupdate.'})

    try:
        with transaction.manager:
            # Ambil transaksi yang ada
            transaction_to_update = request.dbsession.query(Transaction).filter_by(id=transaction_id, user_id=user_id).first()
            if not transaction_to_update:
                raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'})

            # Update field jika ada di payload dan valid
            if description is not None:
                if not isinstance(description, str) or not description.strip():
                     raise HTTPBadRequest(json_body={'error': 'Deskripsi tidak boleh kosong jika diupdate.'})
                transaction_to_update.description = description
            
            if amount_str is not None:
                try:
                    amount = float(amount_str)
                    if amount <= 0: raise ValueError("Jumlah harus positif.")
                    transaction_to_update.amount = amount
                except ValueError:
                    raise HTTPBadRequest(json_body={'error': 'Jumlah harus berupa angka positif jika diupdate.'})

            if date_str is not None:
                if not validate_date_format(date_str):
                    raise HTTPBadRequest(json_body={'error': 'Format tanggal tidak valid (YYYY-MM-DD) jika diupdate.'})
                transaction_to_update.date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()

            category_name_for_response = None # Default
            if category_id_str is not None:
                try:
                    category_id_int = int(category_id_str)
                    category = request.dbsession.query(Category).filter_by(id=category_id_int, user_id=user_id).first()
                    if not category:
                        raise HTTPBadRequest(json_body={'error': 'Kategori tidak valid atau bukan milik Anda jika diupdate.'})
                    transaction_to_update.category_id = category_id_int
                    category_name_for_response = category.name
                except ValueError:
                    raise HTTPBadRequest(json_body={'error': 'ID Kategori tidak valid jika diupdate.'})
            else: # Jika category_id tidak diupdate, ambil nama kategori yang sudah ada
                category = request.dbsession.query(Category).filter_by(id=transaction_to_update.category_id, user_id=user_id).first()
                if category: category_name_for_response = category.name


            request.dbsession.flush() # Untuk mendapatkan data terupdate, terutama updated_at

            updated_transaction_data = {
                'id': transaction_to_update.id,
                'description': transaction_to_update.description,
                'amount': float(transaction_to_update.amount),
                'date': transaction_to_update.date.isoformat(),
                'category_id': transaction_to_update.category_id,
                'category_name': category_name_for_response,
                'user_id': transaction_to_update.user_id,
                'updated_at': transaction_to_update.updated_at.isoformat() if transaction_to_update.updated_at else None,
            }
        return HTTPOk(json_body={
            'message': 'Transaksi berhasil diperbarui!',
            'transaction': updated_transaction_data
        })
    except (HTTPNotFound, HTTPBadRequest): # Re-raise exception ini
        raise
    except Exception as e:
        print(f"Error saat memperbarui transaksi: {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal memperbarui transaksi di database.'})

@view_config(
    route_name='api_transaction_item',
    request_method='DELETE',
    renderer='json',
    permission=EDIT_PERMISSION
)
def delete_transaction_view(request):
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    transaction_id_str = request.matchdict.get('transaction_id')
    if not transaction_id_str:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi diperlukan.'})
    
    try:
        transaction_id = int(transaction_id_str)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'ID Transaksi tidak valid.'})

    try:
        with transaction.manager:
            transaction_to_delete = request.dbsession.query(Transaction).filter_by(id=transaction_id, user_id=user_id).first()
            
            if not transaction_to_delete:
                raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'}) 
            
            request.dbsession.delete(transaction_to_delete)

        return HTTPNoContent() 
    except HTTPNotFound:
        raise
    except HTTPBadRequest:
        raise
    except Exception as e:
        print(f"Error saat menghapus transaksi (ID: {transaction_id}): {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal menghapus transaksi. Terjadi masalah internal.'})
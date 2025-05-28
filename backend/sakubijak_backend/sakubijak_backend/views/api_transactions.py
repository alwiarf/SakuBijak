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

from ..models import Transaction, Category, User 

# Permission string yang sudah definisikan
VIEW_PERMISSION = 'view_self'
EDIT_PERMISSION = 'edit_self'

# Helper untuk validasi tanggal
def validate_date_format(date_string):
    try:
        datetime.datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except ValueError:
        return False

@view_config(
    route_name='api_transactions_collection',
    request_method='POST',
    renderer='json',
    permission=EDIT_PERMISSION
)
def create_transaction_view(request):
    user_id = request.authenticated_userid
    if not user_id:
        # Seharusnya sudah ditangani permission, tapi sebagai fallback
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    try:
        json_body = request.json_body
        print(f"--- Backend: Menerima JSON body (create_transaction_view) ---: {json_body}")
    except ValueError:
        print("--- Backend: Gagal parsing JSON body (create_transaction_view) ---")
        raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    description = json_body.get('description')
    amount_str = json_body.get('amount') # Frontend mengirim ini sebagai string
    date_str = json_body.get('date')
    category_id_str = json_body.get('category_id') # Frontend mengirim ini sebagai string

    # Validasi input yang lebih eksplisit
    missing_fields = []
    if not description or not isinstance(description, str) or not description.strip():
        missing_fields.append("deskripsi")
    if not amount_str or not isinstance(amount_str, str): # Periksa apakah string dan tidak kosong
        missing_fields.append("jumlah")
    if not date_str or not isinstance(date_str, str) or not date_str.strip():
        missing_fields.append("tanggal")
    if not category_id_str or not isinstance(category_id_str, str) or not category_id_str.strip():
        missing_fields.append("ID kategori")

    if missing_fields:
        error_message = f"{', '.join(missing_fields).capitalize()} wajib diisi dan valid."
        print(f"--- Backend: Validasi GAGAL (create) --- Pesan: {error_message}")
        raise HTTPBadRequest(json_body={'error': error_message})

    try:
        amount = float(amount_str)
        if amount <= 0:
            raise ValueError("Jumlah harus positif.")
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Jumlah harus berupa angka positif.'})

    if not validate_date_format(date_str):
        raise HTTPBadRequest(json_body={'error': 'Format tanggal tidak valid (YYYY-MM-DD).'})
    date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()

    try:
        category_id_int = int(category_id_str) # Konversi ID kategori ke integer
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'ID Kategori tidak valid (bukan angka).'})

    category = request.dbsession.query(Category).filter_by(id=category_id_int, user_id=user_id).first()
    if not category:
        raise HTTPBadRequest(json_body={'error': 'Kategori tidak valid atau bukan milik Anda.'})

    new_transaction = Transaction(
        description=description.strip(), # Trim spasi
        amount=amount,
        date=date_obj,
        user_id=user_id,
        category_id=category_id_int
    )
    
    try:
        with transaction.manager:
            request.dbsession.add(new_transaction)
            request.dbsession.flush()

        transaction_data = {
            'id': new_transaction.id,
            'description': new_transaction.description,
            'amount': float(new_transaction.amount),
            'date': new_transaction.date.isoformat(),
            'category_id': new_transaction.category_id,
            'user_id': new_transaction.user_id,
            'category_name': category.name,
            'created_at': new_transaction.created_at.isoformat() if new_transaction.created_at else None,
            'updated_at': new_transaction.updated_at.isoformat() if new_transaction.updated_at else None,
        }
        return HTTPCreated(json_body={
            'message': 'Transaksi berhasil ditambahkan!',
            'transaction': transaction_data
        })
    except Exception as e:
        print(f"Error saat menyimpan transaksi: {e}")
        # Sebaiknya log error ini dengan lebih detail
        raise HTTPBadRequest(json_body={'error': 'Gagal menyimpan transaksi ke database.'})


@view_config(
    route_name='api_transactions_collection',
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_transactions_view(request):
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    from_date_str = request.params.get('from_date')
    to_date_str = request.params.get('to_date')
    category_id_filter = request.params.get('category_id')
    
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
                category = request.dbsession.query(Category).filter_by(id=cat_id, user_id=user_id).first()
                if category: query = query.filter(Transaction.category_id == cat_id)
            except ValueError:
                raise HTTPBadRequest(json_body={'error': 'Format category_id tidak valid.'})

        transactions_result = query.order_by(Transaction.date.desc(), Transaction.created_at.desc()).all()
        transactions_data = []
        for t in transactions_result:
            # Ambil nama kategori. Lebih efisien jika di-join, tapi ini juga bisa
            category = request.dbsession.query(Category).filter_by(id=t.category_id, user_id=user_id).first()
            category_name = category.name if category else "N/A"
            
            transactions_data.append({
                'id': t.id, 
                'description': t.description, 
                'amount': float(t.amount), # Pastikan amount adalah float untuk JSON
                'date': t.date.isoformat(), 
                'category_id': t.category_id,
                'category_name': category_name, 
                'user_id': t.user_id,
                'created_at': t.created_at.isoformat() if t.created_at else None,
                'updated_at': t.updated_at.isoformat() if t.updated_at else None,
            })
        return HTTPOk(json_body={'transactions': transactions_data})
    except HTTPBadRequest: raise
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
        transaction_result = (
            request.dbsession.query(Transaction, Category.name.label("category_name"))
            .join(Category, Transaction.category_id == Category.id)
            .filter(Transaction.id == transaction_id, Transaction.user_id == user_id)
            .first()
        )
        if not transaction_result:
            raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'})

        t, category_name = transaction_result
        transaction_data = {
            'id': t.id, 'description': t.description, 'amount': float(t.amount),
            'date': t.date.isoformat(), 'category_id': t.category_id,
            'category_name': category_name, 'user_id': t.user_id,
            'created_at': t.created_at.isoformat() if t.created_at else None,
            'updated_at': t.updated_at.isoformat() if t.updated_at else None,
        }
        return HTTPOk(json_body={'transaction': transaction_data})
    except HTTPNotFound: raise 
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
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    transaction_id_str = request.matchdict.get('transaction_id')
    if not transaction_id_str: raise HTTPBadRequest(json_body={'error': 'ID Transaksi diperlukan.'})
    try: transaction_id = int(transaction_id_str)
    except ValueError: raise HTTPBadRequest(json_body={'error': 'ID Transaksi tidak valid.'})

    try: json_body = request.json_body
    except ValueError: raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    # Ambil field yang boleh diupdate
    description = json_body.get('description')
    amount_str = json_body.get('amount')
    date_str = json_body.get('date')
    category_id_str = json_body.get('category_id')
    
    if not any(f is not None for f in [description, amount_str, date_str, category_id_str]): # Cek apakah setidaknya satu field ada
        raise HTTPBadRequest(json_body={'error': 'Tidak ada data yang dikirim untuk diupdate.'})

    try:
        with transaction.manager:
            transaction_to_update = request.dbsession.query(Transaction).filter_by(id=transaction_id, user_id=user_id).first()
            if not transaction_to_update:
                raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'})

            if description is not None:
                if not isinstance(description, str) or not description.strip():
                     raise HTTPBadRequest(json_body={'error': 'Deskripsi tidak boleh kosong jika diupdate.'})
                transaction_to_update.description = description.strip()
            
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

            category_name_for_response = request.dbsession.query(Category.name).filter_by(id=transaction_to_update.category_id).scalar() # Default ke nama kategori lama
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
            
            request.dbsession.flush()

            updated_transaction_data = {
                'id': transaction_to_update.id, 'description': transaction_to_update.description,
                'amount': float(transaction_to_update.amount), 'date': transaction_to_update.date.isoformat(),
                'category_id': transaction_to_update.category_id, 'category_name': category_name_for_response,
                'user_id': transaction_to_update.user_id,
                'updated_at': transaction_to_update.updated_at.isoformat() if transaction_to_update.updated_at else None,
            }
        return HTTPOk(json_body={'message': 'Transaksi berhasil diperbarui!', 'transaction': updated_transaction_data})
    except (HTTPNotFound, HTTPBadRequest): raise
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
    if not transaction_id_str: raise HTTPBadRequest(json_body={'error': 'ID Transaksi diperlukan.'})
    try: transaction_id = int(transaction_id_str)
    except ValueError: raise HTTPBadRequest(json_body={'error': 'ID Transaksi tidak valid.'})

    try:
        with transaction.manager:
            transaction_to_delete = request.dbsession.query(Transaction).filter_by(id=transaction_id, user_id=user_id).first()
            if not transaction_to_delete:
                raise HTTPNotFound(json_body={'error': 'Transaksi tidak ditemukan atau Anda tidak memiliki akses.'}) 
            request.dbsession.delete(transaction_to_delete)
        return HTTPNoContent() 
    except HTTPNotFound: raise
    except HTTPBadRequest: raise # Jika ada dari validasi ID
    except Exception as e:
        print(f"Error saat menghapus transaksi (ID: {transaction_id}): {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal menghapus transaksi. Terjadi masalah internal.'})
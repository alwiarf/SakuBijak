from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPBadRequest, 
    HTTPCreated, 
    HTTPOk, 
    HTTPForbidden, 
    HTTPNotFound, # Untuk item tidak ditemukan
    HTTPNoContent # Untuk delete sukses
)
import transaction

from ..models import Category, User 

# Permission strings
VIEW_PERMISSION = 'view_self'
EDIT_PERMISSION = 'edit_self'

# Fungsi create_category_view dan get_categories_view
@view_config(
    route_name='api_categories_collection',
    request_method='POST',
    renderer='json',
    permission=EDIT_PERMISSION
)
def create_category_view(request):
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    try:
        json_body = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    name = json_body.get('name')
    description = json_body.get('description', None)

    if not name:
        raise HTTPBadRequest(json_body={'error': 'Nama kategori wajib diisi.'})

    new_category = Category(name=name, description=description, user_id=user_id)
    
    try:
        with transaction.manager:
            request.dbsession.add(new_category)
            request.dbsession.flush()

        category_data = {
            'id': new_category.id,
            'name': new_category.name,
            'description': new_category.description,
            'user_id': new_category.user_id
        }
        return HTTPCreated(json_body={
            'message': 'Kategori berhasil ditambahkan!',
            'category': category_data
        })
    except Exception as e:
        print(f"Error saat menyimpan kategori: {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal menyimpan kategori ke database.'})

@view_config(
    route_name='api_categories_collection',
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_categories_view(request):
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    try:
        categories = request.dbsession.query(Category).filter_by(user_id=user_id).order_by(Category.name).all()
        
        categories_data = [
            {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'created_at': category.created_at.isoformat() if category.created_at else None,
                'updated_at': category.updated_at.isoformat() if category.updated_at else None,
            } for category in categories
        ]
        return HTTPOk(json_body={'categories': categories_data})
    except Exception as e:
        print(f"Error saat mengambil kategori: {e}")
        request.response.status_code = 500
        return {'error': 'Gagal mengambil data kategori dari server.'}

@view_config(
    route_name='api_category_item',
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_category_detail_view(request):
    """
    Mengembalikan detail satu kategori spesifik milik pengguna yang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    category_id = request.matchdict.get('category_id')
    if not category_id:
        raise HTTPBadRequest(json_body={'error': 'ID Kategori diperlukan.'})

    try:
        category = request.dbsession.query(Category).filter_by(id=category_id, user_id=user_id).first()
        if not category:
            raise HTTPNotFound(json_body={'error': 'Kategori tidak ditemukan atau Anda tidak memiliki akses.'})

        category_data = {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'user_id': category.user_id,
            'created_at': category.created_at.isoformat() if category.created_at else None,
            'updated_at': category.updated_at.isoformat() if category.updated_at else None,
        }
        return HTTPOk(json_body={'category': category_data})
    except Exception as e:
        print(f"Error saat mengambil detail kategori: {e}")
        request.response.status_code = 500
        return {'error': 'Gagal mengambil detail kategori dari server.'}


@view_config(
    route_name='api_category_item',
    request_method='PUT',
    renderer='json',
    permission=EDIT_PERMISSION
)
def update_category_view(request):
    """
    Memperbarui kategori yang sudah ada milik pengguna yang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    category_id = request.matchdict.get('category_id')
    if not category_id:
        raise HTTPBadRequest(json_body={'error': 'ID Kategori diperlukan.'})

    try:
        json_body = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Permintaan JSON tidak valid.'})

    name = json_body.get('name')
    description = json_body.get('description') # Bisa None jika tidak diupdate

    if not name: # Asumsi nama tetap wajib diisi saat update
        raise HTTPBadRequest(json_body={'error': 'Nama kategori wajib diisi.'})

    try:
        with transaction.manager:
            category = request.dbsession.query(Category).filter_by(id=category_id, user_id=user_id).first()
            if not category:
                raise HTTPNotFound(json_body={'error': 'Kategori tidak ditemukan atau Anda tidak memiliki akses.'})

            category.name = name
            if description is not None: # Hanya update deskripsi jika ada di payload
                category.description = description
            
            # SQLAlchemy akan mendeteksi perubahan dan session akan di-flush/commit oleh transaction manager
            request.dbsession.flush() # Untuk mendapatkan data terupdate jika ada trigger/default di DB

            updated_category_data = {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'user_id': category.user_id,
                'updated_at': category.updated_at.isoformat() if category.updated_at else None,
            }
        return HTTPOk(json_body={
            'message': 'Kategori berhasil diperbarui!',
            'category': updated_category_data
        })
    except HTTPNotFound: # Re-raise HTTPNotFound agar tidak ditangkap sebagai error umum
        raise
    except Exception as e:
        print(f"Error saat memperbarui kategori: {e}")
        raise HTTPBadRequest(json_body={'error': 'Gagal memperbarui kategori di database.'})


@view_config(
    route_name='api_category_item',
    request_method='DELETE',
    renderer='json',
    permission=EDIT_PERMISSION
)
def delete_category_view(request):
    """
    Menghapus kategori milik pengguna yang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    category_id = request.matchdict.get('category_id')
    if not category_id:
        raise HTTPBadRequest(json_body={'error': 'ID Kategori diperlukan.'})

    try:
        with transaction.manager:
            category = request.dbsession.query(Category).filter_by(id=category_id, user_id=user_id).first()
            if not category:
                raise HTTPNotFound(json_body={'error': 'Kategori tidak ditemukan atau Anda tidak memiliki akses.'})

            request.dbsession.delete(category)
            # request.dbsession.flush() # Tidak selalu perlu flush eksplisit untuk delete sebelum commit oleh TM

        return HTTPNoContent() # Status 204 No Content, tidak ada body respons
    except HTTPNotFound: # Re-raise HTTPNotFound
        raise
    except Exception as e:
        print(f"Error saat menghapus kategori: {e}")
        # Bisa jadi ada constraint error jika kategori masih digunakan dan tidak ada cascade
        raise HTTPBadRequest(json_body={'error': 'Gagal menghapus kategori. Mungkin masih ada transaksi terkait.'})
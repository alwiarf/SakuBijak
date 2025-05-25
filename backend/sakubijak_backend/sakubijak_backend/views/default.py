# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\views\default.py

from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError # Bisa tetap diimpor jika ada query lain nanti

from .. import models # Impor models untuk mengakses User, Category, Transaction jika perlu

@view_config(route_name='home', renderer='../templates/mytemplate.jinja2')
def my_view(request):
    # Logika lama yang menggunakan models.MyModel akan kita ubah atau hapus.
    # Untuk contoh ini, kita akan set 'one' menjadi None atau data sederhana.
    # Jika template mytemplate.jinja2 masih mengharapkan 'one', ini akan mencegah error.
    # Jika tidak, Anda bisa menghapus 'one' dari dictionary yang dikembalikan.
    
    one = None # Atau ganti dengan query ke model baru jika diinginkan
    project_name = 'SakuBijak Backend'

    # Contoh jika Anda ingin mencoba query ke model User:
    # try:
    #     # Mengambil satu user pertama sebagai contoh (jika ada)
    #     user_example = request.dbsession.query(models.User).first()
    #     if user_example:
    #         # Anda bisa mengirimkan nama user atau objek user ke template
    #         one = user_example # Misalnya, jika template mengharapkan objek 'one'
    #         project_name = f"SakuBijak - User: {user_example.name}"
    # except DBAPIError:
    #     # Jika ada error database saat query User, kembalikan pesan error
    #     return Response(db_err_msg, content_type='text/plain', status=500)

    return {'one': one, 'project': project_name}


# Variabel db_err_msg ini bisa tetap ada jika Anda ingin menggunakannya untuk penanganan error DBAPIError
# di view lain, atau jika view ini sendiri akan melakukan query yang mungkin gagal.
db_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for description and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""
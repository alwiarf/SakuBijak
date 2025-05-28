from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .. import models # Impor models untuk mengakses User, Category, Transaction jika perlu

@view_config(route_name='home', renderer='../templates/mytemplate.jinja2')
def my_view(request):
    one = None # Atau ganti dengan query ke model baru jika diinginkan
    project_name = 'SakuBijak Backend'

    return {'one': one, 'project': project_name}


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
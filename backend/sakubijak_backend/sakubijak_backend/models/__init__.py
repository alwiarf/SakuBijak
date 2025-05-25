# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\models\__init__.py

from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers # Penting untuk relasi
import zope.sqlalchemy # Untuk integrasi dengan pyramid_tm

# Impor Base dari meta.py agar bisa diakses jika perlu dari package models
from .meta import Base 

# Impor semua model Anda dari mymodel.py agar terdaftar ke Base.metadata
# Ini adalah baris yang memastikan User, Category, dan Transaction dikenali.
from .mymodel import User, Category, Transaction 

# configure_mappers() dijalankan setelah semua model didefinisikan dan diimpor
# untuk memastikan semua relasi (relationships) antar model bisa di-setup dengan benar.
configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager):
    """
    Get a ``sqlalchemy.orm.Session`` instance backed by a transaction.

    This function will hook the session to the transaction manager which
    will take care of committing any changes.

    - When using pyramid_tm it will automatically be committed or aborted
      depending on whether an exception is raised.

    - When using scripts you should wrap the session in a manager yourself.
      For example::

          import transaction

          engine = get_engine(settings)
          session_factory = get_session_factory(engine)
          with transaction.manager:
              dbsession = get_tm_session(session_factory, transaction.manager)

    """
    dbsession = session_factory()
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession


def includeme(config):
    """
    Initialize the model for a Pyramid app.

    Activate this setup using ``config.include('sakubijak_backend.models')``.

    """
    settings = config.get_settings()
    
    # Konfigurasi untuk pyramid_tm agar menggunakan transaction manager secara eksplisit
    # Pastikan baris ini ada untuk integrasi yang benar dengan request.dbsession
    if 'tm.manager_hook' not in settings:
        settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    # Menggunakan pyramid_tm untuk mengaitkan siklus hidup transaksi dengan request
    config.include('pyramid_tm')

    # Baris ini bisa di-uncomment jika Anda ingin menggunakan pyramid_retry dan sudah menginstalnya
    # config.include('pyramid_retry')

    session_factory = get_session_factory(get_engine(settings))
    config.registry['dbsession_factory'] = session_factory

    # Membuat request.dbsession tersedia untuk digunakan dalam view Pyramid
    config.add_request_method(
        # r.tm adalah transaction manager yang digunakan oleh pyramid_tm
        lambda r: get_tm_session(session_factory, r.tm),
        'dbsession',
        reify=True # dbsession akan dibuat sekali per request
    )
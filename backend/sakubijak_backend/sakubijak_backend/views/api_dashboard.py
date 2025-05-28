from pyramid.view import view_config
from pyramid.httpexceptions import HTTPForbidden, HTTPOk
from sqlalchemy import func, extract
from datetime import datetime, date

from ..models import Transaction, Category

VIEW_PERMISSION = 'view_self'

@view_config(
    route_name='api_dashboard_summary',
    request_method='GET',
    renderer='json',
    permission=VIEW_PERMISSION
)
def get_dashboard_summary_view(request):
    """
    Menyediakan data ringkasan untuk dashboard pengguna yang sedang login.
    """
    user_id = request.authenticated_userid
    if not user_id:
        raise HTTPForbidden(json_body={'error': 'Autentikasi diperlukan.'})

    dbsession = request.dbsession
    today = date.today()
    current_month = today.month
    current_year = today.year

    # 1. Total Pengeluaran Bulan Ini
    total_expenses_query = dbsession.query(func.sum(Transaction.amount))\
        .filter(
            Transaction.user_id == user_id,
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        ).scalar()
    total_expenses = float(total_expenses_query) if total_expenses_query else 0.0

    # 2. Transaksi Terakhir (5 Transaksi)
    latest_transactions_query = dbsession.query(Transaction, Category.name)\
        .join(Category, Transaction.category_id == Category.id)\
        .filter(Transaction.user_id == user_id)\
        .order_by(Transaction.date.desc(), Transaction.created_at.desc())\
        .limit(5).all()

    latest_transactions = [
        {
            'id': t.id,
            'description': t.description,
            'amount': float(t.amount),
            'date': t.date.isoformat(),
            'category_name': cat_name
        } for t, cat_name in latest_transactions_query
    ]

    # 3. Kategori Teratas Bulan Ini (Berdasarkan Jumlah Pengeluaran)
    top_category_query = dbsession.query(Category.name, func.sum(Transaction.amount).label('total'))\
        .join(Transaction, Category.id == Transaction.category_id)\
        .filter(
            Transaction.user_id == user_id,
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        )\
        .group_by(Category.name)\
        .order_by(func.sum(Transaction.amount).desc())\
        .first()

    top_category = {
        'name': top_category_query[0] if top_category_query else "N/A",
        'total': float(top_category_query[1]) if top_category_query else 0.0
    }

    # 4. Jumlah Total Transaksi Bulan Ini
    total_transactions_count = dbsession.query(func.count(Transaction.id))\
        .filter(
            Transaction.user_id == user_id,
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        ).scalar() or 0

    # 5. Pengeluaran per Kategori Bulan Ini (untuk Pie Chart)
    expenses_per_category_query = dbsession.query(
            Category.name, 
            func.sum(Transaction.amount).label('total_amount')
        )\
        .join(Transaction, Category.id == Transaction.category_id)\
        .filter(
            Transaction.user_id == user_id,
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        )\
        .group_by(Category.name)\
        .order_by(func.sum(Transaction.amount).desc())\
        .all()

    expenses_per_category = [
        {'name': cat_name, 'total': float(total)} 
        for cat_name, total in expenses_per_category_query
    ]

    summary_data = {
        'total_expenses_this_month': total_expenses,
        'latest_transactions': latest_transactions,
        'top_category_this_month': top_category,
        'total_transactions_this_month': total_transactions_count,
        'expenses_per_category': expenses_per_category
    }

    return HTTPOk(json_body=summary_data)
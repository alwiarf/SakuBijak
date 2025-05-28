import datetime
from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    ForeignKey,
    DateTime,
    Numeric,
    Date,
    Index, 
)
from sqlalchemy.orm import relationship 
from .meta import Base 

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False) # Password yang sudah di-hash
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    categories = relationship("Category", back_populates="user_owner", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user_owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}')>"

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True) # Tambahkan index jika sering dicari/filter
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relasi: Satu Category dimiliki oleh satu User
    user_owner = relationship("User", back_populates="categories")
    # Relasi: Satu Category memiliki banyak Transaction
    transactions = relationship("Transaction", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}', user_id={self.user_id})>"

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=True) # Deskripsi bisa opsional
    amount = Column(Numeric(15, 2), nullable=False) # Presisi 15 digit, 2 desimal untuk mata uang
    date = Column(Date, nullable=False, default=datetime.date.today, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False, index=True) # Kategori wajib untuk transaksi
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relasi: Satu Transaction dimiliki oleh satu User dan satu Category
    user_owner = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction(id={self.id}, description='{self.description}', amount={self.amount}, date='{self.date}')>"

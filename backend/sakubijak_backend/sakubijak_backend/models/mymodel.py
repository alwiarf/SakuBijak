# File: D:\Project\SakuBijak\backend\sakubijak_backend\sakubijak_backend\models\mymodel.py

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
    Index, # Jika Anda ingin menambahkan index secara eksplisit di luar definisi kolom
)
from sqlalchemy.orm import relationship # Untuk mendefinisikan relasi antar tabel
from .meta import Base  # Impor Base dari meta.py di direktori yang sama

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False) # Password yang sudah di-hash
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relasi: Satu User memiliki banyak Category dan banyak Transaction
    # `back_populates` harus cocok dengan nama properti relasi di model lawan
    # `cascade="all, delete-orphan"` berarti jika User dihapus, kategori dan transaksinya juga akan dihapus.
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
    # type = Column(String(50), default='expense', nullable=False) # Jika hanya pengeluaran, ini bisa dihilangkan
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False, index=True) # Kategori wajib untuk transaksi
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relasi: Satu Transaction dimiliki oleh satu User dan satu Category
    user_owner = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction(id={self.id}, description='{self.description}', amount={self.amount}, date='{self.date}')>"

# Contoh jika Anda ingin menambahkan index gabungan secara eksplisit (opsional):
# Index('ix_user_category_name', Category.user_id, Category.name, unique=True) # Contoh index untuk nama kategori unik per user
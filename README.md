# SakuBijak: Aplikasi Web Catatan Pengeluaran

**SakuBijak** adalah aplikasi web yang dirancang untuk membantu pengguna mencatat, mengkategorikan, dan memantau pengeluaran pribadi mereka dengan mudah dan efisien. Aplikasi ini dibangun sebagai bagian dari Tugas Besar Mata Kuliah Pemrograman Web.

**Nama Mahasiswa:** Alwi Arfan Solin

**NIM:** 122140197

## Daftar Isi

- [Deskripsi Proyek](#deskripsi-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
- [Instalasi & Menjalankan Proyek](#instalasi--menjalankan-proyek)
  - [Prasyarat](#prasyarat)
  - [Backend (Python Pyramid)](#backend-python-pyramid)
  - [Frontend (React JS)](#frontend-react-js)
- [API Endpoint](#api-endpoint)
- [Kontribusi](#kontribusi)

## Deskripsi Proyek

Dalam kehidupan sehari-hari, seringkali kita kesulitan melacak ke mana saja uang kita dibelanjakan. SakuBijak hadir sebagai solusi digital untuk mengatasi masalah ini. Dengan antarmuka yang intuitif, pengguna dapat dengan mudah menambahkan setiap transaksi pengeluaran, mengelompokkannya ke dalam kategori tertentu, dan melihat ringkasan pengeluaran mereka. Tujuan utama aplikasi ini adalah untuk meningkatkan kesadaran finansial pengguna dan membantu mereka mengambil keputusan keuangan yang lebih bijak.

## Fitur Utama

- **Manajemen Pengguna:**
  - Registrasi pengguna baru.
  - Login untuk pengguna terdaftar.
  - (Opsional) Update profil pengguna.
- **Manajemen Transaksi (CRUD):**
  - **Create:** Menambah data pengeluaran baru (deskripsi, jumlah, tanggal, kategori).
  - **Read:** Menampilkan daftar pengeluaran dengan opsi filter (per periode, per kategori).
  - **Update:** Mengubah detail data pengeluaran yang sudah ada.
  - **Delete:** Menghapus data pengeluaran.
- **Manajemen Kategori Pengeluaran (CRUD):**
  - **Create:** Menambah kategori pengeluaran baru (misal: Makanan, Transportasi, Hiburan).
  - **Read:** Menampilkan daftar kategori yang dimiliki pengguna.
  - **Update:** Mengubah nama kategori.
  - **Delete:** Menghapus kategori.
- **Ringkasan Pengeluaran:**
  - Menampilkan total pengeluaran dalam periode tertentu.
  - Visualisasi sederhana pengeluaran per kategori.
- **Keamanan:**
  - Autentikasi dasar untuk melindungi data pribadi pengguna.

## Teknologi yang Digunakan

### Backend

- **Bahasa & Framework:** Python 3.x & Pyramid
- **Arsitektur API:** RESTful API
- **Autentikasi:** JWT Authentication
- **Testing:** pytest (Target coverage minimal 60% untuk fungsi kritis)

### Frontend

- **Library/Framework:** React JS (v18+) dengan Functional Components & Hooks
- **Routing:** React Router DOM (v6+)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **API Client:** Axios

### Database

- **Sistem Manajemen Database Relasional (RDBMS):** PostgreSQL


## Instalasi & Menjalankan Proyek

### Prasyarat

Pastikan kamu memiliki perangkat lunak berikut terinstal di sistemmu:
- Python (versi 3.8 atau lebih tinggi)
- Node.js (versi 16 atau lebih tinggi) dan npm/yarn
- PostgreSQL Server

### Backend (Python Pyramid)

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/samanbrembo14/SakuBijak
    cd sakubijak/backend
    ```

2.  **Buat dan aktifkan virtual environment (direkomendasikan):**
    ```bash
    python -m venv env
    # Windows
    env\Scripts\activate
    # macOS/Linux
    source env/bin/activate
    ```

3.  **Install dependensi Python:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Konfigurasi Database PostgreSQL:**
    - Buat database baru di PostgreSQL (misalnya `sakubijak_db`).
    - Salin `development.ini.example` (jika ada) menjadi `development.ini`.
    - Edit file `development.ini` dan sesuaikan bagian `sqlalchemy.url` dengan koneksi string PostgreSQL-mu.
      Contoh: `postgresql://user:password@host:port/database_name`

5.  **Inisialisasi Database (jika menggunakan Alembic atau skema manual):**
    ```bash
    # Jika menggunakan Alembic (contoh)
    # alembic upgrade head
    # Atau jalankan skrip SQL untuk membuat tabel
    # python initialize_db.py (jika ada skrip kustom)
    ```
    *Catatan: Detail ini bergantung pada bagaimana kamu mengatur skema database di Pyramid.*

6.  **Jalankan server development Pyramid:**
    ```bash
    pserve development.ini --reload
    ```
    Server backend akan berjalan di `http://localhost:6543` (atau port lain sesuai konfigurasi).

### Frontend (React JS)

1.  **Navigasi ke direktori frontend:**
    ```bash
    cd ../frontend
    # atau dari root project: cd sakubijak/frontend
    ```

2.  **Install dependensi Node.js:**
    ```bash
    npm install
    # atau jika menggunakan yarn
    # yarn install
    ```

3.  **(Opsional) Konfigurasi Environment Variable:**
    - Salin `.env.example` (jika ada) menjadi `.env`.
    - Edit file `.env` untuk mengatur URL API backend, misalnya:
      `REACT_APP_API_URL=http://localhost:6543/api`

4.  **Jalankan server development React:**
    ```bash
    npm start
    # atau jika menggunakan yarn
    # yarn start
    ```
    Aplikasi frontend akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sudah terpakai).

## API Endpoint

Berikut adalah daftar endpoint utama yang disediakan oleh backend SakuBijak:

- **Autentikasi:**
  - `POST /api/auth/register`: Registrasi pengguna baru.
  - `POST /api/auth/login`: Login pengguna.
- **Users:**
  - `GET /api/users/me`: (Protected) Mendapatkan detail user yang sedang login.
  - `PUT /api/users/me`: (Protected) Memperbarui profil user.
- **Categories (Semua Protected):**
  - `POST /api/categories`: Membuat kategori baru.
  - `GET /api/categories`: Mendapatkan semua kategori milik user.
  - `GET /api/categories/{category_id}`: Mendapatkan detail satu kategori.
  - `PUT /api/categories/{category_id}`: Memperbarui kategori.
  - `DELETE /api/categories/{category_id}`: Menghapus kategori.
- **Transactions (Semua Protected):**
  - `POST /api/transactions`: Membuat transaksi baru.
  - `GET /api/transactions`: Mendapatkan semua transaksi (opsional: filter by date, category).
  - `GET /api/transactions/{transaction_id}`: Mendapatkan detail satu transaksi.
  - `PUT /api/transactions/{transaction_id}`: Memperbarui transaksi.
  - `DELETE /api/transactions/{transaction_id}`: Menghapus transaksi.

*(Pastikan untuk mengawali semua endpoint ini dengan base URL API backend, misalnya `http://localhost:6543`)*

## Kontribusi

Saat ini, proyek ini dikembangkan sebagai tugas individu. Namun, saran dan masukan selalu diterima. Jika kamu menemukan bug atau memiliki ide untuk perbaikan, silakan buat *Issue* di repositori GitHub ini.

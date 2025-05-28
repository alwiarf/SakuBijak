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
- [Database Schema](#database-schema)
- [Evaluasi Spesifikasi](#evaluasi-spesifikasi)

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
- **Build Tool:** Vite
- **Routing:** React Router DOM (v6+)
- **State Management:** Redux Toolkit
- **Styling:** MUI
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

### Autentikasi

- **POST /api/auth/register**: Registrasi pengguna baru.
- **POST /api/auth/login**: Login pengguna dan mendapatkan token JWT.
- **GET /api/users/me**: Mendapatkan detail pengguna yang sedang login.

### Kategori

- **POST /api/categories**: Menambah kategori pengeluaran baru.
- **GET /api/categories**: Mendapatkan daftar kategori.
- **GET /api/categories/{category_id}**: Mendapatkan detail kategori tertentu.
- **PUT /api/categories/{category_id}**: Memperbarui kategori tertentu.
- **DELETE /api/categories/{category_id}**: Menghapus kategori tertentu.

### Transaksi

- **POST /api/transactions**: Menambah transaksi pengeluaran baru.
- **GET /api/transactions**: Mendapatkan daftar transaksi dengan filter.
- **GET /api/transactions/{transaction_id}**: Mendapatkan detail transaksi tertentu.
- **PUT /api/transactions/{transaction_id}**: Memperbarui transaksi tertentu.
- **DELETE /api/transactions/{transaction_id}**: Menghapus transaksi tertentu.

### Dashboard

- **GET /api/dashboard/summary**: Mendapatkan ringkasan data untuk dashboard pengguna.

*(Pastikan untuk mengawali semua endpoint ini dengan base URL API backend, misalnya `http://localhost:6543`)*

## Kontribusi

Saat ini, proyek ini dikembangkan sebagai tugas individu. Namun, saran dan masukan selalu diterima. Jika kamu menemukan bug atau memiliki ide untuk perbaikan, silakan buat *Issue* di repositori GitHub ini.

## Database Schema

Berikut adalah skema database yang digunakan dalam aplikasi SakuBijak:

### Tabel `users`
| Kolom          | Tipe Data       | Deskripsi                          |
|----------------|-----------------|------------------------------------|
| `id`          | Integer         | Primary key                        |
| `name`        | String(100)     | Nama pengguna                      |
| `email`       | String(100)     | Email pengguna (unik)              |
| `hashed_password` | String(255) | Password yang sudah di-hash        |
| `created_at`  | DateTime        | Waktu registrasi pengguna          |
| `updated_at`  | DateTime        | Waktu terakhir pembaruan data      |

### Tabel `categories`
| Kolom          | Tipe Data       | Deskripsi                          |
|----------------|-----------------|------------------------------------|
| `id`          | Integer         | Primary key                        |
| `name`        | String(100)     | Nama kategori                      |
| `description` | Text            | Deskripsi kategori (opsional)      |
| `user_id`     | Integer         | Foreign key ke tabel `users`       |
| `created_at`  | DateTime        | Waktu pembuatan kategori           |
| `updated_at`  | DateTime        | Waktu terakhir pembaruan data      |

### Tabel `transactions`
| Kolom          | Tipe Data       | Deskripsi                          |
|----------------|-----------------|------------------------------------|
| `id`          | Integer         | Primary key                        |
| `description` | String(255)     | Deskripsi transaksi (opsional)     |
| `amount`      | Numeric(15,2)   | Jumlah pengeluaran                 |
| `date`        | Date            | Tanggal transaksi                  |
| `user_id`     | Integer         | Foreign key ke tabel `users`       |
| `category_id` | Integer         | Foreign key ke tabel `categories`  |
| `created_at`  | DateTime        | Waktu pembuatan transaksi          |
| `updated_at`  | DateTime        | Waktu terakhir pembaruan data      |

### Catatan
- Kolom yang bersifat opsional, seperti `description` pada tabel `categories` dan `transactions`, digunakan untuk memberikan fleksibilitas kepada pengguna. Misalnya, pengguna dapat memilih untuk tidak memberikan deskripsi pada kategori atau transaksi tertentu jika tidak diperlukan.

## Evaluasi Spesifikasi

### Backend
- **Bahasa & Framework:** Python 3.x & Pyramid → **Sudah diterapkan**
- **Arsitektur API:** RESTful API → **Sudah diterapkan**
- **Autentikasi:** JWT Authentication → **Sudah diterapkan**
- **Testing:** pytest (Target coverage minimal 60% untuk fungsi kritis) **sudah di evaluasi**

### Frontend
- **Library/Framework:** React JS (v18+) dengan Functional Components & Hooks → **Sudah diterapkan**
- **Build Tool:** Vite → **Sudah diterapkan**
- **Routing:** React Router DOM (v6+) → **Sudah diterapkan**
- **State Management:** Redux Toolkit → **Sudah diterapkan**
- **Styling:** MUI → **Sudah diterapkan**
- **API Client:** Axios → **Sudah diterapkan**

### Database
- **Sistem Manajemen Database Relasional (RDBMS):** PostgreSQL → **Sudah diterapkan**

### Bukti Evaluasi

Berikut adalah hasil evaluasi pengujian menggunakan pytest:

```plaintext
======================================================== test session starts ========================================================
platform win32 -- Python 3.11.11, pytest-8.3.5, pluggy-1.6.0 -- D:\Project\SakuBijak\backend\env\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Project\SakuBijak\backend\sakubijak_backend
configfile: pytest.ini
testpaths: sakubijak_backend
plugins: cov-6.1.1
collected 18 items

sakubijak_backend/tests_views.py::TestModels::test_category_model PASSED                                                       [  5%]
sakubijak_backend/tests_views.py::TestModels::test_transaction_model PASSED                                                    [ 11%]
sakubijak_backend/tests_views.py::TestModels::test_user_model PASSED                                                           [ 16%]
sakubijak_backend/tests_views.py::TestAuthentication::test_login_invalid_credentials PASSED                                    [ 22%]
sakubijak_backend/tests_views.py::TestAuthentication::test_login_success PASSED                                                [ 27%]
sakubijak_backend/tests_views.py::TestAuthentication::test_register_duplicate_email PASSED                                     [ 33%]
sakubijak_backend/tests_views.py::TestAuthentication::test_register_success SKIPPED (Skipping test_register_success due to...) [ 38%]
sakubijak_backend/tests_views.py::TestCategoryAPI::test_create_category PASSED                                                 [ 44%]
sakubijak_backend/tests_views.py::TestCategoryAPI::test_delete_category PASSED                                                 [ 50%]
sakubijak_backend/tests_views.py::TestCategoryAPI::test_get_category PASSED                                                    [ 55%]
sakubijak_backend/tests_views.py::TestCategoryAPI::test_list_categories PASSED                                                 [ 61%]
sakubijak_backend/tests_views.py::TestCategoryAPI::test_update_category PASSED                                                 [ 66%]
sakubijak_backend/tests_views.py::TestTransactionAPI::test_create_transaction PASSED                                           [ 72%]
sakubijak_backend/tests_views.py::TestTransactionAPI::test_delete_transaction PASSED                                           [ 77%]
sakubijak_backend/tests_views.py::TestTransactionAPI::test_get_transaction PASSED                                              [ 83%]
sakubijak_backend/tests_views.py::TestTransactionAPI::test_list_transactions PASSED                                            [ 88%]
sakubijak_backend/tests_views.py::TestTransactionAPI::test_update_transaction PASSED                                           [ 94%]
sakubijak_backend/tests_views.py::TestDashboard::test_dashboard_summary PASSED
```

Bukti gambar hasil pengujian di bawah ini.
![Bukti Pytest](./backend/sakubijak_backend/pytest.png)

*Gambar 1. Tampilan Pytest*

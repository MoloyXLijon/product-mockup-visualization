
# SKU Foundry Pro - Local Setup

## Prerequisites
1. PHP >= 8.2
2. Composer
3. Node.js & npm
4. MySQL Database (e.g., via WAMP/XAMPP/Docker)

## 1. Backend Setup (Laravel)

Open a terminal in the root directory:

```bash
# Install PHP dependencies
composer install

# Create environment file (if you haven't already)
cp .env.example .env

# Generate Application Key
php artisan key:generate

# Configure your database in .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
# Then run migrations:
php artisan migrate

# Start the Laravel Server (Port 8000)
php artisan serve
```

## 2. Frontend Setup (React/Vite)

Open a **new** terminal in the root directory:

```bash
# Install Node dependencies
npm install

# Start the Vite Development Server (Port 5173)
npm run dev
```

## 3. Access
Open your browser to: `http://localhost:5173`

The frontend (5173) will proxy API requests to the backend (8000).

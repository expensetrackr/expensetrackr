# ExpenseTrackr

ExpenseTrackr is an open-source personal and team finance application built with Laravel and React. It helps you manage your finances by tracking multiple accounts, investments, and expenses in one place, with support for multiple users and workspaces.

## Features

- 🏢 **Multi-workspace Support**: Manage multiple financial spaces for different purposes (personal, family, team)
- 👥 **User Management**: Support for admin and member roles with varying permissions
- 💰 **Multiple Account Types**:
    - Depository (Checking/Savings accounts)
    - Investment accounts (Brokerage, 401k)
    - Crypto wallets
    - Credit Cards
    - Loans
    - Other assets and liabilities
- 💱 **Multi-currency Support**: Track finances across different currencies
- 🔄 **Real-time Updates**: Built with Inertia.js for seamless Laravel + React integration
- 🎨 **Modern UI**: Beautiful and responsive interface built with TailwindCSS and Radix UI
- 📊 **Admin Dashboard**: Powered by FilamentPHP for easy management

## Prerequisites

Before you begin, ensure you have the following installed:

- PHP 8.2 or higher
- Composer
- Node.js 20 or higher (check `.nvmrc` for exact version)
- PostgreSQL 15 or higher
- Docker (optional, for containerized setup)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/expensetrackr.git
cd expensetrackr
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install Node.js dependencies:

```bash
npm install
# or if you prefer bun
bun install
```

4. Copy the environment file and configure your environment variables:

```bash
cp .env.example .env
```

5. Generate application key:

```bash
php artisan key:generate
```

6. Set up your database in the `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=expensetrackr
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

7. Run database migrations:

```bash
php artisan migrate
```

8. Run database seeders (required for roles):

```bash
php artisan db:seed
```

9. Build frontend assets:

```bash
npm run build
# or with bun
bun run build
```

## Development

To start the development server:

1. Run Laravel's development server:

```bash
php artisan serve
```

2. In another terminal, start the Vite development server:

```bash
npm run dev
# or with bun
bun run dev
```

### Docker Setup

If you prefer using Docker, we provide Docker Compose files for both development and production:

1. Development:

```bash
docker-compose up -d
```

2. Production:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Testing

We use PestPHP for testing. To run the tests:

```bash
./vendor/bin/pest
```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Conventions

1. **Minimize Dependencies**: We prefer vanilla Laravel solutions when possible
2. **Laravel Design Patterns**: We follow MVC, Action/Command, Facades, and Repository patterns
3. **Server-side First**: We prioritize server-side solutions over client-side ones
4. **Code Clarity**: We optimize for simplicity and clarity over performance
5. **Native HTML**: We prefer semantic, native HTML features when possible
6. **Testing**: All new features should include PestPHP tests

## License

This project is licensed under the [MIT License](LICENSE).

## Support

If you discover a security vulnerability, please send an e-mail via our GitHub issues. All security vulnerabilities will be promptly addressed.

## Credits

ExpenseTrackr is inspired by and built upon the shoulders of giants. Special thanks to:

- [Laravel](https://laravel.com)
- [Inertia.js](https://inertiajs.com)
- [React](https://reactjs.org)
- [FilamentPHP](https://filamentphp.com)
- [TailwindCSS](https://tailwindcss.com)
- And all other [dependencies](composer.json)

# Database Configuration for Hostinger

## Your Hostinger Database Credentials

Based on your Hostinger database setup, here are your database credentials:

```
Database Host: localhost
Database Name: u984847094_foundyourpath
Database User: u984847094_foundyourpath
Database Password: Seif0674&
Database Port: 3306
```

## Environment Variables Setup

Create a `.env.local` file in your project root with these values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3VpZGluZy1ibG93ZmlzaC05MS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_BuEuAZFNfzuJUmELwQPnqibXTR7bgfsE55ymM5LKZ5

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIzaSyCQqVPdDJrf46Ir8DKfGfhf8xiEZswge5E

# Dodo Payments
DODO_PAYMENTS_API_KEY=ndMWxSKKYucRnb5U.EywoIEcX7WaQ8t9l1RJFI5roAITuAKhHD_PobEbwwmyBRYL4

# Hostinger
HOSTINGER_API_TOKEN=2BQGAMYJUBP3DAakNBEQzD8eR0WDX40jdqpC9wiccf7dd6fd

# Database - Hostinger MySQL
DB_HOST=localhost
DB_USER=u984847094_foundyourpath
DB_PASSWORD=Seif0674&
DB_NAME=u984847094_foundyourpath
DB_PORT=3306

# App URL
NEXT_PUBLIC_APP_URL=https://foundyourpath.aizetecc.com
```

## Next Steps

1. **Create the .env.local file** with the above content
2. **Test the database connection** by running the setup
3. **Initialize the database schema** with seed data
4. **Deploy to Hostinger**

## Database Setup Commands

```bash
# Test database connection
npm run dev

# Setup database schema and seed data
curl -X POST http://localhost:3000/api/setup
```

## Database Schema

The setup will create these tables:
- `users` - User accounts (synced with Clerk)
- `ideas` - Business ideas submitted by users
- `responses` - Q&A responses from users
- `paths` - Generated business paths
- `resources` - Curated resources and recommendations
- `resource_categories` - Resource categories
- `user_preferences` - User settings and preferences
- `analytics` - User interaction tracking
- `payments` - Payment transactions

## Verification

After setup, you can verify the database by:
1. Checking the Hostinger MySQL database in your control panel
2. Running the application and testing user registration
3. Checking the admin dashboard for data

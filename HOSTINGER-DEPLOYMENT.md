# Hostinger Deployment Guide

## Database Setup on Hostinger

Your database has been created successfully on Hostinger:
- **Database Name**: `u984847094_foundyourpath`
- **Username**: `u984847094_foundyourpath`
- **Password**: `Seif0674&`
- **Host**: `localhost` (when running on Hostinger server)

## Deployment Steps

### 1. Upload Your Project Files

1. **Access Hostinger File Manager** or use FTP
2. **Navigate to your domain folder** (`public_html` or your domain folder)
3. **Upload all project files** from your local `found-your-path` folder

### 2. Set Up Environment Variables

Create a `.env.local` file on Hostinger with:

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

# Database - Hostinger MySQL (localhost when running on server)
DB_HOST=localhost
DB_USER=u984847094_foundyourpath
DB_PASSWORD=Seif0674&
DB_NAME=u984847094_foundyourpath
DB_PORT=3306

# App URL
NEXT_PUBLIC_APP_URL=https://foundyourpath.aizetecc.com
```

### 3. Install Dependencies on Hostinger

SSH into your Hostinger account and run:

```bash
cd /path/to/your/project
npm install
```

### 4. Build the Application

```bash
npm run build
```

### 5. Set Up Database Schema

Create a database setup script on Hostinger and run it:

```bash
# Create setup-database.js on Hostinger
node setup-database.js
```

### 6. Configure Node.js on Hostinger

1. **Go to Hostinger Control Panel**
2. **Navigate to "Node.js"**
3. **Set Node.js version to 18.x**
4. **Set start command to**: `npm start`
5. **Set application root to**: your project folder

### 7. Test the Application

1. **Visit your domain**: `https://foundyourpath.aizetecc.com`
2. **Test user registration**
3. **Test idea submission**
4. **Test path generation**
5. **Test payment flow**

## Database Schema Setup Script for Hostinger

Create this file as `setup-database.js` on your Hostinger server:

```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'u984847094_foundyourpath',
  password: 'Seif0674&',
  database: 'u984847094_foundyourpath',
  port: 3306
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Hostinger MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Create all tables here (same as the setup-database.js file)
    // ... (include all the table creation code)
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
```

## Alternative: Use Hostinger Database Manager

1. **Go to Hostinger Control Panel**
2. **Navigate to "MySQL Databases"**
3. **Click on "phpMyAdmin"**
4. **Select your database**: `u984847094_foundyourpath`
5. **Go to "SQL" tab**
6. **Run the database schema SQL** (provided in the setup script)

## Verification Steps

After deployment, verify:

1. **Database Connection**: Check if tables are created
2. **User Registration**: Test Clerk authentication
3. **AI Integration**: Test idea analysis
4. **Payment System**: Test Dodo Payments integration
5. **Admin Panel**: Access `/admin` route

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Verify database credentials in `.env.local`
   - Check if database exists in Hostinger control panel
   - Ensure database user has proper permissions

2. **Build Errors**:
   - Check Node.js version (should be 18.x)
   - Verify all dependencies are installed
   - Check for missing environment variables

3. **Permission Issues**:
   - Ensure file permissions are correct
   - Check if Node.js has access to database

## Support

If you encounter issues:
1. Check Hostinger error logs
2. Verify all environment variables
3. Test database connection from Hostinger server
4. Contact Hostinger support if needed

Your Found Your Path platform should be live at `https://foundyourpath.aizetecc.com` once deployed!

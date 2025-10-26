# Deployment Guide - Found Your Path

This guide will help you deploy the Found Your Path platform to Hostinger.

## Prerequisites

1. **Hostinger Account**: Premium hosting plan
2. **Domain**: `foundyourpath.aizetecc.com` (already configured)
3. **API Keys**: All provided in the project
4. **Database**: MySQL database access

## Step 1: Environment Setup

### 1.1 Create Environment File

Create `.env.local` in the project root:

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

# Database (Update with your Hostinger MySQL credentials)
DB_HOST=localhost
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_NAME=foundyourpath
DB_PORT=3306

# App URL
NEXT_PUBLIC_APP_URL=https://foundyourpath.aizetecc.com
```

### 1.2 Install Dependencies

```bash
npm install
```

## Step 2: Database Setup

### 2.1 Create MySQL Database

1. Log into your Hostinger control panel
2. Go to "MySQL Databases"
3. Create a new database named `foundyourpath`
4. Create a database user with full privileges
5. Update the database credentials in `.env.local`

### 2.2 Initialize Database Schema

```bash
# Start the development server
npm run dev

# In another terminal, setup the database
npm run setup-db
```

## Step 3: Build and Test

### 3.1 Build the Application

```bash
npm run build
```

### 3.2 Test Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the application.

## Step 4: Deploy to Hostinger

### 4.1 Using the Deployment Script

```bash
npm run deploy
```

This will:
- Build the application
- Create a deployment package
- Upload to Hostinger
- Configure the domain

### 4.2 Manual Deployment (Alternative)

If the automated script doesn't work:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload files to Hostinger**:
   - Upload the `.next` folder to your domain's public_html
   - Upload `package.json` and `package-lock.json`
   - Upload the `public` folder

3. **Configure Node.js**:
   - In Hostinger control panel, go to "Node.js"
   - Set Node.js version to 18.x
   - Set start command to `npm start`
   - Set application root to your domain folder

4. **Install dependencies**:
   ```bash
   npm install --production
   ```

## Step 5: Post-Deployment Configuration

### 5.1 Verify Database Connection

1. Visit `https://foundyourpath.aizetecc.com/api/setup`
2. Check that database tables are created successfully

### 5.2 Test Key Features

1. **Landing Page**: Visit the homepage
2. **Authentication**: Test sign-up/sign-in
3. **AI Analysis**: Submit a test idea
4. **Path Generation**: Complete the Q&A flow
5. **Payment**: Test the payment flow (use test mode)
6. **Admin Panel**: Access `/admin` with admin privileges

### 5.3 Configure SSL

Ensure SSL is enabled in your Hostinger control panel for secure connections.

## Step 6: Production Optimizations

### 6.1 Environment Variables

Update production environment variables in Hostinger:
- Set `NODE_ENV=production`
- Update database credentials
- Verify all API keys are correct

### 6.2 Performance

- Enable gzip compression
- Configure CDN if available
- Monitor application performance

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Verify database credentials
   - Check if database exists
   - Ensure database user has proper permissions

2. **Build Errors**:
   - Check Node.js version (should be 18.x)
   - Clear `.next` folder and rebuild
   - Verify all dependencies are installed

3. **Payment Integration Issues**:
   - Verify Dodo Payments API key
   - Check webhook configuration
   - Test with sandbox mode first

4. **AI Integration Problems**:
   - Verify Google AI API key
   - Check API quota limits
   - Monitor API response times

### Support

If you encounter issues:

1. Check the application logs in Hostinger
2. Verify all environment variables
3. Test individual API endpoints
4. Contact support with specific error messages

## Monitoring

### Key Metrics to Monitor

1. **User Registration**: Track new user signups
2. **Idea Submissions**: Monitor idea analysis requests
3. **Payment Success**: Track successful payments
4. **Error Rates**: Monitor API error rates
5. **Performance**: Track page load times

### Admin Dashboard

Access the admin dashboard at `/admin` to:
- View user statistics
- Monitor payment transactions
- Manage resources
- Track platform usage

## Security Considerations

1. **API Keys**: Keep all API keys secure
2. **Database**: Use strong database passwords
3. **SSL**: Ensure HTTPS is enabled
4. **Updates**: Keep dependencies updated
5. **Monitoring**: Set up error monitoring

## Backup Strategy

1. **Database Backups**: Regular MySQL backups
2. **File Backups**: Backup application files
3. **Configuration**: Backup environment variables
4. **Code**: Use version control (Git)

## Success Checklist

- [ ] Application builds successfully
- [ ] Database tables created
- [ ] Authentication working
- [ ] AI integration functional
- [ ] Payment system operational
- [ ] Admin dashboard accessible
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Backup strategy implemented

Your Found Your Path platform should now be live at `https://foundyourpath.aizetecc.com`!

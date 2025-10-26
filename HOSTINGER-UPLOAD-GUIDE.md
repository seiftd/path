# Hostinger Upload Guide

## Files to Upload to public_html Folder

You need to upload these files and folders from your `found-your-path` project to the `public_html` folder in Hostinger:

### 📁 **Essential Files & Folders**

```
public_html/
├── src/                    # Source code folder
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   └── locales/           # Translation files
├── public/                # Static assets
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
├── middleware.ts          # Clerk middleware
├── .env.local             # Environment variables (create this)
└── database-schema.sql    # Database setup file
```

### 🚫 **DO NOT Upload These**
- `node_modules/` (too large, will be installed on server)
- `.next/` (build folder, will be created on server)
- `.git/` (version control, not needed)
- `README.md` (documentation, not needed for production)

### 📝 **Step-by-Step Upload Process**

1. **Go to Hostinger File Manager**
2. **Navigate to public_html folder**
3. **Upload these files one by one:**
   - Upload `src/` folder (entire folder)
   - Upload `public/` folder (entire folder)
   - Upload `package.json`
   - Upload `package-lock.json`
   - Upload `next.config.js`
   - Upload `tailwind.config.js`
   - Upload `tsconfig.json`
   - Upload `middleware.ts`
   - Upload `database-schema.sql`

4. **Create .env.local file in Hostinger:**
   ```
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

### 🔧 **After Upload - Configure on Hostinger**

1. **Install Dependencies:**
   - Go to Hostinger Control Panel
   - Navigate to "Node.js"
   - Set Node.js version to 18.x
   - Run: `npm install`

2. **Build the Application:**
   - Run: `npm run build`

3. **Start the Application:**
   - Set start command to: `npm start`
   - Set application root to: your domain folder

4. **Database Setup:**
   - Your database tables are already created ✅
   - Database is ready to use ✅

### 🌐 **Final Result**

After completing these steps, your website will be live at:
**https://foundyourpath.aizetecc.com**

### 📊 **What You'll Have**

- ✅ Complete Next.js application
- ✅ Database with all tables and seed data
- ✅ AI integration (Google Gemini)
- ✅ Payment system (Dodo Payments)
- ✅ User authentication (Clerk)
- ✅ Multi-language support (EN/FR/AR)
- ✅ Admin dashboard
- ✅ Resource management system

### 🆘 **If You Need Help**

1. **File Upload Issues**: Use Hostinger's file manager or FTP
2. **Build Errors**: Check Node.js version (should be 18.x)
3. **Database Issues**: Verify credentials in .env.local
4. **Permission Issues**: Check file permissions in Hostinger

Your Found Your Path platform will be fully functional once uploaded!

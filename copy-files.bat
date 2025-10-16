@echo off
echo Copying remaining files...

copy ..\found-your-path\tailwind.config.js .
copy ..\found-your-path\tsconfig.json .
copy ..\found-your-path\middleware.ts .
copy ..\found-your-path\database-schema.sql .

echo Creating .env.local file...

echo # Clerk Authentication > .env.local
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3VpZGluZy1ibG93ZmlzaC05MS5jbGVyay5hY2NvdW50cy5kZXYk >> .env.local
echo CLERK_SECRET_KEY=sk_test_BuEuAZFNfzuJUmELwQPnqibXTR7bgfsE55ymM5LKZ5 >> .env.local
echo. >> .env.local
echo # Google AI (Gemini) >> .env.local
echo GOOGLE_AI_API_KEY=AIzaSyCQqVPdDJrf46Ir8DKfGfhf8xiEZswge5E >> .env.local
echo. >> .env.local
echo # Dodo Payments >> .env.local
echo DODO_PAYMENTS_API_KEY=ndMWxSKKYucRnb5U.EywoIEcX7WaQ8t9l1RJFI5roAITuAKhHD_PobEbwwmyBRYL4 >> .env.local
echo. >> .env.local
echo # Hostinger >> .env.local
echo HOSTINGER_API_TOKEN=2BQGAMYJUBP3DAakNBEQzD8eR0WDX40jdqpC9wiccf7dd6fd >> .env.local
echo. >> .env.local
echo # Database - Hostinger MySQL >> .env.local
echo DB_HOST=localhost >> .env.local
echo DB_USER=u984847094_foundyourpath >> .env.local
echo DB_PASSWORD=Seif0674^& >> .env.local
echo DB_NAME=u984847094_foundyourpath >> .env.local
echo DB_PORT=3306 >> .env.local
echo. >> .env.local
echo # App URL >> .env.local
echo NEXT_PUBLIC_APP_URL=https://foundyourpath.aizetecc.com >> .env.local

echo.
echo ✅ All files copied successfully!
echo ✅ .env.local file created with your database credentials!
echo.
echo 📁 Your hostinger-ready folder is ready for upload!
echo.
pause

# Found Your Path - Interactive Idea Incubation Platform

A multi-language AI-powered web platform that guides users through developing their business ideas into structured, actionable project plans.

## Features

- 🌍 **Multi-language Support**: English, French, and Arabic with RTL support
- 🤖 **AI-Powered Analysis**: Google Gemini AI for idea analysis and Q&A generation
- 🎨 **Dynamic Visual Paths**: Interactive roadmaps with multiple themes (Tree, Assembly Line, Circuit Board)
- 📄 **Professional PDF Reports**: Download complete business blueprints for $2
- 💳 **Secure Payments**: Integrated with Dodo Payments
- 👥 **User Management**: Clerk authentication with admin dashboard
- 📊 **Analytics**: Comprehensive admin panel with user statistics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL (Hostinger)
- **AI**: Google Gemini AI
- **Auth**: Clerk.com
- **Payments**: Dodo Payments
- **Deployment**: Hostinger

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

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

# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=foundyourpath
DB_PORT=3306

# App URL
NEXT_PUBLIC_APP_URL=https://foundyourpath.aizetecc.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. Create a MySQL database named `foundyourpath`
2. Update the database credentials in `.env.local`
3. Run the database setup:

```bash
curl -X POST http://localhost:3000/api/setup
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Hostinger

### 1. Build the Application

```bash
npm run build
```

### 2. Deploy to Hostinger

```bash
node deploy.js
```

### 3. Configure Domain

The deployment script will automatically configure your domain at `foundyourpath.aizetecc.com`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── ui/                # Shadcn/UI components
│   ├── path-visualizations/ # Path visualization components
│   └── providers/         # Context providers
├── lib/                    # Utility libraries
│   ├── db.ts              # Database connection
│   ├── ai.ts              # AI integration
│   ├── payment.ts         # Payment integration
│   └── pdf-generator.ts   # PDF generation
└── locales/               # Translation files
    ├── en.json
    ├── fr.json
    └── ar.json
```

## Key Features Implementation

### 1. Multi-language Support

- Uses `react-i18next` for internationalization
- Supports RTL layout for Arabic
- Dynamic language switching

### 2. AI Integration

- Google Gemini AI for idea analysis
- Dynamic question generation
- Contextual responses based on idea category

### 3. Dynamic Path Visualization

- **Tree Theme**: For agriculture/nature-related ideas
- **Assembly Line Theme**: For manufacturing/automotive ideas  
- **Circuit Board Theme**: For technology/tech ideas

### 4. Payment Integration

- Dodo Payments API integration
- $2 USD one-time payment for PDF download
- Secure payment verification

### 5. PDF Generation

- Professional PDF reports using jsPDF
- Includes all user input, analysis, and resources
- Branded and ready for sharing

## API Endpoints

- `POST /api/ai/analyze` - Analyze business idea
- `POST /api/ai/questions` - Generate questions
- `POST /api/path/generate` - Generate path visualization
- `POST /api/pdf/generate` - Generate PDF report
- `POST /api/payment/checkout` - Create payment
- `POST /api/payment/verify` - Verify payment
- `POST /api/setup` - Setup database

## Admin Dashboard

Access the admin dashboard at `/admin` with admin privileges to:

- View user statistics and analytics
- Manage generated paths and ideas
- Update resource recommendations
- Monitor payment transactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, contact the development team or check the documentation.
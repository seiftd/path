# 🚀 Found Your Path - Interactive Idea Incubation Platform

**Transform your business ideas into structured, actionable project plans with AI-powered guidance.**

[![Deploy Status](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green)](https://github.com/seiftd/path)
[![Next.js](https://img.shields.io/badge/Next.js-14+-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4+-blue)](https://tailwindcss.com/)

## 🌟 Features

### 🤖 **AI-Powered Analysis**
- Google Gemini AI integration for intelligent idea analysis
- Dynamic question generation based on idea category
- Conversational chat interface for user Q&A

### 🎨 **Dynamic Path Visualization**
- **Tree Theme**: For agriculture/nature ideas (branches, leaves, blossoms)
- **Assembly Line Theme**: For manufacturing/automotive ideas (stations, conveyor)
- **Circuit Board Theme**: For technology ideas (connections, power flow)
- Interactive nodes with progress tracking

### 🌍 **Multi-Language Support**
- English, French, and Arabic with RTL support
- Dynamic language switching
- Complete translation system

### 💳 **Payment & Monetization**
- Dodo Payments integration
- $2 USD one-time payment for PDF download
- Secure payment verification

### 👥 **User Management**
- Clerk authentication with middleware
- User dashboard with idea management
- Admin panel with analytics and resource management

### 📄 **Professional Reports**
- Complete business blueprint PDF generation
- Professional branding and layout
- Includes all user input, analysis, and resources

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL (Hostinger)
- **AI**: Google Gemini AI
- **Auth**: Clerk.com
- **Payments**: Dodo Payments
- **Deployment**: Hostinger

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x
- MySQL database
- Clerk account
- Google AI API key
- Dodo Payments account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/seiftd/path.git
   cd path
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up database**
   ```bash
   # Run the database schema in your MySQL database
   mysql -u your_username -p your_database < database-schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Shadcn/UI components
│   ├── path-visualizations/ # Path visualization components
│   └── providers/         # Context providers
├── lib/                   # Utility libraries
│   ├── db.ts              # Database connection
│   ├── ai.ts              # AI integration
│   ├── payment.ts         # Payment integration
│   └── pdf-generator.ts   # PDF generation
└── locales/               # Translation files
    ├── en.json
    ├── fr.json
    └── ar.json
```

## 🎯 Key Features Implementation

### 1. **Multi-language Support**
- Uses `react-i18next` for internationalization
- Supports RTL layout for Arabic
- Dynamic language switching

### 2. **AI Integration**
- Google Gemini AI for idea analysis
- Dynamic question generation
- Contextual responses based on idea category

### 3. **Dynamic Path Visualization**
- **Tree Theme**: For agriculture/nature-related ideas
- **Assembly Line Theme**: For manufacturing/automotive ideas  
- **Circuit Board Theme**: For technology/tech ideas

### 4. **Payment Integration**
- Dodo Payments API integration
- $2 USD one-time payment for PDF download
- Secure payment verification

### 5. **PDF Generation**
- Professional PDF reports using jsPDF
- Includes all user input, analysis, and resources
- Branded and ready for sharing

## 🔧 API Endpoints

- `POST /api/ai/analyze` - Analyze business idea
- `POST /api/ai/questions` - Generate questions
- `POST /api/path/generate` - Generate path visualization
- `POST /api/pdf/generate` - Generate PDF report
- `POST /api/payment/checkout` - Create payment
- `POST /api/payment/verify` - Verify payment
- `POST /api/setup` - Setup database

## 🎨 Admin Dashboard

Access the admin dashboard at `/admin` with admin privileges to:

- View user statistics and analytics
- Manage generated paths and ideas
- Update resource recommendations
- Monitor payment transactions

## 🚀 Deployment

### Hostinger Deployment

1. **Upload files** to your Hostinger `public_html` directory
2. **Configure Node.js** (version 18.x, start command: `npm start`)
3. **Install dependencies**: `npm install`
4. **Build application**: `npm run build`
5. **Start application**: `npm start`

### Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_gemini_key

# Dodo Payments
DODO_PAYMENTS_API_KEY=your_dodo_key

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📊 Database Schema

The application includes a complete MySQL schema with:
- Users table (synced with Clerk)
- Ideas and responses tables
- Paths and progress tracking
- Resources and categories
- Payments and analytics
- User preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, contact the development team or check the documentation.

## 🌐 Live Demo

Your Found Your Path platform will be live at: **https://foundyourpath.aizetecc.com**

---

**Built with ❤️ for entrepreneurs and innovators**
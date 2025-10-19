# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google AI API Key (Primary AI service)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# OpenAI API Key (Fallback AI service - Optional but recommended)
OPENAI_API_KEY=your_openai_api_key_here

# Clerk Authentication (Development keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Database URL (for production)
DATABASE_URL=your_database_url_here

# Dodo Payments API Key
DODO_PAYMENTS_API_KEY=your_dodo_payments_api_key_here

# Next.js Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## How to Get OpenAI API Key (Fallback)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or sign in to your account
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local` file
6. **Note**: You'll need to add payment method for OpenAI usage (starts with $5 credit)

## How to Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select existing one
3. Go to "API Keys" section
4. Copy the publishable key and secret key
5. Add them to your `.env.local` file

## How to Get Dodo Payments API Key

1. Go to [Dodo Payments Dashboard](https://dashboard.dodopayments.com/)
2. Sign in to your account
3. Go to "API Keys" section
4. Generate a new API key
5. Add it to your `.env.local` file

## Important Notes

- Never commit `.env.local` to version control
- Make sure to restart your development server after adding environment variables
- For production deployment, add these variables to your hosting platform's environment settings
- **AI Service Priority**: Google AI is used first, OpenAI is used as fallback
- **Cost**: Google AI is free, OpenAI requires payment (starts with $5 credit)
- **Reliability**: Having both services ensures maximum uptime for AI features

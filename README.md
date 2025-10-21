# Datrix™ Business Intelligence Scanner

A comprehensive business intelligence assessment system designed for the garment manufacturing industry, featuring user registration, email verification, and a **60-question assessment framework across 7 categories**.

## 🎯 Overview

Datrix™ is a professional business intelligence scanning system that helps garment manufacturing businesses assess their operational maturity across seven key categories:

- **Business Strategy & Vision** - Long-term direction and competitive positioning
- **Sales, Marketing & Customer Management** - Revenue generation and client relationships
- **Operations & Production Management** - Manufacturing efficiency and quality control
- **Supply Chain & Vendor Management** - Sourcing and inventory management
- **Financial Management & Cost Control** - Profitability and cash flow
- **Technology & Digitalisation** - Technology adoption and digital systems
- **HR & Organisational Culture** - People management and workplace culture

## 🏗️ System Architecture

### Frontend
- **Framework**: React.js with Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Email verification with Resend
- **Real-time**: Supabase real-time subscriptions
- **Storage**: Supabase Storage for assets

### Database
- **Platform**: Supabase
- **Features**: Row Level Security (RLS), Real-time subscriptions
- **Tables**: Users, Assessments, Assessment Questions, Assessment Categories, Assessment Responses

## 📁 Project Structure

```
datrix-business-intelligence/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── UserRegistration.jsx
│   │   │   ├── AssessmentV2.jsx
│   │   │   ├── ResultsComplete.jsx
│   │   │   ├── AdminInvitations.jsx
│   │   │   └── PrivacyPolicy.jsx
│   │   ├── lib/
│   │   │   └── supabase.js  # Supabase client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── database/                 # Database schema and migrations
│   ├── COMPLETE_60_QUESTIONS_7_CATEGORIES.sql
│   └── supabase_schema.sql
│
└── docs/                     # Documentation
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- Resend account (for email verification)
- Git

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your Supabase and API credentials
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Database Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Run the SQL schema from `database/COMPLETE_60_QUESTIONS_7_CATEGORIES.sql` in the Supabase SQL Editor
4. Update the `.env` file with your Supabase credentials

## 🔑 Environment Variables

### Frontend (.env)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Resend Email API
VITE_RESEND_API_KEY=your-resend-api-key

# OpenAI API (for future AI features)
VITE_OPENAI_API_KEY=your-openai-api-key
```

## 📊 Features

### User Features
- ✅ User registration with email verification
- ✅ 60-question business assessment across 7 categories
- ✅ Detailed results with category breakdown
- ✅ Grade-based performance evaluation (A, B, C, D)
- ✅ Intelligent recommendations based on scores
- ✅ Category-wise performance analysis

### Admin Features
- ✅ Assessment invitation management
- ✅ Token-based assessment access
- ✅ User approval workflow
- ✅ Assessment monitoring
- ✅ Results tracking

## 🔐 Security Features

- Row Level Security (RLS) policies in Supabase
- Email verification for user registration
- Token-based assessment access
- Secure API endpoints with Supabase authentication
- Environment variable protection for sensitive data

## 📱 User Flow

1. **Registration**: User fills out registration form with business details
2. **Verification**: User receives email verification code and verifies account
3. **Assessment**: User takes 60-question assessment via invitation token
4. **Submission**: System calculates scores, grades, and generates recommendations
5. **Results**: User receives detailed analysis with category breakdowns

## 🎨 Branding

The system features professional Datrix™ branding with:
- Custom color scheme (Blue gradients)
- Professional typography
- Responsive design for all devices
- Modern UI components from shadcn/ui

## 📈 Assessment Categories

1. **Business Strategy & Vision** (8 questions)
2. **Sales, Marketing & Customer Management** (9 questions)
3. **Operations & Production Management** (10 questions)
4. **Supply Chain & Vendor Management** (8 questions)
5. **Financial Management & Cost Control** (9 questions)
6. **Technology & Digitalisation** (8 questions)
7. **HR & Organisational Culture** (8 questions)

**Total: 60 Questions**

## 🎯 Grading System

- **A Grade**: ≥85% - Exceptional Performance
- **B Grade**: ≥70% - Strong Performance
- **C Grade**: ≥55% - Adequate Performance
- **D Grade**: <55% - Needs Improvement

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- React Router v6
- Supabase JS Client

**Backend:**
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions
- Resend (Email service)

## 🚢 Deployment

### Vercel Deployment

1. Import GitHub repository to Vercel
2. Set **Root Directory** to `frontend`
3. Set **Framework Preset** to `Vite`
4. Add environment variables
5. Deploy

### Environment Variables for Vercel

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=your-resend-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
```

## 📄 License

Copyright © 2025 Navvi Corporation. All rights reserved.

## 🤝 Support

For support, email support@navvicorp.com

## 👥 Credits

Developed by the Navvi Technology Team  
Powered by Datrix™ Business Intelligence Platform

---

**Version**: 3.0.0  
**Last Updated**: October 21, 2025  
**Status**: Production Ready


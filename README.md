# Datrix™ Business Intelligence Scanner

A comprehensive business intelligence assessment system designed for the garment manufacturing industry, featuring user registration, admin approval workflows, and a 27-question assessment framework.

## 🎯 Overview

Datrix™ is a professional business intelligence scanning system that helps garment manufacturing businesses assess their operational maturity across six key categories:

- **Financial Management** - Cash flow, budgeting, and cost control
- **Operations Management** - Production processes and quality control
- **Human Resources** - Recruitment, training, and workplace safety
- **Marketing & Sales** - Brand positioning and customer relationships
- **Strategic Management** - Business strategy and innovation
- **Risk Management** - Risk assessment and crisis management

## 🏗️ System Architecture

### Frontend
- **Framework**: React.js with Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend
- **Framework**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Email/SMS verification
- **API**: RESTful API with CORS support

### Database
- **Platform**: Supabase
- **Features**: Row Level Security (RLS), Real-time subscriptions
- **Tables**: Users, Assessments, Admin Users, System Logs, and more

## 📁 Project Structure

```
datrix-complete-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── UserRegistration.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── PrivacyPolicy.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Flask backend API
│   ├── src/
│   │   ├── config/          # Configuration modules
│   │   │   └── database.py  # Supabase configuration
│   │   ├── routes/          # API route handlers
│   │   │   ├── user.py      # User management routes
│   │   │   ├── admin.py     # Admin panel routes
│   │   │   └── assessment.py # Assessment routes
│   │   └── main.py          # Flask application entry point
│   ├── requirements.txt
│   └── .env.example
│
├── database/                 # Database schema and migrations
│   └── supabase_schema.sql  # Complete Supabase schema
│
└── docs/                     # Documentation
    ├── SETUP.md             # Setup instructions
    ├── API.md               # API documentation
    └── DEPLOYMENT.md        # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+
- Supabase account
- Git

### Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env
# Edit .env with your API URL
pnpm dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
python src/main.py
```

The backend API will be available at `http://localhost:5000`

### Database Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and API keys
3. Run the SQL schema from `database/supabase_schema.sql` in the Supabase SQL Editor
4. Update the `.env` file in the backend with your Supabase credentials

## 🔑 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
FLASK_SECRET_KEY=your-secret-key
FLASK_ENV=development
```

## 📊 Features

### User Features
- ✅ User registration with email/mobile verification
- ✅ Admin approval workflow
- ✅ 27-question business assessment
- ✅ Detailed results with category breakdown
- ✅ Grade-based performance evaluation (A, B, C, D)
- ✅ Industry benchmarking

### Admin Features
- ✅ Dashboard with real-time statistics
- ✅ User management (approve/reject)
- ✅ Assessment monitoring
- ✅ System logs and audit trail
- ✅ Assessment token generation

## 🔐 Security Features

- Row Level Security (RLS) policies in Supabase
- Email/SMS verification for user registration
- Admin approval required before assessment access
- Secure API endpoints with authentication
- Environment variable protection for sensitive data

## 📱 User Flow

1. **Registration**: User fills out registration form
2. **Verification**: User receives and enters verification code
3. **Admin Approval**: Admin reviews and approves user
4. **Assessment**: Approved user takes 27-question assessment
5. **Results**: User receives detailed analysis and recommendations

## 🎨 Branding

The system features professional Navvi branding with:
- Custom color scheme (Blue and Purple gradients)
- Professional typography
- Responsive design for all devices
- Modern UI components

## 📈 Assessment Categories

1. **Financial Management** (5 questions)
2. **Operations Management** (6 questions)
3. **Human Resources** (4 questions)
4. **Marketing & Sales** (5 questions)
5. **Strategic Management** (5 questions)
6. **Risk Management** (2 questions)

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- React Router

**Backend:**
- Flask 3.0
- Supabase Python Client
- Flask-CORS
- Python-dotenv

**Database:**
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions

## 📝 API Endpoints

### User Routes
- `POST /api/register` - Register new user
- `POST /api/verify` - Verify user account
- `GET /api/check-approval/:userId` - Check approval status
- `GET /api/user/:userId` - Get user details

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/approve-user/:userId` - Approve user
- `POST /api/admin/reject-user/:userId` - Reject user
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/assessments` - Get all assessments
- `GET /api/admin/system-logs` - Get system logs

### Assessment Routes
- `POST /api/submit-assessment` - Submit assessment
- `GET /api/assessment-results/:userId` - Get assessment results

## 🚢 Deployment

### Frontend Deployment (Manus.space)
```bash
cd frontend
pnpm build
# Deploy the dist/ folder to Manus.space
```

### Backend Deployment (Manus.space)
```bash
cd backend
# Deploy using Manus deploy tool
```

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## 📄 License

Copyright © 2025 Navvi Corporation. All rights reserved.

## 🤝 Support

For support, email admin@navvicorp.com or visit our support portal.

## 👥 Credits

Developed by the Navvi Technology Team
Powered by Datrix™ Business Intelligence Platform

---

**Version**: 2.0.0  
**Last Updated**: October 14, 2025  
**Status**: Production Ready


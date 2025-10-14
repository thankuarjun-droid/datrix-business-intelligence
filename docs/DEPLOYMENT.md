# Datrix™ Deployment Guide

This guide covers deploying the Datrix Business Intelligence Scanner to production.

## Prerequisites

- Supabase project configured
- Domain name (optional but recommended)
- Manus.space account or other hosting platform

## Frontend Deployment

### Build for Production

```bash
cd frontend
pnpm install
pnpm build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Manus.space

The frontend can be deployed as a static site:

1. Navigate to frontend directory
2. Run build command
3. Deploy the `dist/` folder

### Environment Variables

Update `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Backend Deployment

### Prepare for Deployment

```bash
cd backend
pip freeze > requirements.txt
```

### Deploy to Manus.space

The Flask backend can be deployed as a Python application.

### Environment Variables

Set these in your hosting platform:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
FLASK_SECRET_KEY=your-production-secret-key
FLASK_ENV=production
```

## Database Configuration

Your Supabase database is already hosted. Ensure:

1. RLS policies are enabled
2. API keys are properly configured
3. Default admin password is changed

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong FLASK_SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS for specific origins
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure monitoring and logging

## Post-Deployment

1. Test all user flows
2. Verify admin panel access
3. Test assessment submission
4. Monitor error logs
5. Set up automated backups

---

**Deployment Version**: 2.0.0  
**Last Updated**: October 14, 2025


# Email Integration Setup Guide

The Datrix™ system now includes email notification functionality. Follow this guide to configure email sending.

## Option 1: Gmail (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "Datrix System" as the name
4. Click "Generate"
5. Copy the 16-character password (no spaces)

### Step 3: Configure Environment Variables
Add these to your `.env` file:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Datrix Business Intelligence
```

---

## Option 2: SendGrid (Recommended for Production)

### Step 1: Create SendGrid Account
1. Go to: https://signup.sendgrid.com/
2. Sign up for free account (100 emails/day free)
3. Verify your email address

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Choose "Full Access"
4. Copy the API key

### Step 3: Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Verify a Single Sender
3. Enter your email and details
4. Verify the email sent to you

### Step 4: Configure Environment Variables
Add these to your `.env` file:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=verified-email@yourdomain.com
FROM_NAME=Datrix Business Intelligence
```

---

## Option 3: AWS SES (For High Volume)

### Step 1: Set Up AWS SES
1. Go to AWS Console → SES
2. Verify your domain or email
3. Request production access (starts in sandbox mode)

### Step 2: Create SMTP Credentials
1. In SES Console, go to "SMTP Settings"
2. Click "Create My SMTP Credentials"
3. Download the credentials

### Step 3: Configure Environment Variables
```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=verified-email@yourdomain.com
FROM_NAME=Datrix Business Intelligence
```

---

## Testing Email Configuration

After configuring, test by registering a new user. You should receive:
1. **Verification Email** - Sent immediately after registration
2. **Approval Email** - Sent when admin approves the account

---

## Email Templates Included

The system includes professional HTML email templates for:

### 1. Verification Email
- Clean, branded design
- Large verification code display
- Security reminders
- Mobile-responsive

### 2. Approval Email
- Congratulations message
- Direct link to assessment
- Assessment token
- Next steps guide

---

## Troubleshooting

### Emails Not Sending?
1. Check SMTP credentials are correct
2. Verify FROM_EMAIL is verified with your provider
3. Check server logs for error messages
4. Ensure port 587 is not blocked by firewall

### Gmail "Less Secure Apps" Error?
- Use App Password instead of regular password
- Enable 2-Factor Authentication first

### SendGrid Emails Going to Spam?
- Verify your domain (not just email)
- Set up SPF and DKIM records
- Warm up your sending reputation gradually

---

## Current Status

✅ Email service module created
✅ Verification email template ready
✅ Approval email template ready
✅ Integration with registration flow
✅ Integration with admin approval flow

⏳ Waiting for SMTP configuration

---

## Quick Start (Gmail)

For quick testing with Gmail:

1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Update `.env` file:
   ```
   SMTP_USER=youremail@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_EMAIL=youremail@gmail.com
   ```
4. Redeploy the application
5. Test by registering a new user

---

**Need help?** Contact support or check the logs for detailed error messages.


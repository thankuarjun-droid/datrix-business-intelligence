# Datrix™ API Documentation

Complete API reference for the Datrix Business Intelligence Scanner system.

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-domain.com/api`

## User Management Endpoints

### POST /register
Register a new user in the system.

### POST /verify
Verify user account with verification code.

### GET /check-approval/:userId
Check if user has been approved by admin.

### GET /user/:userId
Get user profile information.

## Admin Management Endpoints

### GET /admin/users
Get all users with optional filtering.

### POST /admin/approve-user/:userId
Approve a verified user and generate assessment token.

### POST /admin/reject-user/:userId
Reject a user application.

### GET /admin/dashboard-stats
Get admin dashboard statistics.

### GET /admin/assessments
Get all completed assessments with user information.

### GET /admin/system-logs
Get system audit logs.

---

**API Version**: 2.0.0  
**Last Updated**: October 14, 2025


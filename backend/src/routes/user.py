"""
Datrix™ Business Intelligence Scanner
User Management Routes with Supabase Integration
"""

from flask import Blueprint, request, jsonify
import random
import string
from datetime import datetime
from src.config.database import get_supabase_client, get_service_client

user_bp = Blueprint('user', __name__)

def generate_verification_code():
    """Generate 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def generate_assessment_token():
    """Generate unique assessment token"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

@user_bp.route('/register', methods=['POST'])
def register_user():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'mobile', 'business_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Check if user already exists
        existing_user = supabase.table('users').select('*').eq('email', data['email']).execute()
        if existing_user.data:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Generate verification code
        verification_code = generate_verification_code()
        
        # Create user record
        user_data = {
            'full_name': data['full_name'],
            'designation': data.get('designation', ''),
            'email': data['email'],
            'mobile': data['mobile'],
            'business_name': data['business_name'],
            'business_type': data.get('business_type', 'Garment Manufacturing'),
            'verification_code': verification_code,
            'is_verified': False,
            'is_approved': False,
            'status': 'pending'
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        if result.data:
            user = result.data[0]
            
            # TODO: Send verification code via email/SMS
            # For now, return it in response (remove in production)
            
            return jsonify({
                'success': True,
                'message': 'Registration successful. Please verify your account.',
                'user_id': user['id'],
                'verification_code': verification_code  # Remove in production
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/verify', methods=['POST'])
def verify_user():
    """Verify user with verification code"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        verification_code = data.get('verification_code')
        
        if not user_id or not verification_code:
            return jsonify({'error': 'User ID and verification code are required'}), 400
        
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get user
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        # Check verification code
        if user['verification_code'] != verification_code:
            return jsonify({'error': 'Invalid verification code'}), 400
        
        # Update user status to verified
        update_result = supabase.table('users').update({
            'is_verified': True,
            'status': 'verified'
        }).eq('id', user_id).execute()
        
        if update_result.data:
            return jsonify({
                'success': True,
                'message': 'Account verified successfully. Awaiting admin approval.',
                'status': 'verified'
            }), 200
        else:
            return jsonify({'error': 'Failed to verify user'}), 500
            
    except Exception as e:
        print(f"Verification error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/check-approval/<user_id>', methods=['GET'])
def check_approval_status(user_id):
    """Check if user is approved by admin"""
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        return jsonify({
            'is_approved': user['is_approved'],
            'status': user['status'],
            'assessment_token': user.get('assessment_token')
        }), 200
        
    except Exception as e:
        print(f"Check approval error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user details"""
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        # Remove sensitive data
        user.pop('verification_code', None)
        
        return jsonify(user), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({'error': str(e)}), 500


import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Load environment variables from .env file
from pathlib import Path
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()

from flask import Flask, send_from_directory, jsonify, request
from routes.enhanced_routes import enhanced_bp
from flask_cors import CORS
import random
import string
from datetime import datetime
from src.config.supabase_client import get_supabase_client
from src.services.email_service import get_email_service

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.register_blueprint(enhanced_bp)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'datrix-professional-secret-key-2024')

# Enable CORS for all routes
CORS(app, origins=['*'])

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

def generate_assessment_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    supabase = get_supabase_client()
    return jsonify({
        'status': 'healthy',
        'service': 'Datrix Business Intelligence Scanner API',
        'version': '2.0.0',
        'database': 'supabase' if supabase else 'disconnected'
    }), 200

# User registration
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        required_fields = ['full_name', 'email', 'mobile', 'business_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Check if user exists
        existing = supabase.select('users', filters={'email': data['email']})
        if existing:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        verification_code = generate_verification_code()
        
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
        
        result = supabase.insert('users', user_data)
        
        if result and 'error' not in result:
            # Send verification email
            email_service = get_email_service()
            email_service.send_verification_email(
                data['email'],
                data['full_name'],
                verification_code
            )
            
            return jsonify({
                'success': True,
                'message': 'Registration successful. Please verify your account.',
                'user_id': result.get('id'),
                'verification_code': verification_code
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# User verification
@app.route('/api/verify', methods=['POST'])
def verify_user():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        verification_code = data.get('verification_code')
        
        if not user_id or not verification_code:
            return jsonify({'error': 'User ID and verification code are required'}), 400
        
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        users = supabase.select('users', filters={'id': user_id})
        if not users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[0]
        
        if user.get('verification_code') != verification_code:
            return jsonify({'error': 'Invalid verification code'}), 400
        
        update_data = {
            'is_verified': True,
            'status': 'verified'
        }
        
        result = supabase.update('users', update_data, {'id': user_id})
        
        if result and 'error' not in result:
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

# Check approval status
@app.route('/api/check-approval/<user_id>', methods=['GET'])
def check_approval_status(user_id):
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        users = supabase.select('users', filters={'id': user_id})
        if not users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[0]
        
        return jsonify({
            'is_approved': user.get('is_approved', False),
            'status': user.get('status'),
            'assessment_token': user.get('assessment_token')
        }), 200
        
    except Exception as e:
        print(f"Check approval error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get user details
@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        users = supabase.select('users', filters={'id': user_id})
        if not users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[0]
        user.pop('verification_code', None)
        
        return jsonify(user), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Get all users
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        status = request.args.get('status')
        filters = {'status': status} if status else None
        
        users = supabase.select('users', filters=filters, use_service_key=True)
        
        for user in users:
            user.pop('verification_code', None)
        
        return jsonify({
            'success': True,
            'users': users,
            'count': len(users)
        }), 200
            
    except Exception as e:
        print(f"Get users error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Approve user
@app.route('/api/admin/approve-user/<user_id>', methods=['POST'])
def approve_user(user_id):
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        users = supabase.select('users', filters={'id': user_id}, use_service_key=True)
        if not users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[0]
        
        if not user.get('is_verified'):
            return jsonify({'error': 'User must be verified before approval'}), 400
        
        assessment_token = generate_assessment_token()
        
        update_data = {
            'is_approved': True,
            'status': 'approved',
            'assessment_token': assessment_token
        }
        
        result = supabase.update('users', update_data, {'id': user_id}, use_service_key=True)
        
        if result and 'error' not in result:
            # Send approval email
            email_service = get_email_service()
            assessment_url = f"{os.getenv('APP_URL', 'https://vgh0i1c3lzj5.manus.space')}/assessment?token={assessment_token}"
            email_service.send_approval_email(
                user.get('email'),
                user.get('full_name'),
                assessment_token,
                assessment_url
            )
            
            # Log the action
            log_data = {
                'user_id': user_id,
                'action': 'user_approved',
                'details': {'approved_user': user.get('email'), 'assessment_token_generated': True}
            }
            supabase.insert('system_logs', log_data, use_service_key=True)
            
            return jsonify({
                'success': True,
                'message': 'User approved successfully',
                'assessment_token': assessment_token
            }), 200
        else:
            return jsonify({'error': 'Failed to approve user'}), 500
            
    except Exception as e:
        print(f"Approve user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Reject user
@app.route('/api/admin/reject-user/<user_id>', methods=['POST'])
def reject_user(user_id):
    try:
        data = request.get_json() or {}
        reason = data.get('reason', 'Not specified')
        
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        users = supabase.select('users', filters={'id': user_id}, use_service_key=True)
        if not users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[0]
        
        update_data = {'status': 'suspended'}
        result = supabase.update('users', update_data, {'id': user_id}, use_service_key=True)
        
        if result and 'error' not in result:
            log_data = {
                'user_id': user_id,
                'action': 'user_rejected',
                'details': {'rejected_user': user.get('email'), 'reason': reason}
            }
            supabase.insert('system_logs', log_data, use_service_key=True)
            
            return jsonify({
                'success': True,
                'message': 'User rejected successfully'
            }), 200
        else:
            return jsonify({'error': 'Failed to reject user'}), 500
            
    except Exception as e:
        print(f"Reject user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Dashboard stats
@app.route('/api/admin/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        pending = supabase.count('users', {'status': 'pending'}, use_service_key=True)
        verified = supabase.count('users', {'status': 'verified'}, use_service_key=True)
        approved = supabase.count('users', {'status': 'approved'}, use_service_key=True)
        
        stats = {
            'pending_users': pending,
            'verified_users': verified,
            'approved_users': approved,
            'assessments_last_30_days': 0,
            'new_users_last_7_days': 0
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Dashboard stats error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Get assessments
@app.route('/api/admin/assessments', methods=['GET'])
def get_all_assessments():
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        assessments = supabase.select('assessments', use_service_key=True)
        
        return jsonify({
            'success': True,
            'assessments': assessments,
            'count': len(assessments)
        }), 200
        
    except Exception as e:
        print(f"Get assessments error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: System logs
@app.route('/api/admin/system-logs', methods=['GET'])
def get_system_logs():
    try:
        supabase = get_supabase_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        logs = supabase.select('system_logs', use_service_key=True)
        
        return jsonify({
            'success': True,
            'logs': logs,
            'count': len(logs)
        }), 200
        
    except Exception as e:
        print(f"Get logs error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Serve static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


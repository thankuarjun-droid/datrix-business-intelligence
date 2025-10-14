import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random
import string
from datetime import datetime
import uuid

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'datrix-professional-secret-key-2024')

# Enable CORS for all routes
CORS(app, origins=['*'])

# In-memory storage (for demo purposes)
users_db = {}
assessments_db = {}
admin_stats = {
    'pending_users': 0,
    'verified_users': 0,
    'approved_users': 0,
    'assessments_last_30_days': 0,
    'new_users_last_7_days': 0
}

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

def generate_assessment_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Datrix Business Intelligence Scanner API',
        'version': '2.0.0',
        'mode': 'demo'
    }), 200

# User registration
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'mobile', 'business_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if data['email'] in [u.get('email') for u in users_db.values()]:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Generate verification code
        verification_code = generate_verification_code()
        user_id = str(uuid.uuid4())
        
        # Create user record
        users_db[user_id] = {
            'id': user_id,
            'full_name': data['full_name'],
            'designation': data.get('designation', ''),
            'email': data['email'],
            'mobile': data['mobile'],
            'business_name': data['business_name'],
            'business_type': data.get('business_type', 'Garment Manufacturing'),
            'verification_code': verification_code,
            'is_verified': False,
            'is_approved': False,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        admin_stats['pending_users'] += 1
        
        return jsonify({
            'success': True,
            'message': 'Registration successful. Please verify your account.',
            'user_id': user_id,
            'verification_code': verification_code  # For demo only
        }), 201
            
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
        
        if user_id not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        user = users_db[user_id]
        
        if user['verification_code'] != verification_code:
            return jsonify({'error': 'Invalid verification code'}), 400
        
        # Update user status
        user['is_verified'] = True
        user['status'] = 'verified'
        user['updated_at'] = datetime.now().isoformat()
        
        admin_stats['pending_users'] -= 1
        admin_stats['verified_users'] += 1
        
        return jsonify({
            'success': True,
            'message': 'Account verified successfully. Awaiting admin approval.',
            'status': 'verified'
        }), 200
            
    except Exception as e:
        print(f"Verification error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Check approval status
@app.route('/api/check-approval/<user_id>', methods=['GET'])
def check_approval_status(user_id):
    try:
        if user_id not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        user = users_db[user_id]
        
        return jsonify({
            'is_approved': user['is_approved'],
            'status': user['status'],
            'assessment_token': user.get('assessment_token')
        }), 200
        
    except Exception as e:
        print(f"Check approval error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get user details
@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        if user_id not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        user = users_db[user_id].copy()
        user.pop('verification_code', None)
        
        return jsonify(user), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Get all users
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        status = request.args.get('status')
        
        users_list = list(users_db.values())
        
        if status:
            users_list = [u for u in users_list if u['status'] == status]
        
        # Remove sensitive data
        for user in users_list:
            user.pop('verification_code', None)
        
        return jsonify({
            'success': True,
            'users': users_list,
            'count': len(users_list)
        }), 200
            
    except Exception as e:
        print(f"Get users error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Approve user
@app.route('/api/admin/approve-user/<user_id>', methods=['POST'])
def approve_user(user_id):
    try:
        if user_id not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        user = users_db[user_id]
        
        if not user['is_verified']:
            return jsonify({'error': 'User must be verified before approval'}), 400
        
        # Generate assessment token
        assessment_token = generate_assessment_token()
        
        # Update user status
        user['is_approved'] = True
        user['status'] = 'approved'
        user['assessment_token'] = assessment_token
        user['updated_at'] = datetime.now().isoformat()
        
        admin_stats['verified_users'] -= 1
        admin_stats['approved_users'] += 1
        
        return jsonify({
            'success': True,
            'message': 'User approved successfully',
            'assessment_token': assessment_token
        }), 200
            
    except Exception as e:
        print(f"Approve user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Reject user
@app.route('/api/admin/reject-user/<user_id>', methods=['POST'])
def reject_user(user_id):
    try:
        data = request.get_json() or {}
        reason = data.get('reason', 'Not specified')
        
        if user_id not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        user = users_db[user_id]
        
        # Update user status
        user['status'] = 'suspended'
        user['updated_at'] = datetime.now().isoformat()
        
        if user.get('is_verified'):
            admin_stats['verified_users'] -= 1
        else:
            admin_stats['pending_users'] -= 1
        
        return jsonify({
            'success': True,
            'message': 'User rejected successfully'
        }), 200
            
    except Exception as e:
        print(f"Reject user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Dashboard stats
@app.route('/api/admin/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        return jsonify({
            'success': True,
            'stats': admin_stats
        }), 200
        
    except Exception as e:
        print(f"Dashboard stats error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: Get assessments
@app.route('/api/admin/assessments', methods=['GET'])
def get_all_assessments():
    try:
        assessments_list = list(assessments_db.values())
        
        return jsonify({
            'success': True,
            'assessments': assessments_list,
            'count': len(assessments_list)
        }), 200
        
    except Exception as e:
        print(f"Get assessments error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Admin: System logs
@app.route('/api/admin/system-logs', methods=['GET'])
def get_system_logs():
    try:
        return jsonify({
            'success': True,
            'logs': [],
            'count': 0
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


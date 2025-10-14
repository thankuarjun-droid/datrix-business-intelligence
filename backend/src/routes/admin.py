"""
Datrix™ Business Intelligence Scanner
Admin Management Routes with Supabase Integration
"""

from flask import Blueprint, request, jsonify
import random
import string
from datetime import datetime
from src.config.database import get_supabase_client, get_service_client

admin_bp = Blueprint('admin', __name__)

def generate_assessment_token():
    """Generate unique assessment token"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

@admin_bp.route('/users', methods=['GET'])
def get_all_users():
    """Get all users with optional filtering"""
    try:
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get query parameters for filtering
        status = request.args.get('status')
        
        query = supabase.table('users').select('*')
        
        if status:
            query = query.eq('status', status)
        
        result = query.order('created_at', desc=True).execute()
        
        if result.data:
            # Remove sensitive data
            users = []
            for user in result.data:
                user.pop('verification_code', None)
                users.append(user)
            
            return jsonify({
                'success': True,
                'users': users,
                'count': len(users)
            }), 200
        else:
            return jsonify({
                'success': True,
                'users': [],
                'count': 0
            }), 200
            
    except Exception as e:
        print(f"Get users error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/approve-user/<user_id>', methods=['POST'])
def approve_user(user_id):
    """Approve a verified user and generate assessment token"""
    try:
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get user
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        # Check if user is verified
        if not user['is_verified']:
            return jsonify({'error': 'User must be verified before approval'}), 400
        
        # Generate assessment token
        assessment_token = generate_assessment_token()
        
        # Update user status to approved
        update_result = supabase.table('users').update({
            'is_approved': True,
            'status': 'approved',
            'assessment_token': assessment_token
        }).eq('id', user_id).execute()
        
        if update_result.data:
            # Log the action
            log_data = {
                'user_id': user_id,
                'action': 'user_approved',
                'details': {
                    'approved_user': user['email'],
                    'assessment_token_generated': True
                }
            }
            supabase.table('system_logs').insert(log_data).execute()
            
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

@admin_bp.route('/reject-user/<user_id>', methods=['POST'])
def reject_user(user_id):
    """Reject a user application"""
    try:
        data = request.get_json()
        reason = data.get('reason', 'Not specified')
        
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get user
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        # Update user status to suspended
        update_result = supabase.table('users').update({
            'status': 'suspended'
        }).eq('id', user_id).execute()
        
        if update_result.data:
            # Log the action
            log_data = {
                'user_id': user_id,
                'action': 'user_rejected',
                'details': {
                    'rejected_user': user['email'],
                    'reason': reason
                }
            }
            supabase.table('system_logs').insert(log_data).execute()
            
            return jsonify({
                'success': True,
                'message': 'User rejected successfully'
            }), 200
        else:
            return jsonify({'error': 'Failed to reject user'}), 500
            
    except Exception as e:
        print(f"Reject user error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get stats from the view
        stats_result = supabase.table('admin_dashboard_stats').select('*').execute()
        
        if stats_result.data and len(stats_result.data) > 0:
            stats = stats_result.data[0]
        else:
            # Fallback to manual counting
            pending = supabase.table('users').select('id', count='exact').eq('status', 'pending').execute()
            verified = supabase.table('users').select('id', count='exact').eq('status', 'verified').execute()
            approved = supabase.table('users').select('id', count='exact').eq('status', 'approved').execute()
            
            stats = {
                'pending_users': pending.count or 0,
                'verified_users': verified.count or 0,
                'approved_users': approved.count or 0,
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

@admin_bp.route('/assessments', methods=['GET'])
def get_all_assessments():
    """Get all assessments with user information"""
    try:
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # Get assessments with user data
        result = supabase.table('assessments').select(
            '*, users(full_name, email, business_name)'
        ).order('completed_at', desc=True).execute()
        
        return jsonify({
            'success': True,
            'assessments': result.data or [],
            'count': len(result.data) if result.data else 0
        }), 200
        
    except Exception as e:
        print(f"Get assessments error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/system-logs', methods=['GET'])
def get_system_logs():
    """Get system logs"""
    try:
        supabase = get_service_client()
        if not supabase:
            return jsonify({'error': 'Database connection not available'}), 500
        
        limit = request.args.get('limit', 100, type=int)
        
        result = supabase.table('system_logs').select('*').order(
            'created_at', desc=True
        ).limit(limit).execute()
        
        return jsonify({
            'success': True,
            'logs': result.data or [],
            'count': len(result.data) if result.data else 0
        }), 200
        
    except Exception as e:
        print(f"Get logs error: {str(e)}")
        return jsonify({'error': str(e)}), 500


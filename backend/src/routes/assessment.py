from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.models.assessment import db, User, Assessment
from datetime import datetime
import random
import string
import secrets

assessment_bp = Blueprint('assessment', __name__)

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def generate_assessment_token():
    """Generate a secure assessment token"""
    return secrets.token_urlsafe(32)

@assessment_bp.route('/user-registration', methods=['POST', 'OPTIONS'])
@cross_origin()
def user_registration():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'designation', 'email', 'mobile', 'businessName']
        for field in required_fields:
            if not data.get(field):
                response = jsonify({
                    'success': False,
                    'message': f'{field} is required'
                })
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            response = jsonify({
                'success': False,
                'message': 'User with this email already exists'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400
        
        # Generate verification code
        verification_code = generate_verification_code()
        
        # Create new user
        user = User(
            full_name=data['fullName'],
            designation=data['designation'],
            email=data['email'],
            mobile=data['mobile'],
            business_name=data['businessName'],
            business_type=data.get('businessType', 'Garment Manufacturing'),
            verification_code=verification_code
        )
        
        db.session.add(user)
        db.session.commit()
        
        # TODO: Send actual email and SMS
        # For now, we'll return the code for testing
        
        response = jsonify({
            'success': True,
            'message': 'Registration successful. Verification code sent.',
            'user_id': user.id,
            'verification_code': verification_code  # Remove in production
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201
        
    except Exception as e:
        db.session.rollback()
        response = jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@assessment_bp.route('/verify-user', methods=['POST', 'OPTIONS'])
@cross_origin()
def verify_user():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        email = data.get('email')
        verification_code = data.get('verification_code')
        
        if not email or not verification_code:
            response = jsonify({
                'success': False,
                'message': 'Email and verification code are required'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user:
            response = jsonify({
                'success': False,
                'message': 'User not found'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 404
        
        # Check verification code (accept both stored code and test code)
        if user.verification_code == verification_code or verification_code == '123456':
            user.is_verified = True
            user.verified_at = datetime.utcnow()
            db.session.commit()
            
            response = jsonify({
                'success': True,
                'message': 'Account verified successfully. Waiting for admin approval.',
                'user_id': user.id
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
        else:
            response = jsonify({
                'success': False,
                'message': 'Invalid verification code'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400
            
    except Exception as e:
        db.session.rollback()
        response = jsonify({
            'success': False,
            'message': f'Verification failed: {str(e)}'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@assessment_bp.route('/admin/pending-approvals', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_pending_approvals():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response
    
    try:
        # Get all verified but not approved users
        pending_users = User.query.filter_by(is_verified=True, is_approved=False).all()
        
        users_data = [user.to_dict() for user in pending_users]
        
        response = jsonify({
            'success': True,
            'users': users_data,
            'count': len(users_data)
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        response = jsonify({
            'success': False,
            'message': f'Failed to fetch pending approvals: {str(e)}'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@assessment_bp.route('/admin/approve-user/<int:user_id>', methods=['POST', 'OPTIONS'])
@cross_origin()
def approve_user(user_id):
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        user = User.query.get(user_id)
        if not user:
            response = jsonify({
                'success': False,
                'message': 'User not found'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 404
        
        if not user.is_verified:
            response = jsonify({
                'success': False,
                'message': 'User must be verified before approval'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400
        
        # Approve user and generate assessment token
        user.is_approved = True
        user.approved_at = datetime.utcnow()
        user.assessment_token = generate_assessment_token()
        
        db.session.commit()
        
        response = jsonify({
            'success': True,
            'message': 'User approved successfully',
            'assessment_token': user.assessment_token
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        db.session.rollback()
        response = jsonify({
            'success': False,
            'message': f'Approval failed: {str(e)}'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@assessment_bp.route('/submit-assessment', methods=['POST', 'OPTIONS'])
@cross_origin()
def submit_assessment():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.get_json()
        assessment_token = data.get('assessment_token')
        answers = data.get('answers', {})
        
        if not assessment_token:
            response = jsonify({
                'success': False,
                'message': 'Assessment token is required'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400
        
        # Find user by assessment token
        user = User.query.filter_by(assessment_token=assessment_token).first()
        if not user or not user.is_approved:
            response = jsonify({
                'success': False,
                'message': 'Invalid assessment token or user not approved'
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 403
        
        # Calculate scores
        total_score = sum(answers.values())
        max_score = len(answers) * 4
        overall_percentage = (total_score / max_score) * 100 if max_score > 0 else 0
        
        # Calculate category scores
        category_scores = calculate_category_scores(answers)
        
        # Create or update assessment
        assessment = Assessment.query.filter_by(user_id=user.id).first()
        if not assessment:
            assessment = Assessment(user_id=user.id)
            db.session.add(assessment)
        
        assessment.set_answers(answers)
        assessment.overall_score = total_score
        assessment.overall_percentage = overall_percentage
        assessment.set_category_scores(category_scores)
        assessment.is_completed = True
        assessment.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        response = jsonify({
            'success': True,
            'message': 'Assessment submitted successfully',
            'assessment_id': assessment.id,
            'overall_percentage': overall_percentage,
            'category_scores': category_scores
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201
        
    except Exception as e:
        db.session.rollback()
        response = jsonify({
            'success': False,
            'message': f'Assessment submission failed: {str(e)}'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

def calculate_category_scores(answers):
    """Calculate scores by category"""
    # Define question categories (based on question IDs)
    categories = {
        'Financial Management': [1, 2, 3, 4, 5],
        'Operations Management': [6, 7, 8, 9, 10, 11],
        'Human Resources': [12, 13, 14, 15],
        'Marketing & Sales': [16, 17, 18, 19, 20],
        'Strategic Management': [21, 22, 23, 24, 25],
        'Risk Management': [26, 27]
    }
    
    category_scores = {}
    
    for category, question_ids in categories.items():
        category_total = 0
        category_count = 0
        
        for q_id in question_ids:
            if str(q_id) in answers:
                category_total += answers[str(q_id)]
                category_count += 1
        
        if category_count > 0:
            category_percentage = (category_total / (category_count * 4)) * 100
            category_scores[category] = {
                'score': category_total,
                'max_score': category_count * 4,
                'percentage': round(category_percentage, 1)
            }
    
    return category_scores

@assessment_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    response = jsonify({
        'status': 'healthy',
        'service': 'Datrix Assessment API',
        'version': '1.0.0'
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200


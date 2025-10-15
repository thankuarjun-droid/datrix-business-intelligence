"""
Datrix™ Complete Assessment System - Backend API
67-Question Professional Assessment for Tirupur Garment Industry
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
import random
import string
from datetime import datetime, timedelta
import json

app = Flask(__name__, static_folder='../static')
CORS(app)

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://vboauggpscnkgsqwfccg.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib2F1Z2dwc2Nua2dzcXdmY2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzQ4MzAsImV4cCI6MjA3NTkxMDgzMH0.HagbaNRnqpRR3OiZF6KIZ8ZJTGk7oE6oF8_xYweBUSk')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib2F1Z2dwc2Nua2dzcXdmY2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzNDgzMCwiZXhwIjoyMDc1OTEwODMwfQ.1FDyPCK6hRdy8I_YAbpamkYWJa7q4-AWi5vyeiZQREM')

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def generate_code():
    return ''.join(random.choices(string.digits, k=6))

def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/users?select=count',
            headers=HEADERS,
            timeout=5
        )
        db_status = "supabase" if response.status_code == 200 else "disconnected"
    except:
        db_status = "disconnected"
    
    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'version': '3.0.0 - Complete 67 Questions'
    })

# ============================================================================
# USER REGISTRATION & VERIFICATION
# ============================================================================

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        verification_code = generate_code()
        
        user_data = {
            'full_name': data.get('fullName'),
            'designation': data.get('designation'),
            'email': data.get('email'),
            'mobile': data.get('mobile'),
            'business_name': data.get('businessName'),
            'business_type': data.get('businessType', 'Garment Manufacturing'),
            'verification_code': verification_code,
            'is_verified': False,
            'is_approved': False,
            'status': 'pending'
        }
        
        response = requests.post(
            f'{SUPABASE_URL}/rest/v1/users',
            headers=HEADERS,
            json=user_data
        )
        
        if response.status_code in [200, 201]:
            user = response.json()[0] if isinstance(response.json(), list) else response.json()
            return jsonify({
                'success': True,
                'message': 'Registration successful',
                'user_id': user['id'],
                'verification_code': verification_code
            })
        else:
            return jsonify({'success': False, 'error': 'Registration failed'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/verify', methods=['POST'])
def verify_user():
    try:
        data = request.json
        user_id = data.get('user_id')
        code = data.get('code')
        
        # Get user
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/users?id=eq.{user_id}',
            headers=HEADERS
        )
        
        if response.status_code == 200 and response.json():
            user = response.json()[0]
            
            if user['verification_code'] == code:
                # Update user as verified
                update_response = requests.patch(
                    f'{SUPABASE_URL}/rest/v1/users?id=eq.{user_id}',
                    headers=HEADERS,
                    json={'is_verified': True, 'status': 'verified'}
                )
                
                if update_response.status_code == 200:
                    return jsonify({
                        'success': True,
                        'message': 'Verification successful'
                    })
            
            return jsonify({'success': False, 'error': 'Invalid verification code'}), 400
        
        return jsonify({'success': False, 'error': 'User not found'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# ASSESSMENT - GET QUESTIONS
# ============================================================================

@app.route('/api/assessment/questions', methods=['GET'])
def get_assessment_questions():
    try:
        token = request.args.get('token')
        
        if not token:
            return jsonify({'error': 'Token required'}), 400
        
        # Verify token and get user
        user_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/users?assessment_token=eq.{token}',
            headers=HEADERS
        )
        
        if user_response.status_code != 200 or not user_response.json():
            return jsonify({'error': 'Invalid token'}), 403
        
        user = user_response.json()[0]
        
        # Get categories
        categories_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_categories?is_active=eq.true&order=display_order.asc',
            headers=HEADERS
        )
        
        if categories_response.status_code != 200:
            return jsonify({'error': 'Failed to fetch categories'}), 500
        
        categories = categories_response.json()
        
        # Get all questions
        questions_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_questions?is_active=eq.true&order=display_order.asc',
            headers=HEADERS
        )
        
        if questions_response.status_code != 200:
            return jsonify({'error': 'Failed to fetch questions'}), 500
        
        questions = questions_response.json()
        
        # Organize questions by category
        assessment_data = {
            'user': {
                'name': user['full_name'],
                'business': user['business_name'],
                'email': user['email']
            },
            'categories': []
        }
        
        for category in categories:
            category_questions = [q for q in questions if q['category_id'] == category['id']]
            assessment_data['categories'].append({
                'id': category['id'],
                'name': category['name'],
                'description': category['description'],
                'weight': category['weight'],
                'questions': category_questions
            })
        
        return jsonify(assessment_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# ASSESSMENT - SUBMIT RESPONSES
# ============================================================================

@app.route('/api/assessment/submit', methods=['POST'])
def submit_assessment():
    try:
        data = request.json
        token = data.get('token')
        responses = data.get('responses', {})
        
        if not token:
            return jsonify({'error': 'Token required'}), 400
        
        # Get user
        user_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/users?assessment_token=eq.{token}',
            headers=HEADERS
        )
        
        if user_response.status_code != 200 or not user_response.json():
            return jsonify({'error': 'Invalid token'}), 403
        
        user = user_response.json()[0]
        user_id = user['id']
        
        # Get all questions to calculate scores
        questions_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_questions?is_active=eq.true',
            headers=HEADERS
        )
        
        questions = questions_response.json()
        
        # Get categories
        categories_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_categories?is_active=eq.true',
            headers=HEADERS
        )
        
        categories = categories_response.json()
        
        # Calculate scores
        total_score = 0
        max_possible_score = 0
        category_scores = {}
        
        for category in categories:
            category_questions = [q for q in questions if q['category_id'] == category['id']]
            category_score = 0
            category_max = 0
            
            for question in category_questions:
                q_id = question['id']
                max_score = question['max_score']
                response_value = responses.get(q_id, 0)
                
                category_score += response_value
                category_max += max_score
                total_score += response_value
                max_possible_score += max_score
                
                # Save individual response
                response_data = {
                    'user_id': user_id,
                    'question_id': q_id,
                    'response_value': response_value
                }
                
                requests.post(
                    f'{SUPABASE_URL}/rest/v1/assessment_responses',
                    headers=HEADERS,
                    json=response_data
                )
            
            category_percentage = (category_score / category_max * 100) if category_max > 0 else 0
            category_scores[category['name']] = {
                'score': category_score,
                'max_score': category_max,
                'percentage': round(category_percentage, 2)
            }
        
        # Calculate overall percentage
        percentage = (total_score / max_possible_score * 100) if max_possible_score > 0 else 0
        
        # Determine grade
        if percentage >= 85:
            grade = 'A'
            tier = 'World Class'
        elif percentage >= 75:
            grade = 'B'
            tier = 'Industry Leader'
        elif percentage >= 65:
            grade = 'C'
            tier = 'Competitive'
        elif percentage >= 50:
            grade = 'D'
            tier = 'Developing'
        else:
            grade = 'F'
            tier = 'Emerging'
        
        # Generate insights and recommendations
        insights = generate_insights(category_scores, percentage)
        recommendations = generate_recommendations(category_scores)
        
        # Save assessment
        assessment_data = {
            'user_id': user_id,
            'answers': responses,
            'total_score': total_score,
            'max_score': max_possible_score,
            'percentage': round(percentage, 2),
            'overall_grade': grade,
            'category_scores': category_scores,
            'insights': insights,
            'recommendations': recommendations,
            'performance_tier': tier
        }
        
        assessment_response = requests.post(
            f'{SUPABASE_URL}/rest/v1/assessments',
            headers=HEADERS,
            json=assessment_data
        )
        
        if assessment_response.status_code in [200, 201]:
            assessment = assessment_response.json()[0] if isinstance(assessment_response.json(), list) else assessment_response.json()
            
            return jsonify({
                'success': True,
                'assessment_id': assessment['id'],
                'total_score': total_score,
                'max_score': max_possible_score,
                'percentage': round(percentage, 2),
                'grade': grade,
                'tier': tier,
                'category_scores': category_scores,
                'insights': insights,
                'recommendations': recommendations
            })
        else:
            return jsonify({'error': 'Failed to save assessment'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_insights(category_scores, overall_percentage):
    """Generate professional insights based on scores"""
    insights = {
        'overall': '',
        'strengths': [],
        'improvement_areas': []
    }
    
    # Overall insight
    if overall_percentage >= 85:
        insights['overall'] = 'Exceptional performance! Your organization demonstrates world-class capabilities across multiple dimensions.'
    elif overall_percentage >= 75:
        insights['overall'] = 'Strong performance! You are among the industry leaders with solid operational excellence.'
    elif overall_percentage >= 65:
        insights['overall'] = 'Competitive positioning with good fundamentals. Focus on targeted improvements for leadership position.'
    elif overall_percentage >= 50:
        insights['overall'] = 'Developing capabilities with significant growth potential. Strategic improvements needed.'
    else:
        insights['overall'] = 'Emerging stage with substantial improvement opportunities. Immediate action recommended.'
    
    # Identify strengths and weaknesses
    for category, scores in category_scores.items():
        if scores['percentage'] >= 75:
            insights['strengths'].append(f"{category}: {scores['percentage']:.1f}% - Strong capability")
        elif scores['percentage'] < 60:
            insights['improvement_areas'].append(f"{category}: {scores['percentage']:.1f}% - Needs attention")
    
    return insights

def generate_recommendations(category_scores):
    """Generate actionable recommendations"""
    recommendations = []
    
    for category, scores in category_scores.items():
        percentage = scores['percentage']
        
        if category == 'Financial Health' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'High',
                'action': 'Implement robust financial tracking systems and explore working capital optimization strategies'
            })
        
        if category == 'Production Excellence' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'High',
                'action': 'Invest in automation, quality systems, and lean manufacturing practices to improve efficiency'
            })
        
        if category == 'Supply Chain' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'Medium',
                'action': 'Diversify supplier base and implement digital supply chain visibility tools'
            })
        
        if category == 'Sales & Marketing' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'Medium',
                'action': 'Develop digital presence, diversify customer base, and strengthen brand positioning'
            })
        
        if category == 'Compliance & Sustainability' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'High',
                'action': 'Pursue key certifications (GOTS, OEKO-TEX) and implement sustainability initiatives'
            })
        
        if category == 'Human Capital' and percentage < 70:
            recommendations.append({
                'category': category,
                'priority': 'Medium',
                'action': 'Enhance training programs, improve retention strategies, and invest in employee welfare'
            })
    
    return recommendations[:5]  # Return top 5 recommendations

# ============================================================================
# ADMIN ROUTES
# ============================================================================

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/users?order=created_at.desc',
            headers=HEADERS
        )
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'users': response.json(),
                'count': len(response.json())
            })
        
        return jsonify({'error': 'Failed to fetch users'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/approve-user/<user_id>', methods=['POST'])
def approve_user(user_id):
    try:
        assessment_token = generate_token()
        
        update_data = {
            'is_approved': True,
            'status': 'approved',
            'assessment_token': assessment_token
        }
        
        response = requests.patch(
            f'{SUPABASE_URL}/rest/v1/users?id=eq.{user_id}',
            headers=HEADERS,
            json=update_data
        )
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'message': 'User approved',
                'assessment_token': assessment_token
            })
        
        return jsonify({'error': 'Failed to approve user'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/assessments', methods=['GET'])
def get_all_assessments():
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessments?order=created_at.desc',
            headers=HEADERS
        )
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'assessments': response.json(),
                'count': len(response.json())
            })
        
        return jsonify({'error': 'Failed to fetch assessments'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/questions', methods=['GET'])
def get_all_questions():
    try:
        # Get categories
        categories_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_categories?order=display_order.asc',
            headers=HEADERS
        )
        
        # Get questions
        questions_response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assessment_questions?order=display_order.asc',
            headers=HEADERS
        )
        
        if categories_response.status_code == 200 and questions_response.status_code == 200:
            return jsonify({
                'success': True,
                'categories': categories_response.json(),
                'questions': questions_response.json()
            })
        
        return jsonify({'error': 'Failed to fetch questions'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SERVE FRONTEND
# ============================================================================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)


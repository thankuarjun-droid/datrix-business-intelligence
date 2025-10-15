"""
Enhanced API routes for Datrix™ with professional reporting
"""

from flask import Blueprint, request, jsonify, send_file
from src.config.supabase_client import SupabaseClient
from src.services.report_generator import ReportGenerator
from src.services.pdf_service import PDFReportGenerator
from src.models.enhanced_assessment import ENHANCED_ASSESSMENT_QUESTIONS
import os
import uuid
from datetime import datetime

enhanced_bp = Blueprint('enhanced', __name__)
supabase = SupabaseClient()

@enhanced_bp.route('/api/assessment/questions', methods=['GET'])
def get_assessment_questions():
    """Get enhanced assessment questions"""
    return jsonify({
        'success': True,
        'questions': ENHANCED_ASSESSMENT_QUESTIONS
    })

@enhanced_bp.route('/api/assessment/submit', methods=['POST'])
def submit_assessment():
    """Submit assessment and generate report"""
    try:
        data = request.json
        user_id = data.get('user_id')
        token = data.get('token')
        answers = data.get('answers', {})
        
        # Verify user
        if token:
            user_result = supabase.query('users', {'assessment_token': token})
            if not user_result or len(user_result) == 0:
                return jsonify({'success': False, 'error': 'Invalid token'}), 400
            user_data = user_result[0]
            user_id = user_data['id']
        else:
            user_result = supabase.query('users', {'id': user_id})
            if not user_result or len(user_result) == 0:
                return jsonify({'success': False, 'error': 'User not found'}), 404
            user_data = user_result[0]
        
        # Calculate scores
        total_score = sum(answers.values())
        max_score = len(answers) * 4  # Assuming 0-4 scale
        percentage = (total_score / max_score * 100) if max_score > 0 else 0
        
        # Determine grade
        if percentage >= 85:
            grade = 'A'
        elif percentage >= 75:
            grade = 'B'
        elif percentage >= 65:
            grade = 'C'
        elif percentage >= 50:
            grade = 'D'
        else:
            grade = 'F'
        
        # Save assessment
        assessment_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'answers': answers,
            'total_score': total_score,
            'max_score': max_score,
            'percentage': round(percentage, 2),
            'overall_grade': grade,
            'completed_at': datetime.now().isoformat(),
            'created_at': datetime.now().isoformat()
        }
        
        supabase.insert('assessments', assessment_data)
        
        # Generate report data
        report_data = ReportGenerator.generate_report_data(user_data, assessment_data)
        
        return jsonify({
            'success': True,
            'assessment_id': assessment_data['id'],
            'overall_score': round(percentage, 1),
            'grade': grade,
            'report_data': report_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@enhanced_bp.route('/api/assessment/report/<assessment_id>/pdf', methods=['GET'])
def download_pdf_report(assessment_id):
    """Generate and download PDF report"""
    try:
        # Get assessment
        assessment_result = supabase.query('assessments', {'id': assessment_id})
        if not assessment_result or len(assessment_result) == 0:
            return jsonify({'success': False, 'error': 'Assessment not found'}), 404
        
        assessment_data = assessment_result[0]
        
        # Get user data
        user_result = supabase.query('users', {'id': assessment_data['user_id']})
        if not user_result or len(user_result) == 0:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        user_data = user_result[0]
        
        # Generate report data
        report_data = ReportGenerator.generate_report_data(user_data, assessment_data)
        
        # Generate PDF
        pdf_generator = PDFReportGenerator()
        pdf_filename = f"Datrix_Report_{user_data.get('business_name', 'Company').replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        pdf_path = f"/tmp/{pdf_filename}"
        
        pdf_generator.generate_pdf(report_data, pdf_path)
        
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=pdf_filename
        )
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@enhanced_bp.route('/api/assessment/report/<assessment_id>', methods=['GET'])
def get_report_data(assessment_id):
    """Get report data for web display"""
    try:
        # Get assessment
        assessment_result = supabase.query('assessments', {'id': assessment_id})
        if not assessment_result or len(assessment_result) == 0:
            return jsonify({'success': False, 'error': 'Assessment not found'}), 404
        
        assessment_data = assessment_result[0]
        
        # Get user data
        user_result = supabase.query('users', {'id': assessment_data['user_id']})
        if not user_result or len(user_result) == 0:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        user_data = user_result[0]
        
        # Generate report data
        report_data = ReportGenerator.generate_report_data(user_data, assessment_data)
        
        return jsonify({
            'success': True,
            'report': report_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

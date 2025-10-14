from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(15), nullable=False)
    business_name = db.Column(db.String(200), nullable=False)
    business_type = db.Column(db.String(100), default='Garment Manufacturing')
    
    # Authentication fields
    verification_code = db.Column(db.String(10))
    is_verified = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False)
    assessment_token = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified_at = db.Column(db.DateTime)
    approved_at = db.Column(db.DateTime)
    
    # Relationships
    assessments = db.relationship('Assessment', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'designation': self.designation,
            'email': self.email,
            'mobile': self.mobile,
            'business_name': self.business_name,
            'business_type': self.business_type,
            'is_verified': self.is_verified,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None
        }

class Assessment(db.Model):
    __tablename__ = 'assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Assessment data
    answers = db.Column(db.Text)  # JSON string of answers
    scores = db.Column(db.Text)   # JSON string of calculated scores
    
    # Results
    overall_score = db.Column(db.Float)
    overall_percentage = db.Column(db.Float)
    category_scores = db.Column(db.Text)  # JSON string of category scores
    
    # Status
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_answers(self, answers_dict):
        self.answers = json.dumps(answers_dict)
    
    def get_answers(self):
        return json.loads(self.answers) if self.answers else {}
    
    def set_scores(self, scores_dict):
        self.scores = json.dumps(scores_dict)
    
    def get_scores(self):
        return json.loads(self.scores) if self.scores else {}
    
    def set_category_scores(self, category_scores_dict):
        self.category_scores = json.dumps(category_scores_dict)
    
    def get_category_scores(self):
        return json.loads(self.category_scores) if self.category_scores else {}
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'answers': self.get_answers(),
            'scores': self.get_scores(),
            'overall_score': self.overall_score,
            'overall_percentage': self.overall_percentage,
            'category_scores': self.get_category_scores(),
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


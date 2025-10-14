"""
Datrix™ Business Intelligence Scanner
Email Service for sending notifications
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_user = os.getenv('SMTP_USER', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.from_email = os.getenv('FROM_EMAIL', self.smtp_user)
        self.from_name = os.getenv('FROM_NAME', 'Datrix™ Business Intelligence')
        
    def send_email(self, to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
        """Send an email"""
        try:
            if not self.smtp_user or not self.smtp_password:
                print("Email service not configured - skipping email send")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            # Add text and HTML parts
            if text_body:
                part1 = MIMEText(text_body, 'plain')
                msg.attach(part1)
            
            part2 = MIMEText(html_body, 'html')
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            print(f"✓ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_verification_email(self, to_email: str, full_name: str, verification_code: str) -> bool:
        """Send verification code email"""
        subject = "Verify Your Datrix™ Account"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .code-box {{ background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
                .code {{ font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                .button {{ background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Datrix™</h1>
                    <p>Business Intelligence Scanner</p>
                </div>
                <div class="content">
                    <h2>Hello {full_name},</h2>
                    <p>Thank you for registering with Datrix™ Business Intelligence Scanner!</p>
                    <p>Please use the verification code below to complete your registration:</p>
                    
                    <div class="code-box">
                        <div class="code">{verification_code}</div>
                    </div>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This code is valid for 30 minutes</li>
                        <li>Do not share this code with anyone</li>
                        <li>After verification, your account will be reviewed by our admin team</li>
                    </ul>
                    
                    <p>If you didn't request this verification, please ignore this email.</p>
                    
                    <div class="footer">
                        <p>© 2025 Navvi Corporation. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Hello {full_name},
        
        Thank you for registering with Datrix™ Business Intelligence Scanner!
        
        Your verification code is: {verification_code}
        
        This code is valid for 30 minutes. Please do not share it with anyone.
        
        After verification, your account will be reviewed by our admin team.
        
        If you didn't request this verification, please ignore this email.
        
        © 2025 Navvi Corporation. All rights reserved.
        """
        
        return self.send_email(to_email, subject, html_body, text_body)
    
    def send_approval_email(self, to_email: str, full_name: str, assessment_token: str, assessment_url: str) -> bool:
        """Send account approval email"""
        subject = "Your Datrix™ Account Has Been Approved!"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Account Approved!</h1>
                    <p>Datrix™ Business Intelligence Scanner</p>
                </div>
                <div class="content">
                    <h2>Congratulations {full_name}!</h2>
                    <p>Your Datrix™ account has been approved by our admin team.</p>
                    <p>You can now access your personalized business intelligence assessment.</p>
                    
                    <div style="text-align: center;">
                        <a href="{assessment_url}" class="button">Start Your Assessment</a>
                    </div>
                    
                    <p><strong>What's Next?</strong></p>
                    <ul>
                        <li>Complete the 27-question business assessment</li>
                        <li>Receive your detailed business intelligence report</li>
                        <li>Get personalized recommendations for improvement</li>
                    </ul>
                    
                    <p>Your assessment token: <strong>{assessment_token}</strong></p>
                    
                    <div class="footer">
                        <p>© 2025 Navvi Corporation. All rights reserved.</p>
                        <p>Need help? Contact us at support@navvicorp.com</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Congratulations {full_name}!
        
        Your Datrix™ account has been approved by our admin team.
        
        You can now access your personalized business intelligence assessment.
        
        Start your assessment here: {assessment_url}
        
        Your assessment token: {assessment_token}
        
        What's Next?
        - Complete the 27-question business assessment
        - Receive your detailed business intelligence report
        - Get personalized recommendations for improvement
        
        © 2025 Navvi Corporation. All rights reserved.
        Need help? Contact us at support@navvicorp.com
        """
        
        return self.send_email(to_email, subject, html_body, text_body)


# Global email service instance
_email_service = None

def get_email_service() -> EmailService:
    """Get or create email service instance"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service


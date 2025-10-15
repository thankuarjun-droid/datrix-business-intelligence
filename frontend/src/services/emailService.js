/**
 * Email Service
 * Handles sending verification emails and notifications using Resend API
 * 
 * Email Strategy:
 * - Internal communications (verification, admin): arjunm@navvicorp.com
 * - Client-facing (assessment links, reports): datrix@navvicorp.com
 */

import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

// Email configuration
// Internal communications (verification, admin notifications)
const INTERNAL_SENDER_EMAIL = 'arjunm@navvicorp.com';
const INTERNAL_SENDER_NAME = 'Arjun M - Datrix™';

// Client-facing communications (assessment links, reports)
const CLIENT_SENDER_EMAIL = 'datrix@navvicorp.com';
const CLIENT_SENDER_NAME = 'Datrix™ Business Intelligence Scanner';

const COMPANY_NAME = 'Navvi Corporation';

/**
 * Send verification code via email
 * @param {string} email - Recipient email address
 * @param {string} code - Verification code
 * @param {string} name - User's name
 * @returns {Promise<Object>} Send result
 */
export const sendVerificationEmail = async (email, code, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${INTERNAL_SENDER_NAME} <${INTERNAL_SENDER_EMAIL}>`,
      to: [email],
      subject: 'Verify Your Email - Datrix™ Business Intelligence Scanner',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Datrix™</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Business Intelligence Scanner</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Dear ${name},</h2>
            
            <p>Thank you for registering for the Datrix™ Business Intelligence Scanner!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${code}
              </div>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">This code will expire in 15 minutes</p>
            </div>
            
            <p>Please enter this code on the verification page to complete your registration.</p>
            
            <p>Once verified, your account will be reviewed by our admin team and you will receive an email with your personalized assessment link within 1-2 hours.</p>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Security Note:</strong> If you did not request this verification, please ignore this email.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin: 0;">${INTERNAL_SENDER_NAME}</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">${COMPANY_NAME}</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:${INTERNAL_SENDER_EMAIL}" style="color: #667eea; text-decoration: none;">${INTERNAL_SENDER_EMAIL}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ${COMPANY_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification email',
      };
    }

    console.log('✅ Verification email sent successfully:', data);
    return {
      success: true,
      message: 'Verification email sent successfully',
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send verification email',
    };
  }
};

/**
 * Send SMS verification code
 * @param {string} mobile - Mobile number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} Send result
 */
export const sendVerificationSMS = async (mobile, code) => {
  try {
    // In production, integrate with SMS gateway (Twilio, AWS SNS, etc.)
    
    console.log('='.repeat(60));
    console.log('📱 VERIFICATION SMS');
    console.log('='.repeat(60));
    console.log(`From: ${INTERNAL_SENDER_NAME}`);
    console.log(`To: ${mobile}`);
    console.log(`Message: Your Datrix™ verification code is: ${code}. Valid for 15 minutes.`);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'SMS sent successfully',
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: 'Failed to send SMS',
    };
  }
};

/**
 * Send approval email with assessment link
 * Uses CLIENT email (datrix@navvicorp.com) for professional client communication
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @param {string} assessmentLink - Unique assessment link
 * @returns {Promise<Object>} Send result
 */
export const sendApprovalEmail = async (email, name, assessmentLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${CLIENT_SENDER_NAME} <${CLIENT_SENDER_EMAIL}>`,
      to: [email],
      subject: 'Your Datrix™ Assessment is Ready! 🎯',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Assessment is Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Datrix™</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Business Intelligence Scanner</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Dear ${name},</h2>
            
            <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #155724; font-size: 16px;">
                <strong>✅ Great news!</strong> Your Datrix™ Business Intelligence Scanner registration has been approved.
              </p>
            </div>
            
            <p>You can now access your personalized 67-question business health assessment:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${assessmentLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Start Your Assessment
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">This comprehensive assessment covers 6 key business pillars:</h3>
              <ul style="color: #666; line-height: 2;">
                <li>💰 Financial Health</li>
                <li>⚙️ Operational Excellence</li>
                <li>📈 Market Position</li>
                <li>👥 Human Capital</li>
                <li>💡 Technology & Innovation</li>
                <li>🎯 Strategic Planning</li>
              </ul>
            </div>
            
            <p><strong>Assessment Details:</strong></p>
            <ul style="color: #666;">
              <li>⏱️ Takes approximately 20-25 minutes to complete</li>
              <li>💾 Save your progress and return anytime</li>
              <li>🔒 Your data is secure and confidential</li>
            </ul>
            
            <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #0c5460; font-size: 14px;">
                <strong>📊 Upon completion, you'll receive:</strong><br>
                ✓ Detailed business health scorecard<br>
                ✓ Industry benchmark comparisons<br>
                ✓ Actionable recommendations<br>
                ✓ Professional PDF report
              </p>
            </div>
            
            <p>If you have any questions, feel free to reply to this email.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin: 0;">${CLIENT_SENDER_NAME}</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">${COMPANY_NAME}</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:${CLIENT_SENDER_EMAIL}" style="color: #667eea; text-decoration: none;">${CLIENT_SENDER_EMAIL}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ${COMPANY_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send approval email',
      };
    }

    console.log('✅ Approval email sent successfully:', data);
    return {
      success: true,
      message: 'Approval email sent successfully',
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send approval email',
    };
  }
};

/**
 * Send rejection email
 * Uses INTERNAL email for administrative communication
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Send result
 */
export const sendRejectionEmail = async (email, name, reason) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${INTERNAL_SENDER_NAME} <${INTERNAL_SENDER_EMAIL}>`,
      to: [email],
      subject: 'Datrix™ Registration Update',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Datrix™</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Business Intelligence Scanner</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Dear ${name},</h2>
            
            <p>Thank you for your interest in the Datrix™ Business Intelligence Scanner.</p>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;">
                After reviewing your registration, we regret to inform you that we are unable to proceed with your assessment request at this time.
              </p>
            </div>
            
            <p><strong>Reason:</strong> ${reason}</p>
            
            <p>If you believe this is an error or would like to discuss this further, please don't hesitate to contact us by replying to this email.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin: 0;">${INTERNAL_SENDER_NAME}</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">${COMPANY_NAME}</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:${INTERNAL_SENDER_EMAIL}" style="color: #667eea; text-decoration: none;">${INTERNAL_SENDER_EMAIL}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ${COMPANY_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send rejection email',
      };
    }

    console.log('✅ Rejection email sent successfully:', data);
    return {
      success: true,
      message: 'Rejection email sent successfully',
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send rejection email',
    };
  }
};

/**
 * Send assessment completion email with report
 * Uses CLIENT email (datrix@navvicorp.com) for professional client communication
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @param {string} reportUrl - URL to download report
 * @param {Object} summary - Assessment summary
 * @returns {Promise<Object>} Send result
 */
export const sendReportEmail = async (email, name, reportUrl, summary) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${CLIENT_SENDER_NAME} <${CLIENT_SENDER_EMAIL}>`,
      to: [email],
      subject: 'Your Datrix™ Business Health Report is Ready! 📊',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Report is Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Datrix™</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Business Intelligence Scanner</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Dear ${name},</h2>
            
            <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #155724; font-size: 16px;">
                <strong>🎉 Congratulations!</strong> You've completed your Datrix™ Business Intelligence Assessment!
              </p>
            </div>
            
            <p>Your comprehensive business health report is now available:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                📊 Download Your Report
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">Assessment Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Overall Score:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #667eea; text-align: right;">${summary?.overallScore || 'N/A'}/100</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Business Health Grade:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #28a745; text-align: right;">${summary?.grade || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Strengths Identified:</td>
                  <td style="padding: 10px 0; text-align: right;">${summary?.strengths || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Areas for Improvement:</td>
                  <td style="padding: 10px 0; text-align: right;">${summary?.improvements || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; color: #0c5460; font-weight: bold;">📈 Your report includes:</p>
              <ul style="margin: 0; padding-left: 20px; color: #0c5460;">
                <li>Detailed analysis across all 6 business pillars</li>
                <li>Industry benchmark comparisons</li>
                <li>Actionable recommendations</li>
                <li>Strategic improvement roadmap</li>
              </ul>
            </div>
            
            <h3 style="color: #333;">Next Steps:</h3>
            <ol style="color: #666; line-height: 2;">
              <li>📖 Review your detailed report</li>
              <li>📞 Schedule a consultation to discuss findings (optional)</li>
              <li>🚀 Implement recommended improvements</li>
            </ol>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;">
                <strong>💼 Want expert guidance?</strong><br>
                Schedule a consultation with our business experts to discuss your findings and create an action plan.<br>
                Reply to this email to book a session.
              </p>
            </div>
            
            <p>Thank you for using Datrix™ Business Intelligence Scanner!</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin: 0;">${CLIENT_SENDER_NAME}</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">${COMPANY_NAME}</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:${CLIENT_SENDER_EMAIL}" style="color: #667eea; text-decoration: none;">${CLIENT_SENDER_EMAIL}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ${COMPANY_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send report email',
      };
    }

    console.log('✅ Report email sent successfully:', data);
    return {
      success: true,
      message: 'Report email sent successfully',
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send report email',
    };
  }
};

export default {
  sendVerificationEmail,
  sendVerificationSMS,
  sendApprovalEmail,
  sendRejectionEmail,
  sendReportEmail,
};


/**
 * Email Service
 * Handles sending verification emails and notifications
 * 
 * Email Strategy:
 * - Internal communications (verification, admin): arjunm@navvicorp.com
 * - Client-facing (assessment links, reports): datrix@navvicorp.com
 * 
 * Note: This is a client-side placeholder. In production, email sending should be done
 * via a backend API to keep API keys secure and prevent abuse.
 */

// Email configuration
// Internal communications (verification, admin notifications)
const INTERNAL_SENDER_EMAIL = 'arjunm@navvicorp.com';
const INTERNAL_SENDER_NAME = 'Arjun M - Datrix™ | Navvi Corporation';

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
    // In production, this should call a backend API endpoint
    // For now, we'll simulate the email sending and log to console
    
    console.log('='.repeat(60));
    console.log('📧 VERIFICATION EMAIL');
    console.log('='.repeat(60));
    console.log(`From: ${INTERNAL_SENDER_NAME} <${INTERNAL_SENDER_EMAIL}>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email - Datrix™ Business Intelligence Scanner`);
    console.log(`Name: ${name}`);
    console.log(`Verification Code: ${code}`);
    console.log('='.repeat(60));
    console.log('Email Content:');
    console.log('='.repeat(60));
    console.log(`
Dear ${name},

Thank you for registering for the Datrix™ Business Intelligence Scanner!

Your verification code is: ${code}

This code will expire in 15 minutes.

Please enter this code on the verification page to complete your registration.

Once verified, your account will be reviewed by our admin team and you will receive
an email with your personalized assessment link within 1-2 hours.

If you did not request this verification, please ignore this email.

Best regards,
${INTERNAL_SENDER_NAME}
${COMPANY_NAME}
Email: ${INTERNAL_SENDER_EMAIL}
    `);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification email',
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
    console.log('='.repeat(60));
    console.log('📧 APPROVAL EMAIL (CLIENT-FACING)');
    console.log('='.repeat(60));
    console.log(`From: ${CLIENT_SENDER_NAME} <${CLIENT_SENDER_EMAIL}>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Your Datrix™ Assessment is Ready!`);
    console.log(`Name: ${name}`);
    console.log(`Assessment Link: ${assessmentLink}`);
    console.log('='.repeat(60));
    console.log('Email Content:');
    console.log('='.repeat(60));
    console.log(`
Dear ${name},

Great news! Your Datrix™ Business Intelligence Scanner registration has been approved.

You can now access your personalized 67-question business health assessment:

🔗 Assessment Link: ${assessmentLink}

This comprehensive assessment covers 6 key business pillars:
• Financial Health
• Operational Excellence
• Market Position
• Human Capital
• Technology & Innovation
• Strategic Planning

The assessment takes approximately 20-25 minutes to complete. You can save your progress
and return at any time using the same link.

Upon completion, you'll receive:
✓ Detailed business health scorecard
✓ Industry benchmark comparisons
✓ Actionable recommendations
✓ Professional PDF report

If you have any questions, feel free to reply to this email.

Best regards,
${CLIENT_SENDER_NAME}
${COMPANY_NAME}
Email: ${CLIENT_SENDER_EMAIL}
    `);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Approval email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send approval email',
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
    console.log('='.repeat(60));
    console.log('📧 REJECTION EMAIL');
    console.log('='.repeat(60));
    console.log(`From: ${INTERNAL_SENDER_NAME} <${INTERNAL_SENDER_EMAIL}>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Datrix™ Registration Update`);
    console.log(`Name: ${name}`);
    console.log(`Reason: ${reason}`);
    console.log('='.repeat(60));
    console.log('Email Content:');
    console.log('='.repeat(60));
    console.log(`
Dear ${name},

Thank you for your interest in the Datrix™ Business Intelligence Scanner.

After reviewing your registration, we regret to inform you that we are unable to proceed
with your assessment request at this time.

Reason: ${reason}

If you believe this is an error or would like to discuss this further, please don't
hesitate to contact us.

Best regards,
${INTERNAL_SENDER_NAME}
${COMPANY_NAME}
Email: ${INTERNAL_SENDER_EMAIL}
    `);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Rejection email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send rejection email',
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
    console.log('='.repeat(60));
    console.log('📧 REPORT EMAIL (CLIENT-FACING)');
    console.log('='.repeat(60));
    console.log(`From: ${CLIENT_SENDER_NAME} <${CLIENT_SENDER_EMAIL}>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Your Datrix™ Business Health Report is Ready`);
    console.log(`Name: ${name}`);
    console.log(`Report URL: ${reportUrl}`);
    console.log('='.repeat(60));
    console.log('Email Content:');
    console.log('='.repeat(60));
    console.log(`
Dear ${name},

Congratulations on completing your Datrix™ Business Intelligence Assessment!

Your comprehensive business health report is now available:

📊 Download Report: ${reportUrl}

Assessment Summary:
• Overall Score: ${summary?.overallScore || 'N/A'}/100
• Business Health Grade: ${summary?.grade || 'N/A'}
• Strengths Identified: ${summary?.strengths || 'N/A'}
• Areas for Improvement: ${summary?.improvements || 'N/A'}

Your report includes:
✓ Detailed analysis across all 6 business pillars
✓ Industry benchmark comparisons
✓ Actionable recommendations
✓ Strategic improvement roadmap

Next Steps:
1. Review your detailed report
2. Schedule a consultation to discuss findings (optional)
3. Implement recommended improvements

Would you like to schedule a consultation with our business experts?
Reply to this email to book a session.

Thank you for using Datrix™ Business Intelligence Scanner!

Best regards,
${CLIENT_SENDER_NAME}
${COMPANY_NAME}
Email: ${CLIENT_SENDER_EMAIL}
    `);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Report email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send report email',
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


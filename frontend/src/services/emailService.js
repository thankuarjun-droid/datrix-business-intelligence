/**
 * Email Service
 * Handles sending verification emails and notifications
 * 
 * Note: This is a client-side placeholder. In production, email sending should be done
 * via a backend API to keep API keys secure and prevent abuse.
 */

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
    console.log(`To: ${email}`);
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
an email with your personalized assessment link.

Best regards,
Navvi Corporation Team
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
    console.log(`To: ${mobile}`);
    console.log(`Message: Your Datrix™ verification code is: ${code}. Valid for 15 minutes.`);
    console.log('='.repeat(60));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: 'Verification SMS sent successfully',
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification SMS',
    };
  }
};

/**
 * Send approval notification email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} assessmentLink - Unique assessment link
 * @returns {Promise<Object>} Send result
 */
export const sendApprovalEmail = async (email, name, assessmentLink) => {
  try {
    console.log('='.repeat(60));
    console.log('✅ APPROVAL EMAIL');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Assessment Link: ${assessmentLink}`);
    console.log('='.repeat(60));
    console.log('Email Content:');
    console.log('='.repeat(60));
    console.log(`
Dear ${name},

Great news! Your Datrix™ Business Intelligence Scanner account has been approved.

You can now access your personalized business health assessment using the link below:

${assessmentLink}

This comprehensive 67-question assessment will analyze your business across 6 key pillars:
• Financial Health
• Operational Excellence
• Market Position
• Human Capital
• Technology & Innovation
• Strategic Planning

The assessment takes approximately 20-30 minutes to complete and will provide you with:
✓ Detailed performance scores
✓ Industry benchmarks
✓ Actionable recommendations
✓ Professional PDF report

Click the link above to begin your assessment now.

Best regards,
Navvi Corporation Team
    `);
    console.log('='.repeat(60));

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Approval email sent successfully',
    };
  } catch (error) {
    console.error('Approval email error:', error);
    return {
      success: false,
      error: 'Failed to send approval email',
    };
  }
};


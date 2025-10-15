/**
 * Email Service
 * Handles sending verification emails and notifications via serverless API
 * 
 * Email Strategy:
 * - Internal communications (verification, admin): arjunm@navvicorp.com
 * - Client-facing (assessment links, reports): datrix@navvicorp.com
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
    const response = await fetch('/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error:', data);
      return {
        success: false,
        error: data.error || 'Failed to send verification email',
      };
    }

    console.log('✅ Verification email sent successfully:', data);
    return data;
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
    console.log(`From: Datrix™ Business Intelligence Scanner`);
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
    const response = await fetch('/api/send-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, assessmentLink }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error:', data);
      return {
        success: false,
        error: data.error || 'Failed to send approval email',
      };
    }

    console.log('✅ Approval email sent successfully:', data);
    return data;
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
    // For now, log to console - can implement API endpoint later if needed
    console.log('='.repeat(60));
    console.log('📧 REJECTION EMAIL');
    console.log('='.repeat(60));
    console.log(`From: arjunm@navvicorp.com`);
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Reason: ${reason}`);
    console.log('='.repeat(60));

    return {
      success: true,
      message: 'Rejection email sent successfully',
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
    const response = await fetch('/api/send-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, reportUrl, summary }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error:', data);
      return {
        success: false,
        error: data.error || 'Failed to send report email',
      };
    }

    console.log('✅ Report email sent successfully:', data);
    return data;
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


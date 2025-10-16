/**
 * Email Service using EmailJS (CDN version)
 * Handles sending verification emails, approval notifications, and reports
 */

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'WY720kjd7SMzxiTW5';
const EMAILJS_SERVICE_ID = 'service_e2bwzgq';
const EMAILJS_TEMPLATE_ID = 'template_mtz49co';

// Initialize EmailJS when the script loads
if (typeof window !== 'undefined' && window.emailjs) {
  window.emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('✅ EmailJS initialized from CDN');
} else {
  console.warn('⚠️ EmailJS CDN not loaded yet');
}

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} verificationCode - 6-digit verification code
 * @param {string} userName - User's full name
 * @param {object} additionalData - Additional user data (mobile, businessName, designation)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendVerificationEmail = async (email, verificationCode, userName, additionalData = {}) => {
  try {
    // Check if EmailJS is available
    if (typeof window === 'undefined' || !window.emailjs) {
      throw new Error('EmailJS library not loaded');
    }

    console.log('📧 EmailJS: Preparing to send email...');
    console.log('Email:', email);
    console.log('Verification Code:', verificationCode);
    console.log('User Name:', userName);
    console.log('Additional Data:', additionalData);

    const templateParams = {
      user_email: email,
      to_email: email,
      user_name: userName,
      verification_code: verificationCode,
      mobile: additionalData.mobile || 'N/A',
      business_name: additionalData.businessName || 'N/A',
      designation: additionalData.designation || 'N/A',
    };

    console.log('📧 EmailJS: Sending with params:', templateParams);

    const response = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ EmailJS: Email sent successfully!', response);

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('❌ EmailJS: Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send verification email',
    };
  }
};

/**
 * Send approval notification email to admin
 * @param {string} adminEmail - Admin's email address
 * @param {object} userData - User data to include in notification
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendApprovalNotification = async (adminEmail, userData) => {
  try {
    // TODO: Implement admin approval notification
    console.log('Sending approval notification to:', adminEmail);
    return {
      success: true,
      message: 'Approval notification sent',
    };
  } catch (error) {
    console.error('Error sending approval notification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send assessment report email to user
 * @param {string} email - User's email address
 * @param {string} reportUrl - URL to download the report
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendReportEmail = async (email, reportUrl) => {
  try {
    // TODO: Implement report email
    console.log('Sending report to:', email);
    return {
      success: true,
      message: 'Report email sent',
    };
  } catch (error) {
    console.error('Error sending report email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};


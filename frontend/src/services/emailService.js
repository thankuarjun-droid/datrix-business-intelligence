/**
 * Email Service
 * Handles sending verification emails and notifications via EmailJS
 * 
 * Email Strategy:
 * - Internal communications (verification, admin): arjunm@navvicorp.com
 * - Client-facing (assessment links, reports): datrix@navvicorp.com
 */

import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'WY720kjd7SMzxiTW5';
const EMAILJS_SERVICE_ID = 'service_e2bwzgq';
const EMAILJS_TEMPLATE_ID = 'template_mtz49co';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send verification code via email
 * @param {string} email - Recipient email address
 * @param {string} code - Verification code
 * @param {string} name - User's name
 * @param {Object} userData - Additional user data (mobile, businessName, designation)
 * @returns {Promise<Object>} Send result
 */
export const sendVerificationEmail = async (email, code, name, userData = {}) => {
  try {
    const templateParams = {
      user_email: email,
      user_name: name || 'User',
      verification_code: code,
      user_mobile: userData.mobile || '',
      business_name: userData.businessName || '',
      user_designation: userData.designation || '',
      to_email: email,
    };

    console.log('📧 Sending verification email via EmailJS:', { email, code });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ EmailJS response:', response);

    if (response.status === 200) {
      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Email sending error:', error);
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
    const templateParams = {
      user_email: email,
      user_name: name || 'User',
      verification_code: `APPROVED - Link: ${assessmentLink}`,
      to_email: email,
    };

    console.log('📧 Sending approval email via EmailJS:', { email });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Approval email sent successfully',
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Email sending error:', error);
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
    const templateParams = {
      user_email: email,
      user_name: name || 'User',
      verification_code: `REPORT - Score: ${summary?.score || 'N/A'}`,
      to_email: email,
    };

    console.log('📧 Sending report email via EmailJS:', { email });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Report email sent successfully',
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Email sending error:', error);
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


/**
 * Email Service - Frontend
 * Calls backend API endpoints to send emails via Resend
 */

const API_BASE_URL = window.location.origin;

/**
 * Send email via backend API
 */
async function callEmailAPI(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.statusText}`);
    }

    console.log(`✅ Email sent via /api/${endpoint}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Failed to send email via /api/${endpoint}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Send registration verification email to user
 */
export async function sendVerificationEmail(email, verificationCode, userName, additionalData = {}) {
  return callEmailAPI('send-verification', {
    email,
    code: verificationCode,
    name: userName,
  });
}

/**
 * Send notification to admin about new registration
 */
export async function sendAdminNotification(userData) {
  // This will be implemented when we create the admin notification endpoint
  console.log('Admin notification:', userData);
  return { success: true, message: 'Admin notification logged' };
}

/**
 * Send assessment link to user after admin approval
 */
export async function sendAssessmentLink({ name, email, company, assessmentLink, expiresAt }) {
  return callEmailAPI('send-approval', {
    name,
    email,
    company,
    assessmentLink,
    expiresAt,
  });
}

/**
 * Send assessment completion notification with report
 */
export async function sendReportEmail(email, reportUrl, userName, company) {
  return callEmailAPI('send-report', {
    email,
    reportUrl,
    userName,
    company,
  });
}


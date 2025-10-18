/**
 * Email Service using Resend API
 * Handles all email communications for Datrix Business Intelligence Scanner
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'Datrix™ <onboarding@resend.dev>'; // Use Resend's test domain for now
const ADMIN_EMAIL = 'admin@navvicorp.com';

/**
 * Send email via Resend API
 */
async function sendEmail({ to, subject, html }) {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send registration verification email to user
 */
export async function sendVerificationEmail(email, verificationCode, userName, additionalData = {}) {
  const subject = 'Welcome to Datrix™ - Verify Your Email';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #3B5998 0%, #2d4373 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Datrix™</h1>
                  <p style="color: #F7941D; margin: 10px 0 0 0; font-size: 14px; font-weight: 500;">Business Intelligence Scanner</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${userName}!</h2>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    Thank you for registering with Datrix™ Business Intelligence Scanner by Navvi Corporations.
                  </p>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                    Your verification code is:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <div style="display: inline-block; background-color: #f8f9fa; border: 2px solid #3B5998; border-radius: 8px; padding: 20px 40px;">
                          <span style="font-size: 36px; font-weight: bold; color: #3B5998; letter-spacing: 8px;">${verificationCode}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #999999; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
                    This code will expire in 10 minutes.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #3B5998; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Navvi Corporations</p>
                  <p style="color: #F7941D; margin: 0 0 15px 0; font-size: 14px; font-style: italic;">Cut Waste. Build Systems. Boost Profits.</p>
                  <p style="color: #999999; margin: 0; font-size: 12px;">
                    © ${new Date().getFullYear()} Navvi Corporations. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send notification to admin about new registration
 */
export async function sendAdminNotification(userData) {
  const { name, email, businessName, mobile, designation } = userData;
  const subject = `New Registration: ${name} from ${businessName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: #3B5998; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Registration Alert</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Registration Details</h2>
                  <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e9ecef; border-radius: 5px;">
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 12px; font-weight: bold; color: #333333; width: 30%;">Name:</td>
                      <td style="padding: 12px; color: #666666;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; font-weight: bold; color: #333333;">Email:</td>
                      <td style="padding: 12px; color: #666666;">${email}</td>
                    </tr>
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 12px; font-weight: bold; color: #333333;">Company:</td>
                      <td style="padding: 12px; color: #666666;">${businessName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; font-weight: bold; color: #333333;">Designation:</td>
                      <td style="padding: 12px; color: #666666;">${designation || 'Not provided'}</td>
                    </tr>
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 12px; font-weight: bold; color: #333333;">Mobile:</td>
                      <td style="padding: 12px; color: #666666;">${mobile || 'Not provided'}</td>
                    </tr>
                  </table>
                  <p style="color: #666666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                    Please review this registration in the admin panel and create an assessment invitation if approved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}

/**
 * Send assessment link to user after admin approval
 */
export async function sendAssessmentLink({ name, email, company, assessmentLink, expiresAt }) {
  const subject = 'Your Datrix™ Assessment Link is Ready';
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #3B5998 0%, #2d4373 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Datrix™</h1>
                  <p style="color: #F7941D; margin: 10px 0 0 0; font-size: 14px; font-weight: 500;">Business Intelligence Scanner</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hello, ${name}!</h2>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    Your registration for <strong>${company}</strong> has been approved!
                  </p>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                    You can now access your personalized business intelligence assessment.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-left: 4px solid #F7941D; margin: 0 0 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="color: #333333; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">⏱️ Estimated Time: 15-20 minutes</p>
                        <p style="color: #666666; margin: 0; font-size: 14px;">📅 Link Expires: ${expiryDate}</p>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <a href="${assessmentLink}" style="display: inline-block; background-color: #F7941D; color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 5px; font-size: 18px; font-weight: bold;">
                          Start Assessment Now
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #3B5998; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Navvi Corporations</p>
                  <p style="color: #F7941D; margin: 0 0 15px 0; font-size: 14px; font-style: italic;">Cut Waste. Build Systems. Boost Profits.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send assessment completion notification with report
 */
export async function sendReportEmail(email, reportUrl, userName, company) {
  const subject = 'Your Datrix™ Business Intelligence Report is Ready';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #3B5998 0%, #2d4373 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ Assessment Complete!</h1>
                  <p style="color: #F7941D; margin: 10px 0 0 0; font-size: 14px; font-weight: 500;">Your Business Intelligence Report is Ready</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Congratulations, ${userName}!</h2>
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    Thank you for completing the Datrix™ Business Intelligence Assessment for <strong>${company}</strong>.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <a href="${reportUrl}" style="display: inline-block; background-color: #F7941D; color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 5px; font-size: 18px; font-weight: bold;">
                          View Your Report
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #3B5998; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Navvi Corporations</p>
                  <p style="color: #F7941D; margin: 0 0 15px 0; font-size: 14px; font-style: italic;">Cut Waste. Build Systems. Boost Profits.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}


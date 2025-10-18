/**
 * Serverless function to send verification emails via Resend API
 * Uses fetch instead of Resend SDK for better compatibility
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code, name } = req.body;

  if (!email || !code || !name) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: email, code, name' 
    });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set');
    return res.status(500).json({
      success: false,
      error: 'Email service configuration error'
    });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Datrix™ <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to Datrix™ - Verify Your Email',
        html: `
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
                        <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}!</h2>
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
                                <span style="font-size: 36px; font-weight: bold; color: #3B5998; letter-spacing: 8px;">${code}</span>
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
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ 
        success: false,
        error: data.message || 'Failed to send verification email' 
      });
    }

    console.log('✅ Verification email sent successfully:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Verification email sent successfully',
      emailId: data.id 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send verification email' 
    });
  }
}


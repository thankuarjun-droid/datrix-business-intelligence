const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
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

  try {
    const { data, error } = await resend.emails.send({
      from: 'Arjun M - Datrix™ <arjunm@navvicorp.com>',
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
            <p style="color: #333; font-weight: bold; margin: 0;">Arjun M - Datrix™</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">Navvi Corporation</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:arjunm@navvicorp.com" style="color: #667eea; text-decoration: none;">arjunm@navvicorp.com</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Navvi Corporation. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(400).json({ 
        success: false,
        error: error.message || 'Failed to send verification email' 
      });
    }

    console.log('✅ Verification email sent successfully:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Verification email sent successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send verification email' 
    });
  }
};


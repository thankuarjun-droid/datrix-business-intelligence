import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { email, name, assessmentLink } = req.body;

  if (!email || !name || !assessmentLink) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: email, name, assessmentLink' 
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Datrix™ Business Intelligence Scanner <datrix@navvicorp.com>',
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
            <p style="color: #333; font-weight: bold; margin: 0;">Datrix™ Business Intelligence Scanner</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">Navvi Corporation</p>
            <p style="color: #667eea; font-size: 14px; margin: 0;">
              <a href="mailto:datrix@navvicorp.com" style="color: #667eea; text-decoration: none;">datrix@navvicorp.com</a>
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
        error: error.message || 'Failed to send approval email' 
      });
    }

    console.log('✅ Approval email sent successfully:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Approval email sent successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send approval email' 
    });
  }
}


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

  const { email, name, reportUrl, summary } = req.body;

  if (!email || !name || !reportUrl) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: email, name, reportUrl' 
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Datrix™ Business Intelligence Scanner <datrix@navvicorp.com>',
      to: [email],
      subject: 'Your Datrix™ Business Health Report is Ready! 📊',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Report is Ready</title>
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
                <strong>🎉 Congratulations!</strong> You've completed your Datrix™ Business Intelligence Assessment!
              </p>
            </div>
            
            <p>Your comprehensive business health report is now available:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                📊 Download Your Report
              </a>
            </div>
            
            ${summary ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">Assessment Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Overall Score:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #667eea; text-align: right;">${summary.overallScore || 'N/A'}/100</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Business Health Grade:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #28a745; text-align: right;">${summary.grade || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0; color: #666;">Strengths Identified:</td>
                  <td style="padding: 10px 0; text-align: right;">${summary.strengths || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Areas for Improvement:</td>
                  <td style="padding: 10px 0; text-align: right;">${summary.improvements || 'N/A'}</td>
                </tr>
              </table>
            </div>
            ` : ''}
            
            <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; color: #0c5460; font-weight: bold;">📈 Your report includes:</p>
              <ul style="margin: 0; padding-left: 20px; color: #0c5460;">
                <li>Detailed analysis across all 6 business pillars</li>
                <li>Industry benchmark comparisons</li>
                <li>Actionable recommendations</li>
                <li>Strategic improvement roadmap</li>
              </ul>
            </div>
            
            <h3 style="color: #333;">Next Steps:</h3>
            <ol style="color: #666; line-height: 2;">
              <li>📖 Review your detailed report</li>
              <li>📞 Schedule a consultation to discuss findings (optional)</li>
              <li>🚀 Implement recommended improvements</li>
            </ol>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;">
                <strong>💼 Want expert guidance?</strong><br>
                Schedule a consultation with our business experts to discuss your findings and create an action plan.<br>
                Reply to this email to book a session.
              </p>
            </div>
            
            <p>Thank you for using Datrix™ Business Intelligence Scanner!</p>
            
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
        error: error.message || 'Failed to send report email' 
      });
    }

    console.log('✅ Report email sent successfully:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Report email sent successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send report email' 
    });
  }
};


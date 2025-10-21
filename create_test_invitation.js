const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = 'https://vboauggpscnkgsqwfccg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib2F1Z2dwc2Nua2dzcXdmY2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NzE4NzMsImV4cCI6MjA1NTM0Nzg3M30.bKHqSVJBl3Dz8OM8eBjxRFKRGYjJlVOlq-ztSP6Hx-A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestInvitation() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const { data, error } = await supabase
    .from('assessment_invitations')
    .insert({
      client_email: 'navvicorp@gmail.com',
      client_name: 'Test User',
      company_name: 'Test Company',
      token: token,
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    })
    .select();
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Test invitation created!');
    console.log('Token:', token);
    console.log('URL:', `https://datrix-business-intelligence.vercel.app/assess/${token}`);
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

createTestInvitation();

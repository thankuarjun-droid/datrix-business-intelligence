-- Create a fresh assessment invitation for testing
INSERT INTO assessment_invitations (
  email,
  company_name,
  token,
  expires_at,
  status
) VALUES (
  'navvicorp@gmail.com',
  'Test Company',
  encode(gen_random_bytes(32), 'hex'),
  NOW() + INTERVAL '7 days',
  'pending'
)
RETURNING *;

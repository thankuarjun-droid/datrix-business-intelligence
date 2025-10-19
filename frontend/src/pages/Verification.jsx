import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { verifyUser, resendVerificationCode } from '../services/userService';
import { sendVerificationEmail } from '../services/emailService';

export default function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || {};

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    console.log('=== HANDLE VERIFY CALLED ===');
    console.log('Email from state:', email);
    console.log('Verification code:', verificationCode);
    console.log('Verification code length:', verificationCode ? verificationCode.length : 0);
    
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      console.error('Validation failed: Invalid verification code length');
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    console.log('Validation passed, calling verifyUser...');
    setLoading(true);

    try {
      const result = await verifyUser(email, verificationCode);
      console.log('verifyUser result:', result);

      if (result.success) {
        setSuccess(result.message);
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate('/verification-success', {
            state: { email, name },
          });
        }, 2000);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        // Send the new verification code via email
        await sendVerificationEmail(result.email, result.verificationCode, name);
        
        setSuccess('Verification code resent successfully! Please check your email.');
        setTimeLeft(900); // Reset timer
        setVerificationCode(''); // Clear input
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while resending the code.');
      console.error('Resend error:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Datrix™</h1>
          <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to<br />
              <span className="font-semibold text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Verification Code Input */}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={loading || resending}
                  required
                />
                <p className="text-sm text-gray-500 text-center">
                  Code expires in: <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || resending || verificationCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Didn't receive the code?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={loading || resending || timeLeft > 840} // Can resend after 1 minute
                  className="w-full"
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              {/* Back to Registration */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/register')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? Contact support at</p>
          <a href="mailto:support@navvicorp.com" className="text-blue-600 hover:underline">
            support@navvicorp.com
          </a>
        </div>
      </div>
    </div>
  );
}


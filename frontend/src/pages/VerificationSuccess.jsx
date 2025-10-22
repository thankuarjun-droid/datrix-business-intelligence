import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Mail } from 'lucide-react';

export default function VerificationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Datrix™</h1>
          <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">Email Verified Successfully!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Thank you for verifying your email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Admin Review</p>
                    <p className="text-sm text-gray-600">
                      Your account is now pending approval from our admin team. This typically takes 1-2 business hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Assessment Link</p>
                    <p className="text-sm text-gray-600">
                      Once approved, you'll receive an email at <span className="font-semibold">{email}</span> with your personalized assessment link.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Complete Assessment</p>
                    <p className="text-sm text-gray-600">
                      Use the link to access the comprehensive 60-question business health assessment tailored for garment manufacturers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Your Assessment Will Include:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Financial Health Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Operational Excellence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Market Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Human Capital</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Technology & Innovation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Strategic Planning</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600 pt-4 border-t">
              <p>
                Please check your email regularly for the approval notification.
                <br />
                If you don't receive it within 24 hours, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Questions? Contact us at</p>
          <a href="mailto:support@navvicorp.com" className="text-blue-600 hover:underline font-medium">
            support@navvicorp.com
          </a>
        </div>
      </div>
    </div>
  );
}


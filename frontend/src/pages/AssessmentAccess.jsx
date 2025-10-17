import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Loader2, Building, User, Mail } from 'lucide-react';
import { validateToken, markTokenAccessed } from '../services/invitationService';
import navviLogo from '../assets/navvi-logo.svg';

const AssessmentAccess = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (token) {
      validateAssessmentToken();
    } else {
      setValidating(false);
      setError('No assessment token provided');
    }
  }, [token]);

  const validateAssessmentToken = async () => {
    setValidating(true);
    const result = await validateToken(token);
    
    if (result.success && result.valid) {
      setIsValid(true);
      setInvitation(result.invitation);
    } else {
      setIsValid(false);
      setError(result.message || 'Invalid or expired assessment link');
    }
    
    setValidating(false);
  };

  const handleStartAssessment = async () => {
    setStarting(true);
    
    // Mark token as accessed
    await markTokenAccessed(token);
    
    // Store invitation data in sessionStorage for the assessment
    sessionStorage.setItem('assessment_token', token);
    sessionStorage.setItem('assessment_invitation', JSON.stringify(invitation));
    
    // Navigate to assessment
    navigate('/assessment', { 
      state: { 
        token,
        invitation 
      } 
    });
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Validating Assessment Link</h3>
              <p className="text-sm text-gray-600 text-center">
                Please wait while we verify your assessment invitation...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={navviLogo} alt="Navvi Logo" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Datrix™ Business Intelligence Scanner</h1>
          </div>

          {/* Error Card */}
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-900">Invalid Assessment Link</CardTitle>
                  <CardDescription className="text-red-700">
                    This assessment link is not valid or has expired
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <p className="text-gray-700">This could happen if:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>The assessment link has expired</li>
                  <li>The assessment has already been completed</li>
                  <li>The link was entered incorrectly</li>
                  <li>The invitation was cancelled</li>
                </ul>
                
                <div className="pt-4 border-t">
                  <p className="text-gray-700 mb-4">
                    <strong>Need help?</strong> Please contact the person who sent you this assessment link 
                    to request a new invitation.
                  </p>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    Return to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={navviLogo} alt="Navvi Logo" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Datrix™ Business Intelligence Scanner</h1>
          <p className="text-lg text-gray-600">Professional Business Assessment for Garment Manufacturers</p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900">Welcome to Your Assessment</CardTitle>
                <CardDescription className="text-green-700">
                  Your assessment invitation is valid and ready to begin
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Invitation Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Invitation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Client Name</div>
                  <div className="font-semibold text-gray-900">{invitation.client_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold text-gray-900">{invitation.client_email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Company</div>
                  <div className="font-semibold text-gray-900">{invitation.company_name}</div>
                </div>
              </div>
              {invitation.expires_at && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">Valid Until</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(invitation.expires_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Overview</CardTitle>
            <CardDescription>What to expect from this comprehensive business assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">67</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Comprehensive Questions</h4>
                  <p className="text-sm text-gray-600">
                    67 carefully crafted questions covering 6 critical business pillars
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">30-45 Minutes</h4>
                  <p className="text-sm text-gray-600">
                    Estimated time to complete the assessment
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Instant Results</h4>
                  <p className="text-sm text-gray-600">
                    Receive your detailed report immediately upon completion
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">6 Business Pillars Covered:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>✓ Strategic Planning</div>
                <div>✓ Operations Excellence</div>
                <div>✓ Financial Management</div>
                <div>✓ Sales & Marketing</div>
                <div>✓ Human Resources</div>
                <div>✓ Technology & Innovation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Before You Begin</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Set aside 30-45 minutes in a quiet environment without interruptions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Answer all questions honestly based on your current business practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Have relevant business data and documentation ready for reference</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Your progress will be saved automatically as you complete each section</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="px-12 py-6 text-lg"
            onClick={handleStartAssessment}
            disabled={starting}
          >
            {starting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Assessment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Start Assessment
              </>
            )}
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            By starting this assessment, you confirm that the information provided is accurate
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentAccess;


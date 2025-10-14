import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import navviLogo from '../assets/navvi-logo.svg';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={navviLogo} alt="Navvi Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™</h1>
                <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </CardTitle>
            <p className="text-gray-600">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="w-6 h-6 text-blue-600 mr-2" />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Navvi Corporation ("we," "our," or "us") operates the Datrix™ Business Intelligence Scanner 
                  service. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our business assessment platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-blue-600 mr-2" />
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Full name and professional designation</li>
                      <li>Email address and mobile phone number</li>
                      <li>Business name and industry type</li>
                      <li>Assessment responses and business data</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>IP address and browser information</li>
                      <li>Device type and operating system</li>
                      <li>Usage patterns and interaction data</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-blue-600 mr-2" />
                  How We Use Your Information
                </h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Primary Uses</h3>
                  <ul className="list-disc list-inside text-blue-800 space-y-2">
                    <li>Provide and deliver the Datrix™ assessment service</li>
                    <li>Generate personalized business intelligence reports</li>
                    <li>Communicate assessment results and recommendations</li>
                    <li>Verify user identity and prevent unauthorized access</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal and regulatory requirements</li>
                  </ul>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Technical Safeguards</h3>
                    <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Secure database storage with encryption</li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Administrative Safeguards</h3>
                    <ul className="list-disc list-inside text-purple-800 space-y-1 text-sm">
                      <li>Limited access on need-to-know basis</li>
                      <li>Employee training on data protection</li>
                      <li>Regular privacy impact assessments</li>
                      <li>Incident response procedures</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">We DO NOT sell your personal data</h3>
                  <p className="text-yellow-800 mb-3">
                    We may share your information only in the following limited circumstances:
                  </p>
                  <ul className="list-disc list-inside text-yellow-800 space-y-1">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                    <li>With trusted service providers under strict confidentiality agreements</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Access & Portability</h3>
                    <p className="text-gray-700 text-sm">Request copies of your personal data in a portable format</p>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                    <p className="text-gray-700 text-sm">Update or correct inaccurate personal information</p>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                    <p className="text-gray-700 text-sm">Request deletion of your personal data (subject to legal requirements)</p>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
                    <p className="text-gray-700 text-sm">Unsubscribe from marketing communications at any time</p>
                  </div>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information only as long as necessary to provide our services 
                  and comply with legal obligations. Assessment data is typically retained for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Assessment Results:</strong> 3 years for comparison and trend analysis</li>
                  <li><strong>Account Information:</strong> Until account deletion is requested</li>
                  <li><strong>Communication Records:</strong> 2 years for customer service purposes</li>
                  <li><strong>Legal Compliance:</strong> As required by applicable laws</li>
                </ul>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with 
                  this Privacy Policy and applicable data protection laws.
                </p>
              </section>

              {/* Updates */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of any material 
                  changes by email or through our service. Your continued use of Datrix™ after such 
                  modifications constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Us</h2>
                <p className="text-blue-800 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-blue-800">
                  <p><strong>Email:</strong> privacy@navvicorp.com</p>
                  <p><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                  <p><strong>Address:</strong> Navvi Corporation, Business Address, India</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


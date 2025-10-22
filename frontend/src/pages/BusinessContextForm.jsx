import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, TrendingUp, Target, AlertCircle } from 'lucide-react';

const BusinessContextForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sewing_machines: '',
    annual_turnover: '',
    turnover_currency: 'INR',
    goal_1_year: '',
    goal_3_year: '',
    challenge_1: '',
    challenge_2: '',
    challenge_3: ''
  });

  // Get assessment data from previous page
  const assessmentData = location.state?.assessmentData;

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Invalid Access</h2>
              <p className="text-gray-600 text-center">Please complete the assessment first.</p>
              <Button onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.sewing_machines || !formData.annual_turnover || 
        !formData.goal_1_year || !formData.goal_3_year || 
        !formData.challenge_1) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Navigate to AI report generation with all data
    navigate('/results-enhanced', {
      state: {
        assessmentData: assessmentData,
        businessContext: formData
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tell Us About Your Business
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us generate a more personalized and actionable report by sharing some additional context about your business operations and goals.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Business Scale
              </CardTitle>
              <CardDescription>
                Understanding your operational capacity helps us benchmark against similar-sized businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Sewing Machines <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sewing_machines"
                  value={formData.sewing_machines}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total number of operational sewing machines in your facility
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Sales Turnover <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="turnover_currency"
                    value={formData.turnover_currency}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                  <input
                    type="number"
                    name="annual_turnover"
                    value={formData.annual_turnover}
                    onChange={handleChange}
                    placeholder="e.g., 50000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your approximate annual revenue (last financial year)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Business Goals
              </CardTitle>
              <CardDescription>
                Share your vision to receive tailored strategic recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1-Year Goal <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="goal_1_year"
                  value={formData.goal_1_year}
                  onChange={handleChange}
                  placeholder="e.g., Increase production capacity by 30% and expand to 2 new international markets"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  What do you want to achieve in the next 12 months?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3-Year Vision <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="goal_3_year"
                  value={formData.goal_3_year}
                  onChange={handleChange}
                  placeholder="e.g., Become a top 10 garment exporter from Tirupur with fully automated production lines"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Where do you see your business in 3 years?
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Current Challenges
              </CardTitle>
              <CardDescription>
                Identify your pain points to get focused solutions and action plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge #1 (Most Critical) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="challenge_1"
                  value={formData.challenge_1}
                  onChange={handleChange}
                  placeholder="e.g., High production delays due to inefficient workflow and poor quality control"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge #2
                </label>
                <textarea
                  name="challenge_2"
                  value={formData.challenge_2}
                  onChange={handleChange}
                  placeholder="e.g., Difficulty in finding and retaining skilled workers"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge #3
                </label>
                <textarea
                  name="challenge_3"
                  value={formData.challenge_3}
                  onChange={handleChange}
                  placeholder="e.g., Cash flow management and delayed payments from buyers"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>What happens next?</strong> Our AI will analyze your responses along with your assessment results to generate a comprehensive, personalized business intelligence report with specific recommendations tailored to your goals and challenges.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  Generate AI Report
                  <TrendingUp className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessContextForm;


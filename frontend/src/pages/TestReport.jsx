import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMockReportData } from '../utils/mockReportData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';

const TestReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const generateTestReport = () => {
    setLoading(true);
    
    // Generate mock data
    const mockData = generateMockReportData();
    
    // Simulate loading delay
    setTimeout(() => {
      // Navigate to comprehensive results with mock data
      navigate('/results-comprehensive', {
        state: {
          assessmentData: mockData.assessmentData,
          businessContext: mockData.businessContext,
          responses: mockData.responses
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
              <Sparkles className="h-12 w-12 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Test Comprehensive Report
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Generate a comprehensive report with mock data for testing purposes. 
              This allows you to quickly preview the report design and PDF generation 
              without completing the full 60-question assessment.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Mock Data Includes:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>60 question responses across 7 categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Business context (475 machines, ₹11 Cr turnover)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Overall score: 21.7% (Grade D)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Category-wise performance breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Question-level analysis and recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Heat map visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>AI-powered insights and quick wins</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={generateTestReport}
              disabled={loading}
              className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Test Report
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>

            <p className="mt-6 text-sm text-gray-500">
              This is for testing purposes only. Real assessments require completing all questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestReport;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, BarChart3, Target, Zap, Users, TrendingUp } from 'lucide-react';
import navviLogo from '../assets/navvi-logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: "67 Questions",
      subtitle: "Comprehensive",
      description: "Comprehensive assessment covering all critical business areas"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Industry Benchmarks", 
      subtitle: "Garment Mfg",
      description: "Garment manufacturing industry standards and performance comparisons"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Instant Results",
      subtitle: "Immediate", 
      description: "Immediate report generation with visual charts and traffic light system"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Expert Insights",
      subtitle: "Actionable",
      description: "Actionable recommendations and 90-day improvement roadmaps"
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Comprehensive Assessment",
      description: "67 diagnostic questions across 6 key business pillars with evidence-based validation"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      title: "Industry Benchmarks", 
      description: "Garment manufacturing industry standards and performance comparisons"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Instant Results",
      description: "Immediate report generation with visual charts and traffic light system"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "Expert Insights",
      description: "Actionable recommendations and 90-day improvement roadmaps"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Business Profile",
      description: "Provide basic information about your garment manufacturing business"
    },
    {
      number: "2", 
      title: "Assessment",
      description: "Answer 67 diagnostic questions across 6 key business pillars"
    },
    {
      number: "3",
      title: "Analysis", 
      description: "Advanced scoring with industry benchmarks and performance analysis"
    },
    {
      number: "4",
      title: "Results",
      description: "Receive detailed report with insights and actionable recommendations"
    }
  ];

  const stats = [
    { value: "45M+", label: "People employed in Indian textile sector" },
    { value: "75%", label: "Target efficiency for modern garment manufacturing" },
    { value: "$350B", label: "Projected Indian textile market by 2030" },
    { value: "10%", label: "Expected CAGR growth rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={navviLogo} alt="Navvi Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™</h1>
                <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Your Assessment
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            🎯 Powered by Industry Expertise
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Datrix™
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            The Unrivaled Business Intelligence Scanner
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Comprehensive 360° Business Health Assessment for Garment Manufacturing Excellence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Your Assessment
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="border-gray-300 text-gray-700 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{feature.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Datrix Section */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Datrix™?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive insights into your business health with our advanced assessment 
              tool designed specifically for the garment manufacturing industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 4-step process to get comprehensive business insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transform Business Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Business Performance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get actionable insights to improve efficiency, reduce costs, and drive growth in your garment manufacturing business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Identify Performance Gaps</h3>
                <p className="text-gray-600">Discover areas where your business can improve compared to industry standards</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prioritize Improvements</h3>
                <p className="text-gray-600">Get clear recommendations on which areas to focus on first for maximum impact</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your improvement journey with regular assessments and benchmarking</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your comprehensive business health assessment today and get actionable insights in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Your Assessment
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center text-blue-100 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Secure & Confidential
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Takes 15-20 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant Results
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={navviLogo} alt="Navvi Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold">Navvi Corporation</span>
          </div>
          <p className="text-gray-400">
            © 2024 Navvi Corporation. All rights reserved. | Datrix™ Business Intelligence Scanner
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserRegistration from './pages/UserRegistration';
import Assessment from './pages/AssessmentComplete';
import AssessmentToken from './pages/AssessmentToken';
import AssessmentAccess from './pages/AssessmentAccess';
import Results from './pages/ResultsComplete';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminPanelComplete from './pages/AdminPanelComplete';
import AdminInvitations from './pages/AdminInvitations';
import Verification from './pages/Verification';
import VerificationSuccess from './pages/VerificationSuccess';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Token-Based Assessment Flow (New System) */}
          <Route path="/assess/:token" element={<AssessmentAccess />} />
          <Route path="/assessment" element={<AssessmentToken />} />
          
          {/* Legacy Routes (Old System - Keep for backward compatibility) */}
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/assessment-old" element={<Assessment />} />
          
          {/* Results */}
          <Route path="/results" element={<Results />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminInvitations />} />
          <Route path="/admin/users" element={<AdminPanelComplete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Token-based assessment system deployed - Oct 17, 2025


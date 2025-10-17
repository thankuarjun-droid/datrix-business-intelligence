import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserRegistration from './pages/UserRegistration';
import Assessment from './pages/AssessmentComplete';
import AssessmentV2 from './pages/AssessmentV2';
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
          <Route path="/assessment" element={<AssessmentV2 />} />
          
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

// Enhanced UX/UI with 5-option scale and color highlighting - Oct 17, 2025 16:30 IST

// Force deployment Fri Oct 17 11:39:43 EDT 2025

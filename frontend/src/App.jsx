import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserRegistration from './pages/UserRegistration';
import Assessment from './pages/AssessmentComplete';
import Results from './pages/ResultsComplete';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminPanelComplete from './pages/AdminPanelComplete';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<AdminPanelComplete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


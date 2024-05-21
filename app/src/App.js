import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import Authentication from './components/Authentication';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ConfirmTokenForm from './components/ConfirmTokenForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import Logout from './components/Logout';
import BachelorCoursePage from './components/BachelorCoursePage';
import MasterCoursePage from './components/MasterCoursePage';
import SemesterPage from './components/SemesterPage';
import CourseOfficialPage from './components/CourseOfficialPage'; // Import CourseOfficialPage component

const App = () => {
  const [user, setUser] = useState(null);

  const handleSignUp = async (formData) => {
    console.log('Sign up:', formData);
  };

  const handleSignIn = async (formData) => {
    console.log('Sign in:', formData);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignUpForm onSubmit={handleSignUp} />} />
          <Route path="/signin" element={<SignInForm onSubmit={handleSignIn} />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/check-token" element={<ConfirmTokenForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/bachelor/:course" element={<BachelorCoursePage />} />
          <Route path="/master/:course" element={<MasterCoursePage />} />
          <Route path="/bachelor/:course/:semester" element={<SemesterPage />} />
          <Route path="/master/:course/:semester" element={<SemesterPage />} />
          <Route path="/:degree/:course/:semester/:courseName" element={<CourseOfficialPage />} /> {/* Add route for course official page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

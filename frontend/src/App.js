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
import CourseOfficialPage from './components/CourseOfficialPage';
import UserProfilePage from './components/UserProfilePage';
import NotificationsPage from './components/NotificationsPage';
import RegisterMentorPage from './components/RegisterMentorPage';
import BachelorFindMentor from './components/BachelorFindMentor';
import MasterFindMentor from './components/MasterFindMentor';
import CreateMeeting from './components/CreateMeeting';
import MeetingRoom from './components/MeetingRoom';
import SettingsPage from './components/SettingsPage';
import DiscussionForum from './components/DiscussionForum';

const App = () => {
  const [user, setUser] = useState(null);

  const handleSignUp = async (formData) => {
    console.log('Sign up:', formData);
  };

  const handleSignIn = async (formData) => {
    console.log('Sign in:', formData);
    setUser(formData); // Set the user data upon successful sign-in
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
          <Route path="/bachelor/:course" element={<BachelorCoursePage user={user} />} />
          <Route path="/master/:course" element={<MasterCoursePage user={user} />} />
          <Route path="/bachelor/:course/create-meeting" element={<CreateMeeting />} />
          <Route path="/master/:course/create-meeting" element={<CreateMeeting />} />
          <Route path="/bachelor/:course/meeting-room/:meetingId" element={<MeetingRoom />} />
          <Route path="/master/:course/meeting-room/:meetingId" element={<MeetingRoom />} />
          <Route path="/bachelor/:course/:semester" element={<SemesterPage />} />
          <Route path="/master/:course/:semester" element={<SemesterPage />} />
          <Route path="/:degree/:course/:semester/:courseName" element={<CourseOfficialPage />} />
          <Route path="/my-profile" element={<UserProfilePage user={user} />} />
          <Route path="/notifications" element={<NotificationsPage userData={user} />} />
          <Route path="/register-mentor" element={<RegisterMentorPage user={user} />} />
          <Route path="/bachelor/:course/find-mentor" element={<BachelorFindMentor />} />
          <Route path="/master/:course/find-mentor" element={<MasterFindMentor />} />
          <Route path="/bachelor/:course/DiscussionForum" element={<DiscussionForum />} />
          <Route path="/master/:course/DiscussionForum" element={<DiscussionForum />} />
          <Route path="/settings" element={<SettingsPage />} /> {/* Add the new route for SettingsPage */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

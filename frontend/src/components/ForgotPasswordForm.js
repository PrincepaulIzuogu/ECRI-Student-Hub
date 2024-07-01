// ForgotPasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSendingToken, setIsSendingToken] = useState(false); // State to track if token is being sent
  const navigate = useNavigate();

  const handleSendToken = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Sending token...');
    setIsSendingToken(true); // Set state to indicate sending token
    try {
      if (!email.endsWith('@stud.th-deg.de')) {
        throw new Error('Please enter a THD email');
      }
      await axios.post('https://ecristudenthub-backend.azurewebsites.net/send-token/', { email });
      console.log('Token sent successfully.');

      // Store email in local storage
      localStorage.setItem('resetEmail', email);

      navigate('/check-token'); // Redirect after sending token
    } catch (error) {
      console.error('Sending token failed:', error.message);
      setError(error.message);
    } finally {
      setIsSendingToken(false); // Reset state after token is sent or request fails
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSendToken}>
        <input type="email" placeholder="THD Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={isSendingToken}>
          {isSendingToken ? 'Sending Token...' : 'Send Token'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <Link to="/signin" className="signin-link">Sign In</Link>
    </div>
  );
};

export default ForgotPasswordForm;

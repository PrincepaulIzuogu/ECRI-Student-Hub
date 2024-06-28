import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(''); // State to store email
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user email from local storage when the component mounts
    const storedEmail = localStorage.getItem('resetEmail');
    setEmail(storedEmail);
  }, []); // Run only once when the component mounts

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if (password !== verifyPassword) {
        throw new Error('Passwords do not match');
      }
      if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,8}$/)) {
        throw new Error('Password must be a combination of letters and numbers, max 8 characters');
      }
      // Send the password reset request with the email and new password
      await axios.post('https://ecristudenthub-backend.azurewebsites.net/reset-password/', { email, password });
      // If the request succeeds, redirect to the sign-in page
      navigate('/signin');
    } catch (error) {
      console.error('Resetting password failed:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Email: {email}</p> {/* Display user's email */}
      <form onSubmit={handleResetPassword}>
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Verify New Password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
      {error && <div className="error">{error}</div>}
      <Link to="/signin" className="signin-link">Sign In</Link>
    </div>
  );
};

export default ResetPasswordForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ConfirmTokenForm.css';

const ConfirmTokenForm = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(''); // State to store email
  const navigate = useNavigate(); // Use useNavigate hook to obtain navigation function

  useEffect(() => {
    // Fetch user details when the component mounts
    const fetchUserDetails = async () => {
      try {
        // Fetch user email from local storage
        const storedEmail = localStorage.getItem('resetEmail');
        setEmail(storedEmail); // Set user's email
      } catch (error) {
        console.error('Fetching user details failed:', error.message);
      }
    };
    fetchUserDetails();
  }, []); // Run only once when the component mounts

  const handleConfirmToken = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post('https://ecristudenthub-backend.azurewebsites.net/confirm-token/', { token });
      console.log('Token confirmed:', response.data); // Log successful token confirmation
      // Store user email in local storage
      localStorage.setItem('resetEmail', email);
      // Redirect to reset password page
      navigate('/reset-password');
    } catch (error) {
      console.error('Confirming token failed:', error.response.data.detail);
      setError('Incorrect token');
    }
  };

  return (
    <div className="confirm-token-container">
      <h2>Confirm Token</h2>
      <p>Email: {email}</p> {/* Display user's email */}
      <form onSubmit={handleConfirmToken}>
        <input type="text" placeholder="Enter Token" value={token} onChange={(e) => setToken(e.target.value)} />
        <button type="submit">Confirm Token</button>
      </form>
      {error && <div className="error">{error}</div>}
      <Link to="/signin" className="signin-link">Sign In</Link>
    </div>
  );
};

export default ConfirmTokenForm;

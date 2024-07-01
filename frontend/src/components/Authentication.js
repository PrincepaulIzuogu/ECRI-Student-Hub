// Authentication.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Authentication.css';

const Authentication = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [timer, setTimer] = useState(100);
  const [tokenConfirmed, setTokenConfirmed] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get('https://ecristudenthub-backend.azurewebsites.net/user-details');
        const userData = response.data;
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    }

    fetchUserDetails();
  }, []); // Fetch user details on component mount

  useEffect(() => {
    let interval;
    if (tokenConfirmed) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(interval);
            handleTimerEnd();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tokenConfirmed]);

  useEffect(() => {
    if (timer === 0) {
      setTokenConfirmed(false);
    }
  }, [timer]);

  const confirmToken = async () => {
    try {
      const response = await axios.post('https://ecristudenthub-backend.azurewebsites.net/confirm-token', { token });
      if (response.data.message === "Token confirmed successfully") {
        setTokenConfirmed(true);
        navigate('/signin');
      }
    } catch (error) {
      console.error('Failed to confirm token:', error);
      setInvalidToken(true);
      setTimeout(() => {
        setInvalidToken(false);
      }, 3000);
    }
  };

  const handleTimerEnd = () => {
    setTokenConfirmed(false);
  };

  return (
    <div className="authentication-container">
      <div className="authentication-left">
        <h2>ECRI Student Hub</h2>
        <p>Almost Done! {username}</p>
        <p>Welcome to ECRI Student Hub!</p>
        <p>Please confirm your student email</p>
        <p> ({email})</p>
      </div>
      <div className="authentication-box">
        {tokenConfirmed ? (
          <div>
            <p>Email confirmed! You will be redirected to login.</p>
            <p>Redirecting in {timer} seconds...</p>
          </div>
        ) : (
          <div>
            <p>Enter the token received via email to confirm:</p>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
            <button onClick={confirmToken}>Confirm Token</button>
            {invalidToken && <div className="invalid-token-popup">Invalid token</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Authentication;

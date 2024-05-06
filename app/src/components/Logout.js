import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions (e.g., clear authentication tokens, reset session)
    // For demonstration purposes, we'll clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the sign-in page
    navigate('/signin');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;

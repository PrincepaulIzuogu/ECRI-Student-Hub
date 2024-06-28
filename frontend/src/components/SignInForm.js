import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignInForm.css';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', degreeProgram: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecristudenthub-backend.azurewebsites.net/login/', formData);
      console.log('Login successful:', response.data);
      const userData = response.data;
      const { courseOfStudy, degreeProgram } = userData;
      const courseOfStudySlug = courseOfStudy.toLowerCase().replace(/\s+/g, '-');

      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify(userData));

      if (degreeProgram === 'Bachelor') {
        navigate(`/bachelor/${courseOfStudySlug}`);
      } else if (degreeProgram === 'Master') {
        navigate(`/master/${courseOfStudySlug}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.detail);
      setError(error.response.data.detail);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <h2>ECRI Student Hub</h2>
        <p>Only registered and enrolled ECRI students</p>
        <p>can log in to use the app.</p>
      </div>
      <div className="signin-box">
        <h2>Sign In</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
          <div className="radio-container">
            <label>
              <input type="radio" name="degreeProgram" value="Bachelor" onChange={handleInputChange} checked={formData.degreeProgram === 'Bachelor'} />
              Bachelor
            </label>
            <label>
              <input type="radio" name="degreeProgram" value="Master" onChange={handleInputChange} checked={formData.degreeProgram === 'Master'} />
              Master
            </label>
          </div>
          <button type="submit">Sign In</button>
          {error && <div className="error">{error}</div>}
          <div className="forgot-password-links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="signin-links">
            <span>New User?</span>
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;

import React, { useState } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    courseOfStudy: '',
    semester: '',
    matriculationNumber: '',
    email: '',
    degreeProgram: '',
    password: '',
    verifyPassword: ''
  });
  const [error, setError] = useState(null);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDegreeChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, degreeProgram: value });
    // Filter course options based on selected degree program
    if (value === 'Bachelor') {
      setCourseOptions(bachelorCourses);
    } else if (value === 'Master') {
      setCourseOptions(masterCourses);
    } else {
      setCourseOptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if degree program is selected before submitting
    if (!formData.degreeProgram) {
      setError('Please select Degree Program first.');
      return;
    }

    // Password validation
    if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,8}$/)) {
      setError('Password must be a combination of letters and numbers, max 8 characters');
      return;
    }
  
    // Check if passwords match
    if (formData.password !== formData.verifyPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setIsSendingToken(true);
  
    try {
      const response = await axios.post('https://ecristudenthub-backend.azurewebsites.net/register/', formData);
      console.log('Registration successful:', response.data);
      navigate('/Authentication');
    } catch (error) {
      console.error('Registration failed:', error.response.data.detail);
      setError(error.response.data.detail);
    } finally {
      setIsSendingToken(false);
    }
  };
  

  // Define course options for Bachelor and Master
  const bachelorCourses = ['Building Products and Processes', 'Energy Systems Engineering', 'Health Informatics', 'Industrial Engineering', 'International Tourism Management'];

  const masterCourses = ['Digital Health', 'Global Public Health', 'Healthy Sustainable Buildings', 'International Tourism Development', 'Medical Informatics'];

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h2>ECRI Student Hub</h2>
        <p>Welcome to ECRI Student Hub!</p>
        <p>Please fill out the form to create an account.</p>
      </div>
      <div className="signup-box">
        <h2>Sign Up</h2>
      
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Radio buttons for Degree program */}
          <div className="radio-container">
            <label>
              <input type="radio" name="degreeProgram" value="Bachelor" onChange={handleDegreeChange} checked={formData.degreeProgram === 'Bachelor'} />
              Bachelor
            </label>
            <label>
              <input type="radio" name="degreeProgram" value="Master" onChange={handleDegreeChange} checked={formData.degreeProgram === 'Master'} />
              Master
            </label>
          </div>
          {/* Dropdown for Course of Study */}
          <select name="courseOfStudy" value={formData.courseOfStudy} onChange={handleInputChange} disabled={!formData.degreeProgram}>
            <option value="">Select Course of Study</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
          <input type="text" name="semester" placeholder="Semester" value={formData.semester} onChange={handleInputChange} />
          <input type="text" name="matriculationNumber" placeholder="Matriculation Number" value={formData.matriculationNumber} onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
          <input type="password" name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleInputChange} />
          <button type="submit" disabled={isSendingToken}>
            {isSendingToken ? 'Sending Token' : 'Sign Up'}
          </button>
          {error && <div className="error-message">{error}</div>}
          <div className="signup-links">
            <span>Already have an account?</span>
            <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;

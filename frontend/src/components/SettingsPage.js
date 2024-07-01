import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/SettingsPage.css';
import { FaHome, FaUser, FaBell, FaEnvelope, FaBars, FaCog, FaAddressBook, FaCalendarAlt } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import Logout from './Logout';

const SettingsPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    courseOfStudy: '',
    semester: '',
    matriculationNumber: '',
    degreeProgram: '',
    profile_picture: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newNotification, setNewNotification] = useState(false); 
  const { course } = useParams();

  useEffect(() => {
    // Retrieve user data from local storage when the component mounts
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('username', userData.username);
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('courseOfStudy', userData.courseOfStudy);
      formData.append('semester', userData.semester);
      formData.append('matriculationNumber', userData.matriculationNumber);
      formData.append('degreeProgram', userData.degreeProgram);

      if (profilePicture) {
        formData.append('file', profilePicture);
      }

      const userDataUpdateResponse = await axios.put('https://ecristudenthub-backend.azurewebsites.net/update-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (userDataUpdateResponse && userDataUpdateResponse.data) {
        const updatedUserData = userDataUpdateResponse.data.user;
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setMessage('Profile updated successfully');
        setProfilePicture(null);
        navigate('/my-profile');
      } else {
        setMessage('Error updating profile: No data returned');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    }
  };

  // Determine the home link based on the user's degree program
  const getHomeLink = () => {
    if (!userData) return "/";
    const { degreeProgram } = userData;
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${userData.courseOfStudy}`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${userData.courseOfStudy}`;
    }
    return "/";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getDashboardLink = () => {
    if (!userData) return "/dashboard";
    const { degreeProgram, courseOfStudy } = userData;
    const courseSlug = courseOfStudy.toLowerCase().replace(/\s+/g, '-');
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${courseSlug}/dashboard`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${courseSlug}/dashboard`;
    }
    return "/dashboard";
  };

  const getContactsLink = () => {
    if (!userData) return "/contacts";
    const { degreeProgram, courseOfStudy } = userData;
    const courseSlug = courseOfStudy.toLowerCase().replace(/\s+/g, '-');
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${courseSlug}/contacts`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${courseSlug}/contacts`;
    }
    return "/contacts";
  };

  return (
    <div className="bachelor-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          {userData && <DegreeWelcomeMessage degreeProgram={userData.degreeProgram} courseOfStudy={userData.courseOfStudy} />}
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon">
            {newNotification && !userData.profile_picture && <span className="notification-badge">1</span>}
            <FaUser />
          </Link>
          <Link to="/notifications" className="nav-icon"><FaBell /></Link>
          <Link to="/messages" className="nav-icon"><FaEnvelope /></Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars className="bars-icon" />
        </div>
      </div>
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
      <ul>
          <li><Link to="/settings"><FaCog className="nav-icon" /> Settings</Link></li>
          <li><Link to={getContactsLink()}><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to={getDashboardLink()}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
      <div className="settings-page">
        <h2>Settings</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label>Course of Study</label>
            <input
              type="text"
              name="courseOfStudy"
              value={userData.courseOfStudy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Semester</label>
            <input
              type="text"
              name="semester"
              value={userData.semester}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Matriculation Number</label>
            <input
              type="text"
              name="matriculationNumber"
              value={userData.matriculationNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Degree Program</label>
            <input
              type="text"
              name="degreeProgram"
              value={userData.degreeProgram}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

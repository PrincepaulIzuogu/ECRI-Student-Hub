import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaVideo, FaUserPlus, FaComments, FaSignOutAlt } from 'react-icons/fa'; // Importing FontAwesome icons
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/BachelorCoursePage.css'; // Import CSS file
import Logout from './Logout';

const BachelorCoursePage = () => {
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false); // State to track new notifications
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Retrieve user data from local storage when the component mounts
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));

      // Check if there is no profile picture for the user, set new notification state accordingly
      if (!JSON.parse(storedUserData).profile_picture) {
        setNewNotification(true);
      } else {
        setNewNotification(false); // If profile picture exists, no need for notification
      }
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine the home link based on the user's degree program
  const getHomeLink = () => {
    if (!userData) return "/";
    const { degreeProgram } = userData;
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${course}`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${course}`;
    }
    return "/";
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

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div className="bachelor-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          {/* Displaying welcome message with user data */}
          {userData && <DegreeWelcomeMessage degreeProgram={userData.degreeProgram} courseOfStudy={course} />}
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon">
            {/* Display notification icon with badge if there are new notifications and no profile picture */}
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

      <span className="date-time">{dateTime.toLocaleString()}</span>

      <div className="container">
        <div className="semester-buttons">
          {/* Example of semester buttons */}
          <Link className="semester-button" to={`/bachelor/${course}/semester-1`}>Semester 1</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-2`}>Semester 2</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-3`}>Semester 3</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-4`}>Semester 4</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-5`}>Semester 5</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-6`}>Semester 6</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-7`}>Semester 7</Link>
        </div>
      </div>
    </div>
  );
};

export default BachelorCoursePage;

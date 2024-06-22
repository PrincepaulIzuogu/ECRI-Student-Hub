import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaVideo, FaUserPlus, FaComments } from 'react-icons/fa'; // Importing FontAwesome icons
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/MasterCoursePage.css'; // Import CSS file
import Logout from './Logout';

const MasterCoursePage = () => {
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false); // State for notification

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Determine the home link based on the user's degree program
  const getHomeLink = () => {
    if (!userData) return "/";
    const { degreeProgram, courseOfStudy } = userData;
    const userCourse = course || courseOfStudy || 'default-course';
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${userCourse}`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${userCourse}`;
    }
    return "/";
  };

  return (
    <div className="master-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          {userData && <DegreeWelcomeMessage degreeProgram="Master" courseOfStudy={course || userData.courseOfStudy} />}
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
          <li><Link to="/contacts"><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <span className="date-time">{dateTime.toLocaleString()}</span>

      <div className="master-container">
        <div className="master-semester-buttons">
          <Link className="master-semester-button" to={`/master/${course}/semester-1`}>Semester 1</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-2`}>Semester 2</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-3`}>Semester 3</Link>
        </div>
        <span className="date-time">{dateTime.toLocaleString()}</span>

        
      </div>
    </div>
  );
};

export default MasterCoursePage;


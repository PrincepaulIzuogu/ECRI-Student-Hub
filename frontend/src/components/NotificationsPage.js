import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook } from 'react-icons/fa'; // Importing FontAwesome icons
import Logout from './Logout';
import '../styles/NotificationsPage.css'; // Import CSS file

const NotificationsPage = ({ userData, course }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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


  return (
    <div className="notifications-page">
      <div className="top-nav">
        <div className="welcome-message">
          {/* Displaying welcome message with user data */}
          {userData && (
            <div className="notification-message">
              {userData.profile_picture ? (
                <span>No new notifications</span>
              ) : (
                <span>1 new message: Please upload a profile picture to attract more connections.</span>
              )}
            </div>
          )}
        </div>
        <div className="nav-icons">
          {/* Update the home link */}
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon"><FaUser /></Link>
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
    </div>
  );
};

export default NotificationsPage;

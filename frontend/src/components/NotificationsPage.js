import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook } from 'react-icons/fa';
import Logout from './Logout';
import '../styles/NotificationsPage.css';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';

const NotificationsPage = () => {
  const { course } = useParams();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    // Load notifications (reminders) from local storage
    const storedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const notifications = storedReminders.map(reminder => ({
      id: reminder.id,
      message: `Reminder: ${reminder.message}`,
      timestamp: new Date(reminder.datetime) // Use datetime for timestamp
    }));
    setNotifications(notifications);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prevNotifications => {
        return prevNotifications.map(notification => ({
          ...notification,
          timeRemaining: getTimeRemaining(notification.timestamp)
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (timestamp) => {
    const now = new Date();
    const timeDiff = new Date(timestamp) - now;

    if (timeDiff <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
    <div className="notifications-page">
      <div className="top-nav">
        <div className="welcome-message">
          {userData && <DegreeWelcomeMessage degreeProgram={userData.degreeProgram} courseOfStudy={course || userData.courseOfStudy} />}
        </div>
        <div className="nav-icons">
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
          <li><Link to={getContactsLink()}><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to={getDashboardLink()}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications yet, you will see all notifications here when they arrive.</div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              <p>{notification.message}</p>
              <span className="timestamp">{new Date(notification.timestamp).toLocaleString()}</span>
              <span className="countdown">{notification.timeRemaining}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

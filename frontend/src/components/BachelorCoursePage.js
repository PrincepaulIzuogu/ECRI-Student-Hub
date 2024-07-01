import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaVideo, FaUserPlus, FaComments } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/BachelorCoursePage.css';
import Logout from './Logout';

const BachelorCoursePage = ({ user }) => {
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0); // State to track unread notifications
  const [messages, setMessages] = useState([]);
  const [lastMessageCheckTime, setLastMessageCheckTime] = useState(null); // Track the last message check time

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      if (!JSON.parse(storedUserData).profile_picture) {
        setNewNotification(true);
      } else {
        setNewNotification(false);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userData) {
      const storedLastMessageCheckTime = localStorage.getItem('lastMessageCheckTime');
      if (storedLastMessageCheckTime) {
        setLastMessageCheckTime(new Date(storedLastMessageCheckTime));
      }
      fetchReceivedMessages(userData.email);
      fetchNotifications(); // Fetch notifications when userData is available
    }
  }, [userData]);

  const fetchReceivedMessages = async (receiverEmail) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/received?receiver_email=${receiverEmail}`);
      setMessages(response.data);
      const unreadMessages = response.data.filter(message => !message.read).length;
      setUnreadCount(unreadMessages);

      // Update last message check time to now
      localStorage.setItem('lastMessageCheckTime', new Date().toISOString());
      setLastMessageCheckTime(new Date());
    } catch (error) {
      console.error('Error fetching received messages:', error);
    }
  };

  const fetchNotifications = () => {
    const storedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    setNotificationsCount(storedReminders.length);
  };

  const handleMessagesClick = async () => {
    // Check if there are unread messages since last check
    if (lastMessageCheckTime && messages.some(message => !message.read && new Date(message.timestamp) > lastMessageCheckTime)) {
      // Get unread message IDs
      const unreadMessageIds = messages.filter(message => !message.read).map(message => message.id);
      if (unreadMessageIds.length > 0) {
        try {
          // Mark messages as read on the server
          await axios.post('http://127.0.0.1:8000/messages/mark-read', { messageIds: unreadMessageIds });
          // Fetch messages again to update read status
          fetchReceivedMessages(userData.email);
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    }
  };

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

  const handleDashboardClick = async () => {
    if (!userData) {
      alert("No user data found");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/search-mentor', { email: userData.email });
      if (response.data.isMentor) {
        navigate(getDashboardLink());
      } else {
        alert("Only registered Mentors can use this feature");
      }
    } catch (error) {
      console.error('Error checking mentor status:', error);
      alert("An error occurred while checking mentor status");
    }
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
          {userData && <DegreeWelcomeMessage degreeProgram={userData.degreeProgram} courseOfStudy={course} />}
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon">
            {newNotification && !userData.profile_picture && <span className="notification-badge">1</span>}
            <FaUser />
          </Link>
          <Link to="/notifications" className="nav-icon">
            <FaBell />
            {notificationsCount > 0 && <span className="notification-count">{notificationsCount}</span>}
          </Link>
          <Link to="/messages" className="nav-icon">
            <FaEnvelope />
            {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
          </Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars className="bars-icon" />
        </div>
      </div>

      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/settings"><FaCog className="nav-icon" /> Settings</Link></li>
          <li><Link to={getContactsLink()}><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link onClick={handleDashboardClick}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <span className="date-time">{dateTime.toLocaleString()}</span>

      <div className="container">
        <div className="action-buttons">
          <div className="action-button">
            <Link to={`/bachelor/${course}/find-mentor`}>
              <div className="action-icon" style={{ backgroundColor: '#FF5733' }}>
                <FaUser />
              </div>
              <div className="action-label">Find a Mentor</div>
            </Link>
          </div>
          <div className="action-button">
            <Link to={`/bachelor/${course}/create-meeting`}>
              <div className="action-icon" style={{ backgroundColor: '#33AFFF' }}>
                <FaVideo />
              </div>
              <div className="action-label">Create Meeting</div>
            </Link>
          </div>
          <div className="action-button">
            <Link to={`/bachelor/${course}/DiscussionForum`}>
              <div className="action-icon" style={{ backgroundColor: '#33AFFF' }}>
                <FaComments />
              </div>
              <div className="action-label">Discussion Forum</div>
            </Link>
          </div>
          <div className="action-button">
            <Link to="/register-mentor">
              <div className="action-icon" style={{ backgroundColor: '#33AFFF' }}>
                <FaUserPlus />
              </div>
              <div className="action-label">Register as Mentor</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorCoursePage;

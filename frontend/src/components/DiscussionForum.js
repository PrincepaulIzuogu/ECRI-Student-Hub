import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/DiscussionForum.css';
import Logout from './Logout';

const DiscussionForum = () => {
  const [userData, setUserData] = useState(null); // Initialize as null until loaded
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages
  const [sendingMessage, setSendingMessage] = useState(false); // Loading state for sending message

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await axios.get('https://ecristudenthub-backend.azurewebsites.net/messages/');
      const sortedMessages = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      return; // Don't send empty messages
    }

    setSendingMessage(true);
    try {
      const newMessage = {
        sender_username: userData.username,
        sender_email: userData.email,
        content: messageContent.trim(),
      };

      console.log('Sending message:', newMessage); // Log the message data before sending

      const response = await axios.post('https://ecristudenthub-backend.azurewebsites.net/messages/', newMessage);
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
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

  const logout = () => {
    // Implement your logout logic here, such as clearing localStorage
    localStorage.removeItem('userData');
    setUserData(null); // Clear userData state
  };

  return (
    <div className="discussion-forum-page">
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
          <li><Logout onLogout={logout} /></li> {/* Pass logout function to logout component */}
        </ul>
      </nav>

      <div className="discussion-forum">
        <div className="messages">
          {loadingMessages ? (
            <p className="loading">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="no-messages">Start a chat :)</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender_username === userData.username ? 'current-user' : 'other-users'}`}>
                <p className="main_message">{msg.content}</p>
                <p><strong>{msg.sender_username}</strong> ({msg.sender_email})</p>
                <p><em>{new Date(msg.timestamp).toLocaleString()}</em></p>
              </div>
            ))
          )}
        </div>
        <div className="message-input">
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage} disabled={sendingMessage}> {/* Disable button during sending */}
            {sendingMessage ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;


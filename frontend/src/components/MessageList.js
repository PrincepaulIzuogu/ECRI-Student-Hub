import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/Message.css';
import Logout from './Logout'; // Import Logout component

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [content, setContent] = useState('');
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('received');
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getHomeLink = () => {
    if (!userData) return '/';
    const { degreeProgram, courseOfStudy } = userData;
    const userCourse = course || courseOfStudy || 'default-course';
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${userCourse}`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${userCourse}`;
    }
    return '/';
  };

  useEffect(() => {
    if (userData) {
      fetchReceivedMessages(userData.email);
      fetchSentMessages(userData.email);
    }
  }, [userData]);

  const fetchReceivedMessages = async (receiverEmail) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/received?receiver_email=${receiverEmail}`);
      const updatedMessages = response.data.map(message => ({
        ...message,
        read: message.read || false // Set read status to false if not present
      }));
      setMessages(updatedMessages);
      const unreadMessages = updatedMessages.filter(message => !message.read).length;
      setUnreadCount(unreadMessages);
    } catch (error) {
      console.error('Error fetching received messages:', error);
    }
  };

  const fetchSentMessages = async (senderEmail) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/sent?sender_email=${senderEmail}`);
      setSentMessages(response.data);
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/messages/send', {
        sender_email: userData.email,
        receiver_email: receiverEmail,
        content: content,
      });
      const sentMessage = response.data;

      
      setContent('');
      setReceiverEmail('');
      fetchSentMessages(userData.email);
      setView('sent');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Chat already exists');
      } else {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
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
    <div className="message-page">
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

      <div className="content">
        <div className="message-form">
          <h2>Send Message</h2>
          <form onSubmit={handleSend}>
            <label htmlFor="receiverEmail">To:</label>
            <input
              type="email"
              id="receiverEmail"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
            />
            <label htmlFor="content">Message:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>

        <div className="message-list">
          <div className="message-view-toggle">
            <button onClick={() => setView('received')}>Received Messages</button>
            <button onClick={() => setView('sent')}>Sent Messages</button>
          </div>

          {view === 'received' ? (
            <div className="message-container">
              <h2>Received Messages</h2>
              {messages.length === 0 ? (
                <p className="no-messages">No messages received yet.</p>
              ) : (
                <ul>
                  {messages.map((message) => (
                    <li
                      key={message.id}
                      className={message.read ? 'read' : 'unread'}
                      
                    >
                      <div className="message-info">
                        <FaUser />
                        <span>{message.sender_email}</span>
                      </div>
                      <div className="message-content">{message.content}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="message-container">
              <h2>Sent Messages</h2>
              {sentMessages.length === 0 ? (
                <p className="no-messages">No messages sent yet.</p>
              ) : (
                <ul>
                  {sentMessages.map((message) => (
                    <li
                      key={message.id}
                      // onClick={() => handleMessageClick(message.receiver_email, message.receiver_id)} Remove onClick
                    >
                      <div className="message-info">
                        <FaUser />
                        <span>{message.receiver_email}</span>
                      </div>
                      <div className="message-content">{message.content}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;

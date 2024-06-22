import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/DiscussionForum.css';

const DiscussionForum = () => {
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
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/messages/');
      const sortedMessages = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        sender_username: userData.username,
        sender_email: userData.email,
        content: messageContent,
      };
      await axios.post('http://127.0.0.1:8000/messages/', newMessage);
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
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
          <li><Link to="/contacts"><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
        </ul>
      </nav>

      <div className="discussion-forum">
  <div className="messages">
    {messages.length === 0 ? (
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
  </div>
        <div className="message-input">
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
  );
};

export default DiscussionForum;


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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Retrieve user data from local storage when the component mounts
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <div className="master-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          {userData && <DegreeWelcomeMessage degreeProgram="Master" courseOfStudy={course} />}
        </div>
        <div className="nav-icons">
          <Link to="/" className="nav-icon"><FaHome /></Link>
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

      <span className="date-time">{dateTime.toLocaleString()}</span>

      <div className="master-container">
        <div className="master-semester-buttons">
          <Link className="master-semester-button" to={`/master/${course}/semester-1`}>Semester 1</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-2`}>Semester 2</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-3`}>Semester 3</Link>
        </div>
        <span className="date-time">{dateTime.toLocaleString()}</span>

        <div className="action-buttons">
          <div className="action-button">
            <Link to="/find-mentor">
              <div className="action-icon" style={{ backgroundColor: '#FF5733' }}>
                <FaUser />
              </div>
              <div className="action-label">Find a Mentor</div>
            </Link>
          </div>
          <div className="action-button">
            <Link to="/create-meeting">
              <div className="action-icon" style={{ backgroundColor: '#33AFFF' }}>
                <FaVideo />
              </div>
              <div className="action-label">Create Meeting</div>
            </Link>
          </div>
          <div className="action-button">
            <Link to="/discussion-forum">
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

export default MasterCoursePage;

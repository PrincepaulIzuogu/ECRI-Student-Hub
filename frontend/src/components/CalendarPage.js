import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaSignOutAlt } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Logout from './Logout';
import '../styles/CalendarPage.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const { course } = useParams();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    // Load reminders from local storage
    const storedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    setReminders(storedReminders);
  }, []);

  const onChange = (date) => {
    setDate(date);
  };

  const addReminder = () => {
    if (!reminderMessage || !reminderTime) {
      setConfirmationMessage('Please enter a valid reminder message and time.');
      return;
    }

    const newReminder = {
      id: reminders.length + 1,
      message: reminderMessage,
      datetime: new Date(`${date.toDateString()} ${reminderTime}`)
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);

    // Update local storage with new reminders
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));

    // Show confirmation message
    setConfirmationMessage('Reminder added to your notifications.');
    setTimeout(() => setConfirmationMessage(''), 3000);

    // Reset input fields
    setReminderMessage('');
    setReminderTime('');
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);

    // Update local storage with new reminders
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login'); // Navigate to login page after logout
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
    <div className="calendar-page">
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
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars className="bars-icon" />
        </div>
      </div>
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/settings"><FaCog className="nav-icon" /> Settings</Link></li>
          <li><Link to={getContactsLink()}><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to={getDashboardLink()}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
      <div className="calendar-page-content">
        <h2>My Calendar</h2>
        <Calendar
          onChange={onChange}
          value={date}
        />
        <div className="reminder-form">
          <input
            type="text"
            placeholder="Reminder Message"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <button onClick={addReminder}>Add Reminder</button>
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>
        <div className="reminders">
          <h3>My Reminders</h3>
          <ul>
            {reminders.map(reminder => (
              <li key={reminder.id}>
                <p>{reminder.message}</p>
                <p>{new Date(reminder.datetime).toLocaleString()}</p>
                <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import '../styles/CreateMeeting.css'; // Import CSS file

const CreateMeeting = () => {
  const { course } = useParams();
  const [meetingName, setMeetingName] = useState('');
  const privacyOptions = ['public']; // Privacy options available
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!/^[^\s]+$/.test(meetingName)) {
      setError('Meeting name must be a single word without spaces.');
      setIsLoading(false);
      return;
    }

    try {
      const checkResponse = await axios.post('http://127.0.0.1:8000/api/check-meeting-name', {
        name: meetingName
      });

      if (checkResponse.data.exists) {
        setError('Meeting name has already been used. Please choose another one.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/api/create-meeting', {
        name: meetingName,
        privacy: 'public',
        email: userData.email // Pass email instead of user_id
      });
      
      setMeetingUrl(response.data.room_url);
    } catch (error) {
      setError('Failed to create meeting. Please try again.');
      console.error('Error creating meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('email', userData.email); // Include the email of the current user

      try {
        const response = await axios.post('http://localhost:8000/upload-profile-picture/', formData);

        if (response.data.file_path) {
          const updatedUserData = { ...userData, profile_picture: response.data.file_path };
          setUserData(updatedUserData);
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  const getInviteMenteeLink = () => {
    // Assuming your meeting name is URL-safe (no spaces or special characters)
    const encodedMeetingName = encodeURIComponent(meetingName);
    return `Invite Mentee : https://ecristudenthub.daily.co/${encodedMeetingName}`;
  };

  return (
    <div className="bachelor-course-page">
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

      <div className="create-meeting-container">
        <h2>Create a New Meeting</h2>
        <form onSubmit={handleCreateMeeting}>
          <div>
            <label htmlFor="meetingName">Meeting Name:</label>
            <input
              type="text"
              id="meetingName"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="privacy">Privacy:</label>
            <select
              id="privacy"
              value={privacyOptions[0]} // Always set to 'public'
              disabled
            >
              {privacyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Meeting'}
          </button>
        </form>
        {error && (
          <div className="error-popup">
            <FaExclamationCircle /> {error}
          </div>
        )}
        {meetingUrl && (
          <div>
            <p>Meeting created successfully!</p>
            <a href={meetingUrl} target="_blank" rel="noopener noreferrer">Join Meeting</a>
            <br />
            <p>{getInviteMenteeLink()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;

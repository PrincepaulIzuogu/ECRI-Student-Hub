import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaBars,
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaCog,
  FaCalendarAlt,
  FaAddressBook,
} from 'react-icons/fa';
import Logout from './Logout'; // Assuming you have a Logout component
import '../styles/DashboardPage.css'; // Import CSS file

const Contacts = () => {
  const { degree, course, semester } = useParams();
  const [mentees, setMentees] = useState([]);
  const [filteredMentees, setFilteredMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order state

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      if (!parsedUserData.profile_picture) {
        setNewNotification(true);
      } else {
        setNewNotification(false);
      }

      // Fetch mentees data when userData is set
      fetchMentees(parsedUserData.email);
    }
  }, []);

  useEffect(() => {
    filterMentees();
  }, [mentees, searchTerm, selectAll, sortOrder]);

  const fetchMentees = async (email) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://ecristudenthub-backend.azurewebsites.net/api/getMentees',
        { email }
      );
      setMentees(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getHomeLink = () => {
    if (!userData) return '/';
    const { degreeProgram } = userData;
    if (degreeProgram.toLowerCase().includes('bachelor')) {
      return `/bachelor/${course}`;
    } else if (degreeProgram.toLowerCase().includes('master')) {
      return `/master/${course}`;
    }
    return '/';
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterMentees = () => {
    let filtered = mentees.filter(
      (mentee) =>
        mentee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.courseOfStudy
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mentee.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectAll) {
      filtered = filtered.map((mentee) => ({
        ...mentee,
        selected: true,
      }));
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => (a.username > b.username ? 1 : -1));
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => (a.username < b.username ? 1 : -1));
    }

    setFilteredMentees(filtered);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
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

  const renderMenteesTable = () => {
    return (
      <table className="mentees-table">
        <thead>
          <tr>
            <th>Mentor</th>
            <th>Email</th>
            <th>Course to be Mentored</th>
            <th>Course to be Mentored semester</th>
            <th>MeetingDays</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : filteredMentees.length === 0 ? (
            <tr>
              <td colSpan="6">No mentors found.</td>
            </tr>
          ) : (
            filteredMentees.map((mentee, index) => (
              <tr key={index}>
                <td>{mentee.username}</td>
                <td>{mentee.email}</td>
                <td>{mentee.semester}</td>
                <td>{mentee.courseOfStudy}</td>
                <td>{mentee.course_name}</td>
                <td>
                  <button
                    className="message-button"
                    disabled={filteredMentees.length === 0}
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="top-nav">
        <div className="welcome-message">
          <h2>
            Mentee's Dashboard for {degree} {course} {semester}
          </h2>
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon">
            <FaHome />
          </Link>
          <Link to="/my-profile" className="nav-icon">
            {newNotification && !userData.profile_picture && (
              <span className="notification-badge">1</span>
            )}
            <FaUser />
          </Link>
          <Link to="/notifications" className="nav-icon">
            <FaBell />
          </Link>
          <Link to="/messages" className="nav-icon">
            <FaEnvelope />
          </Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars className="bars-icon" />
        </div>
      </div>
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/settings">
              <FaCog className="nav-icon" /> Settings
            </Link>
          </li>
          <li><Link to={getDashboardLink()}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li>
            <Link to="/calendar">
              <FaCalendarAlt className="nav-icon" /> Calendar
            </Link>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </nav>

      <div className="dashboard-content">
        <div className="search-filter-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="search-button" onClick={filterMentees}>
              Search
            </button>
          </div>
          <div className="select-options">
            <label>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              Select All
            </label>
            <button className="select-button">Select Mentor</button>
          </div>
          <div className="sort-dropdown">
            <label>
              Sort by:{' '}
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mentees-list">
          <h3>Mentor List</h3>
          {renderMenteesTable()}
        </div>
      </div>
    </div>
  );
};

export default Contacts;

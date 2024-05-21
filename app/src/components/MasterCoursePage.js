import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Importing FontAwesome bars icon
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import Logout from './Logout';
import '../styles/MasterCoursePage.css'; // Import CSS file

const MasterCoursePage = () => {
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="master-course-page">
      <div className="menu-icon" onClick={toggleMenu}>
        <FaBars className="bars-icon" />
      </div>
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/my-profile">My Profile</Link></li>
          <li><Link to="/discussion-forum">Discussion Forum</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
      <div className="degree-welcome-container">
        <DegreeWelcomeMessage degreeProgram="Master" courseOfStudy={course} />
      </div>
      <div className="container">
        <div className="master-semester-buttons">
          <Link className="master-semester-button" to={`/master/${course}/semester-1`}>Semester 1</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-2`}>Semester 2</Link>
          <Link className="master-semester-button" to={`/master/${course}/semester-3`}>Semester 3</Link>
        </div>
      </div>
    </div>
  );
};

export default MasterCoursePage;

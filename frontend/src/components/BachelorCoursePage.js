import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Importing FontAwesome bars icon
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import Logout from './Logout';
import '../styles/BachelorCoursePage.css'; // Import CSS file

const BachelorCoursePage = () => {
  const { course } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bachelor-course-page">
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
        <DegreeWelcomeMessage degreeProgram="Bachelor" courseOfStudy={course} />
      </div>
      <div className="container">
        <div className="semester-buttons">
          <Link className="semester-button" to={`/bachelor/${course}/semester-1`}>Semester 1</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-2`}>Semester 2</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-3`}>Semester 3</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-4`}>Semester 4</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-5`}>Semester 5</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-6`}>Semester 6</Link>
          <Link className="semester-button" to={`/bachelor/${course}/semester-7`}>Semester 7</Link>
        </div>
      </div>
    </div>
  );
};

export default BachelorCoursePage;

// MasterCoursePage.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DegreeWelcomeMessage from './DegreeWelcomeMessage'; // Import DegreeWelcomeMessage component
import Logout from './Logout'; // Import Logout component


const MasterCoursePage = () => {
  const { course } = useParams(); // Get the course parameter from the route
  return (
    <div>
      <DegreeWelcomeMessage degreeProgram="Master" courseOfStudy={course} /> {/* Pass course as courseOfStudy prop */}
      <nav>
        <ul>
          <li><Link to={`/master/${course}/semester-1`}>Semester 1</Link></li>
          <li><Link to={`/master/${course}/semester-2`}>Semester 2</Link></li>
          <li><Link to={`/master/${course}/semester-3`}>Semester 3</Link></li>
          {/* Add links for other semesters */}
        </ul>
      </nav>
      <Logout /> {/* Add Logout button */}
    </div>
  );
};

export default MasterCoursePage;

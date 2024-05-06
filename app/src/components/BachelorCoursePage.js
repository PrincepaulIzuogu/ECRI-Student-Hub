// BachelorCoursePage.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DegreeWelcomeMessage from './DegreeWelcomeMessage'; // Import DegreeWelcomeMessage component
import Logout from './Logout'; // Import Logout component

const BachelorCoursePage = () => {
  const { course } = useParams(); // Get the course parameter from the route
  return (
    <div>
      <DegreeWelcomeMessage degreeProgram="Bachelor" courseOfStudy={course} /> {/* Pass course as courseOfStudy prop */}
      <nav>
        <ul>
          <li><Link to={`/bachelor/${course}/semester-1`}>Semester 1</Link></li>
          <li><Link to={`/bachelor/${course}/semester-2`}>Semester 2</Link></li>
          <li><Link to={`/bachelor/${course}/semester-3`}>Semester 3</Link></li>
          <li><Link to={`/bachelor/${course}/semester-4`}>Semester 4</Link></li>
          <li><Link to={`/bachelor/${course}/semester-5`}>Semester 5</Link></li>
          <li><Link to={`/bachelor/${course}/semester-6`}>Semester 6</Link></li>
          <li><Link to={`/bachelor/${course}/semester-7`}>Semester 7</Link></li>
          {/* Add links for other semesters */}
        </ul>
      </nav>
      <Logout /> {/* Add Logout button */}
    </div>
  );
};

export default BachelorCoursePage;



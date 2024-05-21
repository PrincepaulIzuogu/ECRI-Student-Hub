import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CourseOfficialPage.css';

const CourseOfficialPage = () => {
  const { degree, course, semester, courseName } = useParams();

  return (
    <div>
      <h2>{courseName} Official Page</h2>
      <p>This is the official page for {courseName} in {degree} {course}, Semester {semester}.</p>
      {/* Add more content or link to external official page if available */}
    </div>
  );
};

export default CourseOfficialPage;

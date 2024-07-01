// DegreeWelcomeMessage.js
import React from 'react';
import '../styles/BachelorCoursePage.css';

const DegreeWelcomeMessage = ({ degreeProgram, courseOfStudy }) => {
  return (
    <div>
      <h2>Welcome to the {degreeProgram} Program: {courseOfStudy}</h2>
    </div>
  );
};

export default DegreeWelcomeMessage;
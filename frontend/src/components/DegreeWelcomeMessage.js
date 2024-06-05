// DegreeWelcomeMessage.js
import React from 'react';

const DegreeWelcomeMessage = ({ degreeProgram, courseOfStudy }) => {
  return (
    <div>
      <h2>Welcome to the {degreeProgram} Program: {courseOfStudy}</h2>
    </div>
  );
};

export default DegreeWelcomeMessage;
import React from 'react';

const DegreeWelcomeMessage = ({ username, degreeProgram, courseOfStudy }) => {
  return (
    <div>
      <h2>ECRI Student Hub</h2>
      <p>Hello, {username}</p>
      <h2>Welcome to the {degreeProgram} Program: {courseOfStudy}</h2>
    </div>
  );
};

export default DegreeWelcomeMessage;

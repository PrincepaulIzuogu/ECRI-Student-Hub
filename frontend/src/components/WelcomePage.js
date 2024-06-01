import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSpring, animated } from 'react-spring';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the welcome text after a delay
    const timeoutId = setTimeout(() => {
      setShowWelcomeText(true);
    }, 500);

    // Clean up the timeout to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  // Animation config for sliding in the text
  const welcomeAnimation = useSpring({
    opacity: showWelcomeText ? 1 : 0,
    transform: showWelcomeText ? 'translateY(0)' : 'translateY(-50px)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    delay: 500
  });

  const descriptionAnimation = useSpring({
    opacity: showWelcomeText ? 1 : 0,
    transform: showWelcomeText ? 'translateY(0)' : 'translateY(-50px)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    delay: 1000
  });

  const buttonAnimation = useSpring({
    opacity: showWelcomeText ? 1 : 0,
    transform: showWelcomeText ? 'translateY(0)' : 'translateY(-50px)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    delay: 1500 // Adjust the delay to appear after the description
  });

  const handleContinue = () => {
    navigate('/signin');
  };

  return (
    <div className="welcome-container">
      <animated.div className="welcome-text" style={welcomeAnimation}>
        Welcome to the ECRI Student Hub
      </animated.div>
      <animated.div className="description" style={descriptionAnimation}>
        A Student only App that facilitates connections between senior students (mentors) and junior students (mentees) within the university community.
      </animated.div>
      {showWelcomeText && (
        <animated.button className="continue-button" style={buttonAnimation} onClick={handleContinue}>
          Continue
        </animated.button>
      )}
    </div>
  );
};

export default WelcomePage;

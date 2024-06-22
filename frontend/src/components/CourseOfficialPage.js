import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaStar } from 'react-icons/fa';
import Logout from './Logout'; // Assuming you have a Logout component
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import '../styles/CourseOfficialPage.css';

const stripePromise = loadStripe("pk_test_51PTo6n2MU8gPiBkpILyDgrN76F2O8Of3Pi8sbv87yPcON43DQefPjLq3RivXz4GEH8TAWRr7h4Dt7RjfEEHGSYiB00D71vWN2d");

const CourseOfficialPage = () => {
  const { degree, course, semester, courseName } = useParams();
  const [mentors, setMentors] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isPaidMentee, setIsPaidMentee] = useState(false);
  const [ratings, setRatings] = useState({});
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/bachelor-find-mentor/`, {
          params: {
            degreeProgram: degree,
            courseOfStudy: course,
            currentCourse: courseName,
            courseToMentorSemester: semester
          }
        });
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchData();
  }, [degree, course, semester, courseName]);

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
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const checkPaidMentee = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/check-paid-mentee/${encodeURIComponent(userData.email)}`);
          setIsPaidMentee(response.data.is_paid_mentee);
        } catch (error) {
          console.error('Error checking paid mentee status:', error);
        }
      };

      checkPaidMentee();
    }
  }, [userData]);

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

  const handleBookNow = async (mentorEmail) => {
    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://127.0.0.1:8000/create-checkout-session/', {
        mentor_email: mentorEmail,
      });
      const sessionId = response.data.id;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error:', error);
        return;
      }

      const menteeData = {
        mentorEmail,
        courseName,
        studentEmail: userData.email,
      };

      await axios.post('http://127.0.0.1:8000/save-mentee/', menteeData);

    } catch (error) {
      console.error('Error creating or processing checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (event) => {
    setSelectedRating(parseInt(event.target.value));
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitRating = async (mentorId) => {
    try {
      const ratingData = {
        rating: selectedRating,
        review: reviewText,
        user_id: userData.id,
        mentor_id: mentorId,
      };

      await axios.post('http://127.0.0.1:8000/rate-mentor/', ratingData);

      const updatedRatings = { ...ratings };
      updatedRatings[mentorId] = [
        ...(updatedRatings[mentorId] || []),
        { rating: selectedRating, review: reviewText, user_id: userData.id },
      ];
      setRatings(updatedRatings);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="bachelor-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          <h2>{semester} Courses for {degree} {course}</h2>
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon">
            {newNotification && !userData.profile_picture && <span className="notification-badge">1</span>}
            <FaUser />
          </Link>
          <Link to="/notifications" className="nav-icon"><FaBell /></Link>
          <Link to="/messages" className="nav-icon"><FaEnvelope /></Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars className="bars-icon" />
        </div>
      </div>
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/settings"><FaCog className="nav-icon" /> Settings</Link></li>
          <li><Link to="/contacts"><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="heading">
        <p>This is the official page for {courseName} in {degree} {course}, Semester {semester}.</p>
      </div>

      <div className="mentors-list">
        <h3>Mentors for {courseName}</h3>
        <ul>
          {mentors.length > 0 ? (
            mentors.map(mentor => (
              <li key={mentor.email} className="mentor-item">
                <div className="mentor-info">
                  <img className="mentor-profile-pic" src={`http://127.0.0.1:8000/${mentor.profile_picture}`} alt={`${mentor.firstName} ${mentor.lastName}`} /><br />
                  <div className="mentor-detail"><strong>Name:</strong> {mentor.firstName} {mentor.lastName}</div>
                  <div className="mentor-detail"><strong>Email:</strong> {mentor.email}</div>
                  <div className="mentor-detail"><strong>Grade:</strong> {mentor.grade || 'N/A'}</div>
                  <div className="mentor-detail"><strong>Tutor Days:</strong> {mentor.tutorDays}</div>
                </div>
                <div className="mentor-booking">
                  <div><strong>Price:</strong> 10 Euros</div>
                  <Elements stripe={stripePromise}>
                    <button className="book-now-button" onClick={() => handleBookNow(mentor.email)} disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Book Now'}
                    </button>
                  </Elements>
                </div>
                <div className="mentor-ratings">
                  <h4>Ratings</h4>
                  {ratings[mentor.id] && ratings[mentor.id].length > 0 ? (
                    ratings[mentor.id].map((rating, index) => (
                      <div key={index}>
                        <FaStar color="gold" /> {rating.rating}
                        <p>{rating.review}</p>
                      </div>
                    ))
                  ) : (
                    <p>No ratings or reviews yet.</p>
                  )}
                  {isPaidMentee && (
                    <div className="rating-form">
                      <h4>Submit Your Rating</h4>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label key={star}>
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              checked={selectedRating === star}
                              onChange={handleRatingChange}
                            />
                            <FaStar color="gold" />
                          </label>
                        ))}
                      </div>
                      <textarea
                        rows="3"
                        cols="50"
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={handleReviewChange}
                      ></textarea>
                      <button className="submit-rating-button" onClick={() => handleSubmitRating(mentor.id)}>
                        Submit Rating
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No mentors found for this course.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseOfficialPage;
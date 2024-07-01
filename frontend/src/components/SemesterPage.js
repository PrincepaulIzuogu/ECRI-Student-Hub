import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaVideo, FaUserPlus, FaComments } from 'react-icons/fa'; // Importing FontAwesome icons
import Logout from './Logout'; // Assuming you have a Logout component
import '../styles/SemesterPage.css';

const SemesterPage = () => {
  const { course, semester } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [newNotification, setNewNotification] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

 
  console.log('Course:', course);
  console.log('Semester:', semester);

  // Define bachelor and master courses with all lowercase and hyphens
  const bachelorCourses = [
    'building-products-and-processes',
    'energy-systems-engineering',
    'health-informatics',
    'industrial-engineering',
    'international-tourism-management'
  ];
  const masterCourses = [
    'digital-health',
    'global-public-health',
    'healthy-sustainable-buildings',
    'international-tourism-development',
    'medical-informatics'
  ];

  let courses = [];
  let degreeProgram = '';

  // Convert course name to lowercase with hyphens for comparison
  const courseLowerCase = course.toLowerCase().replace(/\s+/g, '-');

  // Determine the degree program based on the course parameter
  if (bachelorCourses.includes(courseLowerCase)) {
    degreeProgram = 'Bachelor';
  } else if (masterCourses.includes(courseLowerCase)) {
    degreeProgram = 'Master';
  }

  console.log('Degree Program:', degreeProgram);

  // Define courses for each semester for bachelor degree programs
  const bachelorCoursesPerSemester = {
    'building-products-and-processes': {
      1: ['Engineering Mathematics', 'Fundamentals of Building Physics 1 (Thermal Protection)', 'Construction Chemistry', 'Structural Engineering', 'Building Informatics', 'Workshop Architecture', 'Technical English'],
      2: ['Electrical and Power Engineering', 'Fundamentals of Building Physics 2 (Fire Protection)', 'Fundamentals of Building Physics 3 (Building and Room Acoustics)', 'Building Material Characteristics', 'CAD 2D / 3D (BIM)', 'Intercultural Competences and Management Skills'],
      3: ['Law I (Construction Law / Construction Contract / VOB)', 'Construction Calculation (Offer and Project Cost Control)', 'Project Management 1 (Planning and Control)', 'Project Management 2 (Organisation, Lean)', 'Digital Building Process (BIM 4D to 6D)', 'Scientific Methods', 'Compulsory Elective (AWP)'],
      4: ['Commercial Management (Method of Measurement, Invoicing)', 'Law II (EU Construction Product Regulations)', 'Product Management 1 (International Product Strategy)', 'Product Development and Tests', 'Construction Material Tests', 'Seminar on Project Management'],
      5: ['Internship - 26 weeks', 'PLV 1', 'PLV 2'],
      6: ['Building Trades I (Shell and Core Construction / Steel Construction / HVAC / Energy)', 'Building Trades 2 (Interior Fit-out)', 'Building Trades 3 (Building Structure / Roof)', 'Building in Existing Structures (Structural Damage, Removal / Demolition, Renovation)', 'Compulsory Elective 1 (FWP-1)*', 'Seminar on Product Development'],
      7: ['Bachelormodul', 'Bachelor Thesis', 'Thesis Defense', 'Product Management 2 (International Product Marketing)', 'Sustainable Construction', 'English II (Negotiations)', 'Architectural History and Theory', 'Energy and Ressource Efficiency', 'Entrepreneurship', 'Finance and Accounting', 'Health Safety Environment', 'Management Systems according to ISO', 'Operational Processes', 'Strategic Planning and Project Management', 'Technology and Intellectual Property Rights Management', 'Workplace Innovation'],
    },
    'energy-systems-engineering': {
      1: ['Analytical Principles of Engineering', 'Informatics 1', 'Fundamentals of Electrical Engineering', 'Physics', 'Chemistry', 'Foreign Language 1 '],
      2: ['Mathematics for Engineering', 'Informatics 2', 'Electrical and Power Engineering', 'Lab Work in Natural Sciences', 'Materials and Design', 'Intercultural Competences', 'Scientific Compulsory Elective Subject (AWP) 1', 'Foreign Language 2  '],
      3: ['Advanced Mathematics', 'Energy Technology', 'Measurement and Control Engineering', 'Fundamentals of Energy Economy', 'Project Work I including Scientific Writing', 'Foreign Language 3 '],
      4: ['Project Work 2 incl. Simulation and Design', 'Renewable Energies', 'Sustainability 4', 'Plant Engineering', 'Compulsory Elective 1*', 'Scientific Compulsory Elective Subject (AWP) 2', 'Foreign Language 4 '],
      5: ['Internship including PLV seminars  '],
      6: ['Power Grid Technologies', 'Energy Storage', 'Smart Systems and Technologies', 'Compolsory Elective 2*', 'Project Work 3 including Lab Work in Energy Systems '],
      7: ['Bachelor Module', 'Bachelor Thesis', 'Thesis Defense', 'Energy Policy and Law', 'Sustainable Energy Systems', 'Compulsory Elective 2 (FWP-2)*', 'Professional English'],
    },
    'health-informatics': {
      1: ['Foundations of Medicine', 'Foundations of Mathematics and Statistics', 'Foundations of Informatics', 'Foundations of Sciences', 'General Business Administration and Accounting', 'AWP (Foreign Language 1) '],
      2: ['Foundations of Law', 'Software Development', 'Databases', 'Foundations of Health Informatics', 'Mathematics and Statistics', 'Compliance and Risk Management', 'AWP (Foreign Language 2) '],
      3: ['Medical Documentation', 'Application Systems of Health Informatics', 'Information Systems in Health Care', 'Media Management', 'Innovation and Complexity Management', 'AWP (Foreign Language 3) '],
      4: ['Medical Technology', 'ERP-Systems', 'Operations Research', 'Practice of Programming', 'Current Aspects of Health Economy', 'AWP (Foreign Language 4)'],
      5: ['Internship - 18 weeks', 'Internship Accompanying Course (PLV 1)', 'Internship Accompanying Course (PLV 2)'],
      6: ['Social Processes and Communication', 'Knowledge-based Systems', 'IT-Project Management', 'Logistics in Healthcare', 'Collaborative Systems', 'FWP-1 - Evidence-based Medicine', 'FWP-2 - Telematics in the Healthcare Industry', 'FWP-3 - Data Analysis and Data Mining '],
      7: ['Managed Care', 'IT-Organisation and Computer Center Management', 'Management and IT-Consulting in health service', 'Business Game: Medical Information Systems', 'Bachelor Thesis'],
    },
    'industrial-engineering': {
      1: ['Analytical Principles of Engineering', 'Informatics for Engineering 1', 'Chemistry', 'Principles in Business & Economics', 'Basics - Scientific Writing', 'Accounting', 'Foreign Language 1 '],
      2: ['Lab Work in Chemistry', 'Scientific Writing, Research Methods and Project Management', 'Mathematics for Engineering', 'Informatics for Engineering 2', 'Technical Mechanics', 'Physics', 'Scientific Compulsory Elective Subject (AWP) I', 'Foreign Language 2 '],
      3: ['Lab Work in Physics', 'Applied Mathematics', 'Fundamentals of Electrical Engineering', 'Intercultural Management', 'Sustainability', 'Business Law', 'Foreign Language 3 '],
      4: ['Financing', 'Logistics and Operations Research', 'Technical Mechanics 2', 'Energy Technology', 'Fundamentals of Measurement and Control Engineering', 'Foreign Language 4', 'Scientific Compulsory Elective Subject (AWP) 2 '],
      5: ['Process Safety', 'Applied Measurement and Control Engineering', 'Plant Engineering', 'Management', 'Renewable Energies', 'Project Work '],
      6: ['Internship', 'PLV 1', 'PLV 2'],
      7: ['Bachelor Thesis incl. Bachelor Seminar ', 'Process Engineering', 'Data Acquisition and Processing', 'Industrial Automation and Information Technology', 'Modelling Theory', 'Energy and Resource Efficiency', 'Process Optimisation', 'Advanced Fluid and Energy Technology', 'Globalisation', 'Energy Markets', 'Business Planning and Start-up Management', 'Operational Processes '],
    },
    'international-tourism-management': {
      1: ['Foreign Language 11', 'Personal & Scientific Development', 'Applied Statistics & Data Analysis', 'Fundamentals of Business Administration', 'Economy & Society', 'Introduction to Tourism Management with Focus on Medical and Health Tourism '],
      2: ['Foreign Language 21', 'Scientific Compulsory Elective Subjects  1 (AWP)', 'Accounting & Controlling', 'Marketing in Health & Medical Tourism 1 - Basic Principles and Markets', 'Quantitative & Qualitative Research', 'Medical Basics for Tourism Professionals', 'Intercultural Management in International Health & Medical Tourism '],
      3: ['Foreign Language 31', 'Compliance, Process & Quality Management in Health & Medical Tourism', 'Marketing in Health & Medical Tourism 2 - Digital Services Marketing', 'Corporate Management & Leadership', 'Hospitality Management', 'Project Management'],
      4: ['Foreign Language 41', 'Scientific Compulsory Elective Subjects 2 (AWP)', 'Legal Aspects in Tourism', 'Innovation, Product Development & Service Design in Health & Medical Tourism', 'ICT Application Systems in Health & Medical Tourism', 'Medical Wellness & Spa Management', 'Health Care Management & Health Provision '],
      5: ['Internship - 18 weeks', 'Block Seminar to accompany the internship (PLV 1)', 'Block Seminar to accompany the internship (PLV 2)'],
      6: ['Bachelor Thesis Tutorial (Scientific Workshop)', 'Natural Ressources in Health Tourism', 'Entrepreneurship', 'Contemporary Issues in International Health & Medical Tourism', 'Data Analysis and Artificial Intelligence in Health & Medical Tourism', 'Management of Tour Operators and Facilitators in Medical Tourism '],
      7: ['Bachelor Thesis', 'Transport & Mobility Management', 'Cooperation and Network Management in Health & Medical Tourism', 'Ethics & Sustainability in International Health & Medical Tourism', 'Health Destination Management'],
    },
  };

  // Define courses for each semester for master degree programs
  const masterCoursesPerSemester = {
    'digital-health': {
      1: ['Fundamentals of Medicine and Computer Science (FMC)', 'International & GlobalHealth (IGH): Major Health Issues; Health Law & Ethics', 'Digital Health Fundamentals (DHF): Digital Health, eHealth & Telemedicine', 'Digital Health Technology (DHT): Data, Information & Communication', 'Digital Health Coding (DHC): Standards, Terminologies & Classifications', 'Contemporary Health Research (CHR): Health Research & Biomedical Statistics '],
      2: ['Digital Health Information Systems (DHS): Medical Documentation Systems and HIS', 'Digital Health Applications (DHA): Application Systems in Digital Health', 'Health Economy & Management (HEM): Management of Health Services & Systems', 'Digital Health Data Protection (DHD): Data Privacy & Security in Digital Health', 'FWP-1* Digital Health Management (DHM): Processes, Projects & Programs', 'FWP-2* Digital Health Data Analytics & Artificial Intelligence (DHI)', 'FWP-3* Digital Health Entrepreneurship (DHE): Business, Markets & Innovation', 'FWP-4* Digital Health Programming (DHP): Advanced Software Engineering '],
      3: ['Final Module: Master Thesis', 'Internship', 'Thesis Defense'],
    },
    'global-public-health': {
      1: ['Essentials of Global Public Health', 'Digital Health', 'Sustainable Health Economy', 'Electives'],
      2: ['Global Puclic Health Law and Ethics', 'Epidemiology and Health Data Analytics', 'Universal Health Coverage', 'Electives'],
      3: ['Intercultural and Scientific Communication & Management (ICM)', 'Master Thesis '],
    },
    'healthy-sustainable-buildings': {
      1: ['Environmental Psychology', 'Sustainable Buildings & Neighbourhoods', 'Smart Buildings', 'Quantitative and Qualitative Research Methods '],
      2: ['Environmental Hygiene and Medicine', 'Evidence Based Design 1', 'Standards & Green Building Certification Systems', 'Building Performance Simulations', 'Sustainable Energy Supply Systems', 'Ambient Assisted Working & Living  '],
      3: ['International Project Management and Implementation', 'Building Safety & Security', 'Evidence Based Design 2', 'Refurbishment and Renovation', 'Evidence Based Design – Consolidation (FWP)', 'Selected chapters Healthy & Sustainable Buildings & Neighbourhoods (FWP)', 'Smart Infrastructure & Artificial Intelligence (FWP)', 'R&D Project  '],
      4: ['Masters Thesis incl. Presentation '],
    },
    'international-tourism-development': {
      1: ['Customer Experience Management', 'Current Issues in Business Administration', 'Managerial Accounting', 'Intercultural and Interdisciplinary Management', 'Global and Regional Sustainable Tourism Development', 'Quantitative and Qualitative Research Methods 1', 'Scientific Compulsory Elective Subjects I (AWP 1) '],
      2: ['Scientific Compulsory Elective Subjects 2 (AWP 2)', 'Applied Customer Experience Management', 'Quantitative and Qualitative Research Methods 2', 'Master Thesis Tutorial (Scientific Workshop)', 'Entrepreneurship and Business Development', 'Digital Marketing and Social Media in Tourism', 'Specialised Mandatory Elective Module'],
      3: ['Destination Development and Marketing', 'Specialised Mandatory Elective Module', 'Master Thesis '],
    },
    'medical-informatics': {
      1: ['FWP-1: Medicine for non Physicians', 'FWP-2: Computer Science for Medics', 'International Health Care Management ', 'Medical Informatics', 'Case Study Medical Informatics ', 'Standards, Terminology and Classification ', 'Case Study Standards, Terminology and Classification', 'Evidence-based Medicine', 'Case Study Evidence-based Medicine ', 'eHealth and Telemedicine ', 'Case Study Telemedicine'],
      2: ['Medical Documentation Systems', 'Case Study Hospital Information System ', 'eHealth Application Systems', 'Case Study eHealth Application', 'Health Economy', 'Medical Statistics and Data Analysis', 'Collaborative Systems Case Study', 'International Project Management', 'Data Security and Data Protection', 'Case Study Data Security'],
      3: ['Intercultural and Interdisciplinary Communication Seminar', 'Master Thesis', 'FWP-1: Medicine for non Physicians – for students with IT/Computer Science background', 'FWP-2: Computer Science for Medics – for students with Medical/Health Sciences background'],
    },
  };

 // Select the appropriate courses based on the degree program
 if (degreeProgram === 'Bachelor') {
  courses = bachelorCoursesPerSemester[courseLowerCase][parseInt(semester.slice(-1))];
} else if (degreeProgram === 'Master') {
  courses = masterCoursesPerSemester[courseLowerCase][parseInt(semester.slice(-1))];
}


useEffect(() => {
  // Retrieve user data from local storage when the component mounts
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    setUserData(JSON.parse(storedUserData));

    // Check if there is no profile picture for the user, set new notification state accordingly
    if (!JSON.parse(storedUserData).profile_picture) {
      setNewNotification(true);
    } else {
      setNewNotification(false); // If profile picture exists, no need for notification
    }
  }
}, []);

// Determine the home link based on the user's degree program
const getHomeLink = () => {
  if (!userData) return "/";
  const { degreeProgram } = userData;
  if (degreeProgram.toLowerCase().includes('bachelor')) {
    return `/bachelor/${course}`;
  } else if (degreeProgram.toLowerCase().includes('master')) {
    return `/master/${course}`;
  }
  return "/";
};

const getDashboardLink = () => {
  if (!userData) return "/dashboard";
  const { degreeProgram, courseOfStudy } = userData;
  const courseSlug = courseOfStudy.toLowerCase().replace(/\s+/g, '-');
  if (degreeProgram.toLowerCase().includes('bachelor')) {
    return `/bachelor/${courseSlug}/dashboard`;
  } else if (degreeProgram.toLowerCase().includes('master')) {
    return `/master/${courseSlug}/dashboard`;
  }
  return "/dashboard";
};

const getContactsLink = () => {
  if (!userData) return "/contacts";
  const { degreeProgram, courseOfStudy } = userData;
  const courseSlug = courseOfStudy.toLowerCase().replace(/\s+/g, '-');
  if (degreeProgram.toLowerCase().includes('bachelor')) {
    return `/bachelor/${courseSlug}/contacts`;
  } else if (degreeProgram.toLowerCase().includes('master')) {
    return `/master/${courseSlug}/contacts`;
  }
  return "/contacts";
};



return (

  <div className="bachelor-course-page">
      <div className="top-nav">
        <div className="welcome-message">
          {/* Displaying welcome message with user data */}
          <h2>{semester} Courses for {degreeProgram} {course}</h2>
        </div>
        <div className="nav-icons">
          <Link to={getHomeLink()} className="nav-icon"><FaHome /></Link>
          <Link to="/my-profile" className="nav-icon">
  {/* Display notification icon with badge if there are new notifications and no profile picture */}
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
          <li><Link to={getContactsLink()}><FaAddressBook className="nav-icon" /> Contacts</Link></li>
          <li><Link to={getDashboardLink()}><FaAddressBook className="nav-icon" /> Dashboard</Link></li>
          <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
    <div className="courses-buttons">
    {courses.map((courseName, index) => (
          <Link
            key={index}
            to={`/${degreeProgram.toLowerCase()}/${course}/${semester}/${courseName.toLowerCase().replace(/\s+/g, '-')}`}
            className="button-link"
          >
            {courseName}
          </Link>
        ))}
      </div>
    </div>
);
};

export default SemesterPage;

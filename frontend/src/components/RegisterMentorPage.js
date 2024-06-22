import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaEnvelope, FaCog, FaCalendarAlt, FaAddressBook, FaUserPlus, FaBook, FaGraduationCap, FaIdCard } from 'react-icons/fa';
import DegreeWelcomeMessage from './DegreeWelcomeMessage';
import Logout from './Logout';
import '../styles/RegisterMentorPage.css';

const RegisterMentorPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [formData, setFormData] = useState({
    courseOfStudy: '',
    degreeProgram: '',
    email: '',
    firstName: '',
    lastName: '',
    matriculationNumber: '',
    profile_picture: '',
    semester: '',
    courseToMentor: '',
    grade: '',
    tutorDays: '',
    courseToMentorSemester: '', // Added this field
  });
  const [selectedSemester, setSelectedSemester] = useState('');

  // Define semester labels for bachelor and master degrees
  const bachelorSemesterLabels = ['semester-1', 'semester-2', 'semester-3', 'semester-4', 'semester-5', 'semester-6', 'semester-7'];
  const masterSemesterLabels = ['semester-1', 'semester-2', 'semester-3'];

  // Define courses for each semester for bachelor degree programs
  const bachelorCoursesPerSemester = {
    'building-products-and-processes': {
    'semester-1': ['engineering-mathematics', 'fundamentals-of-building-physics-1-(thermal-protection)', 'construction-chemistry', 'structural-engineering', 'building-informatics', 'workshop-architecture', 'technical-english'],
    'semester-2': ['electrical-and-power-engineering', 'fundamentals-of-building-physics-2-(fire-protection)', 'fundamentals-of-building-physics-3-(building-and-room-acoustics)', 'building-material-characteristics', 'cad-2d/3d-(bim)', 'intercultural-competences-and-management-skills'],
    'semester-3': ['law-i-(construction-law-/construction-contract-/vob)', 'construction-calculation-(offer-and-project-cost-control)', 'project-management-1-(planning-and-control)', 'project-management-2-(organisation,-lean)', 'digital-building-process-(bim-4d-to-6d)', 'scientific-methods', 'compulsory-elective-(awp)'],
    'semester-4': ['commercial-management-(method-of-measurement,-invoicing)', 'law-ii-(eu-construction-product-regulations)', 'product-management-1-(international-product-strategy)', 'product-development-and-tests', 'construction-material-tests', 'seminar-on-project-management'],
    'semester-5': ['internship---26-weeks', 'plv-1', 'plv-2'],
    'semester-6': ['building-trades-i-(shell-and-core-construction-/steel-construction-/hvac-/energy)', 'building-trades-2-(interior-fit-out)', 'building-trades-3-(building-structure-/roof)', 'building-in-existing-structures-(structural-damage,-removal-/demolition,-renovation)', 'compulsory-elective-1-(fwp-1)', 'seminar-on-product-development'],
    'semester-7': ['bachelormodul', 'bachelor-thesis', 'thesis-defense', 'product-management-2-(international-product-marketing)', 'sustainable-construction', 'english-ii-(negotiations)', 'architectural-history-and-theory', 'energy-and-ressource-efficiency', 'entrepreneurship', 'finance-and-accounting', 'health-safety-environment', 'management-systems-according-to-iso', 'operational-processes', 'strategic-planning-and-project-management', 'technology-and-intellectual-property-rights-management', 'workplace-innovation'],
    },
    'energy-systems-engineering': {
    'semester-1': ['analytical-principles-of-engineering', 'informatics-1', 'fundamentals-of-electrical-engineering', 'physics', 'chemistry', 'foreign-language-1'],
    'semester-2': ['mathematics-for-engineering', 'informatics-2', 'electrical-and-power-engineering', 'lab-work-in-natural-sciences', 'materials-and-design', 'intercultural-competences', 'scientific-compulsory-elective-subject-(awp)-1', 'foreign-language-2'],
    'semester-3': ['advanced-mathematics', 'energy-technology', 'measurement-and-control-engineering', 'fundamentals-of-energy-economy', 'project-work-i-including-scientific-writing', 'foreign-language-3'],
    'semester-4': ['project-work-2-incl.-simulation-and-design', 'renewable-energies', 'sustainability-4', 'plant-engineering', 'compulsory-elective-1', 'scientific-compulsory-elective-subject-(awp)-2', 'foreign-language-4'],
    'semester-5': ['internship-including-plv-seminars'],
    'semester-6': ['power-grid-technologies', 'energy-storage', 'smart-systems-and-technologies', 'compolsory-elective-2*', 'project-work-3-including-lab-work-in-energy-systems'],
    'semester-7': ['bachelor-module', 'bachelor-thesis', 'thesis-defense', 'energy-policy-and-law', 'sustainable-energy-systems', 'compulsory-elective-2-(fwp-2)*', 'professional-english'],
    },
    'health-informatics': {
    'semester-1': ['foundations-of-medicine', 'foundations-of-mathematics-and-statistics', 'foundations-of-informatics', 'foundations-of-sciences', 'general-business-administration-and-accounting', 'awp-(foreign-language-1)'],
    'semester-2': ['foundations-of-law', 'software-development', 'databases', 'foundations-of-health-informatics', 'mathematics-and-statistics', 'compliance-and-risk-management', 'awp-(foreign-language-2)'],
    'semester-3': ['medical-documentation', 'application-systems-of-health-informatics', 'information-systems-in-health-care', 'media-management', 'innovation-and-complexity-management', 'awp-(foreign-language-3)'],
    'semester-4': ['medical-technology', 'erp-systems', 'operations-research', 'practice-of-programming', 'current-aspects-of-health-economy', 'awp-(foreign-language-4)'],
    'semester-5': ['internship---18-weeks', 'internship-accompanying-course-(plv-1)', 'internship-accompanying-course-(plv-2)'],
    'semester-6': ['social-processes-and-communication', 'knowledge-based-systems', 'it-project-management', 'logistics-in-healthcare', 'collaborative-systems', 'fwp-1---evidence-based-medicine', 'fwp-2---telematics-in-the-healthcare-industry', 'fwp-3---data-analysis-and-data-mining'],
    'semester-7': ['managed-care', 'it-organisation-and-computer-center-management', 'management-and-it-consulting-in-health-service', 'business-game:-medical-information-systems', 'bachelor-thesis'],
    },
    'industrial-engineering': {
    'semester-1': ['analytical-principles-of-engineering', 'informatics-for-engineering-1', 'chemistry', 'principles-in-business-&-economics', 'basics---scientific-writing', 'accounting', 'foreign-language-1'],
    'semester-2': ['lab-work-in-chemistry', 'scientific-writing,-research-methods-and-project-management', 'mathematics-for-engineering', 'informatics-for-engineering-2', 'technical-mechanics', 'physics', 'scientific-compulsory-elective-subject-(awp)-i', 'foreign-language-2'],
    'semester-3': ['lab-work-in-physics', 'applied-mathematics', 'fundamentals-of-electrical-engineering', 'intercultural-management', 'sustainability', 'business-law', 'foreign-language-3'],
    'semester-4': ['financing', 'logistics-and-operations-research', 'technical-mechanics-2', 'energy-technology', 'fundamentals-of-measurement-and-control-engineering', 'foreign-language-4', 'scientific-compulsory-elective-subject-(awp)-2'],
    'semester-5': ['process-safety', 'applied-measurement-and-control-engineering', 'plant-engineering', 'management', 'renewable-energies', 'project-work'],
    'semester-6': ['internship', 'plv-1', 'plv-2'],
    'semester-7': ['bachelor-thesis-incl.-bachelor-seminar', 'process-engineering', 'data-acquisition-and-processing', 'industrial-automation-and-information-technology', 'modelling-theory', 'energy-and-resource-efficiency', 'process-optimisation', 'advanced-fluid-and-energy-technology', 'globalisation', 'energy-markets', 'business-planning-and-start-up-management', 'operational-processes'],
    },
    'international-tourism-management': {
    'semester-1': ['foreign-language-11', 'personal-&-scientific-development', 'applied-statistics-&-data-analysis', 'fundamentals-of-business-administration', 'economy-&-society', 'introduction-to-tourism-management-with-focus-on-medical-and-health-tourism'],
    'semester-2': ['foreign-language-21', 'scientific-compulsory-elective-subjects-1-(awp)', 'accounting-&-controlling', 'marketing-in-health-&-medical-tourism-1---basic-principles-and-markets', 'quantitative-&-qualitative-research', 'medical-basics-for-tourism-professionals', 'intercultural-management-in-international-health-&-medical-tourism'],
    'semester-3': ['foreign-language-31', 'compliance,-process-&-quality-management-in-health-&-medical-tourism', 'marketing-in-health-&-medical-tourism-2---digital-services-marketing', 'corporate-management-&-leadership', 'hospitality-management', 'project-management'],
    'semester-4': ['foreign-language-41', 'scientific-compulsory-elective-subjects-2-(awp-2)', 'legal-aspects-in-tourism', 'innovation,-product-development-&-service-design-in-health-&-medical-tourism', 'ict-application-systems-in-health-&-medical-tourism', 'medical-wellness-&-spa-management', 'health-care-management-&-health-provision'],
    'semester-5': ['internship---18-weeks', 'block-seminar-to-accompany-the-internship-(plv-1)', 'block-seminar-to-accompany-the-internship-(plv-2)'],
'semester-6': ['bachelor-thesis-tutorial-(scientific-workshop)', 'natural-ressources-in-health-tourism', 'entrepreneurship', 'contemporary-issues-in-international-health-&-medical-tourism', 'data-analysis-and-artificial-intelligence-in-health-&-medical-tourism', 'management-of-tour-operators-and-facilitators-in-medical-tourism'],
'semester-7': ['bachelor-thesis', 'transport-&-mobility-management', 'cooperation-and-network-management-in-health-&-medical-tourism', 'ethics-&-sustainability-in-international-health-&-medical-tourism', 'health-destination-management'],
},
};

const masterCoursesPerSemester = {
'digital-health': {
'semester-1': ['fundamentals-of-medicine-and-computer-science-(fmc)', 'international-&-globalhealth-(igh):-major-health-issues;-health-law-&-ethics', 'digital-health-fundamentals-(dhf):-digital-health,-ehealth-&-telemedicine', 'digital-health-technology-(dht):-data,-information-&-communication', 'digital-health-coding-(dhc):-standards,-terminologies-&-classifications', 'contemporary-health-research-(chr):-health-research-&-biomedical-statistics'],
'semester-2': ['digital-health-information-systems-(dhs):-medical-documentation-systems-and-his', 'digital-health-applications-(dha):-application-systems-in-digital-health', 'health-economy-&-management-(hem):-management-of-health-services-&-systems', 'digital-health-data-protection-(dhd):-data-privacy-&-security-in-digital-health', 'fwp-1*-digital-health-management-(dhm):-processes,-projects-&-programs', 'fwp-2*-digital-health-data-analytics-&-artificial-intelligence-(dhi)', 'fwp-3*-digital-health-entrepreneurship-(dhe):-business,-markets-&-innovation', 'fwp-4*-digital-health-programming-(dhp):-advanced-software-engineering'],
'semester-3': ['final-module:-master-thesis', 'internship', 'thesis-defense'],
},
'global-public-health': {
'semester-1': ['essentials-of-global-public-health', 'digital-health', 'sustainable-health-economy', 'electives'],
'semester-2': ['global-puclic-health-law-and-ethics', 'epidemiology-and-health-data-analytics', 'universal-health-coverage', 'electives'],
'semester-3': ['intercultural-and-scientific-communication-&-management-(icm)', 'master-thesis'],
},
'healthy-sustainable-buildings': {
'semester-1': ['environmental-psychology', 'sustainable-buildings-&-neighbourhoods', 'smart-buildings', 'quantitative-and-qualitative-research-methods'],
'semester-2': ['environmental-hygiene-and-medicine', 'evidence-based-design-1', 'standards-&-green-building-certification-systems', 'building-performance-simulations', 'sustainable-energy-supply-systems', 'ambient-assisted-working-&-living'],
'semester-3': ['international-project-management-and-implementation', 'building-safety-&-security', 'evidence-based-design-2', 'refurbishment-and-renovation', 'evidence-based-design-–-consolidation-(fwp)', 'selected-chapters-healthy-&-sustainable-buildings-&-neighbourhoods-(fwp)', 'smart-infrastructure-&-artificial-intelligence-(fwp)', 'r&d-project'],
'semester-4': ['masters-thesis-incl.-presentation'],
},
'international-tourism-development': {
'semester-1': ['customer-experience-management', 'current-issues-in-business-administration', 'managerial-accounting', 'intercultural-and-interdisciplinary-management', 'global-and-regional-sustainable-tourism-development', 'quantitative-and-qualitative-research-methods-1', 'scientific-compulsory-elective-subjects-i-(awp-1)'],
'semester-2': ['scientific-compulsory-elective-subjects-2-(awp-2)', 'applied-customer-experience-management', 'quantitative-and-qualitative-research-methods-2', 'master-thesis-tutorial-(scientific-workshop)', 'entrepreneurship-and-business-development', 'digital-marketing-and-social-media-in-tourism', 'specialised-mandatory-elective-module'],
'semester-3': ['destination-development-and-marketing', 'specialised-mandatory-elective-module', 'master-thesis'],
},
'medical-informatics': {
'semester-1': ['fwp-1:-medicine-for-non-physicians', 'fwp-2:-computer-science-for-medics', 'international-health-care-management', 'medical-informatics', 'case-study-medical-informatics', 'standards,-terminology-and-classification', 'case-study-standards,-terminology-and-classification', 'evidence-based-medicine', 'case-study-evidence-based-medicine', 'ehealth-and-telemedicine', 'case-study-telemedicine'],
'semester-2': ['medical-documentation-systems', 'case-study-hospital-information-system', 'ehealth-application-systems', 'case-study-ehealth-application', 'health-economy', 'medical-statistics-and-data-analysis', 'collaborative-systems-case-study', 'international-project-management', 'data-security-and-data-protection', 'case-study-data-security'],
'semester-3': ['intercultural-and-interdisciplinary-communication-seminar', 'master-thesis', 'fwp-1:-medicine-for-non-physicians-–-for-students-with-it/computer-science-background', 'fwp-2:-computer-science-for-medics-–-for-students-with-medical/health-sciences-background'],
},
};

useEffect(() => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    const user = JSON.parse(storedUserData);
    setUserData(user);
    setFormData({
      courseOfStudy: user.courseOfStudy || '',
      degreeProgram: user.degreeProgram || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      matriculationNumber: user.matriculationNumber || '',
      profile_picture: user.profile_picture || '',
      semester: user.semester || '',
      courseToMentor: '',
      grade: '',
      tutorDays: '',
      courseToMentorSemester: selectedSemester // Initialize with selectedSemester
    });

    if (!user.profile_picture) {
      setNewNotification(true);
    } else {
      setNewNotification(false);
    }
  }
}, [selectedSemester]); // Update whenever selectedSemester changes

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://127.0.0.1:8000/mentors/', formData);
    navigate('/dashboard');
  } catch (error) {
    console.error('Error registering mentor:', error);
  }
};

const getHomeLink = () => {
  if (!userData) return "/";
  const { degreeProgram, courseOfStudy } = userData;
  const userCourse = courseOfStudy || 'default-course';
  if (degreeProgram.toLowerCase().includes('bachelor')) {
    return `/bachelor/${userCourse}`;
  } else if (degreeProgram.toLowerCase().includes('master')) {
    return `/master/${userCourse}`;
  }
  return "/";
};

const getAvailableCourses = () => {
  if (!userData || !selectedSemester) return [];
  const degreeType = userData.degreeProgram.toLowerCase().includes('bachelor') ? 'bachelor' : 'master';
  const courseKey = userData.courseOfStudy.toLowerCase().replace(/\s+/g, '-');

  if (degreeType === 'bachelor' && bachelorCoursesPerSemester[courseKey]) {
    return bachelorCoursesPerSemester[courseKey][selectedSemester] || [];
  } else if (degreeType === 'master' && masterCoursesPerSemester[courseKey]) {
    return masterCoursesPerSemester[courseKey][selectedSemester] || [];
  }

  return [];
};

return (
  <div className="register-mentor-page">
    <div className="top-nav">
      <div className="welcome-message">
        {userData && <DegreeWelcomeMessage degreeProgram={userData.degreeProgram} courseOfStudy={userData.courseOfStudy} />}
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
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars className="bars-icon" />
      </div>
    </div>
    <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
      <ul>
        <li><Link to="/settings"><FaCog className="nav-icon" /> Settings</Link></li>
        <li><Link to="/contacts"><FaAddressBook className="nav-icon" /> Contacts</Link></li>
        <li><Link to="/add-mentor"><FaUserPlus className="nav-icon" /> Add Mentor</Link></li>
        <li><Link to="/add-course"><FaBook className="nav-icon" /> Add Course</Link></li>
        <li><Link to="/calendar"><FaCalendarAlt className="nav-icon" /> Calendar</Link></li>
        <li><Link to="/courses"><FaGraduationCap className="nav-icon" /> Courses</Link></li>
        <li><Link to="/profile"><FaIdCard className="nav-icon" /> Profile</Link></li>
        <li><Link to="/" onClick={Logout}><FaBars className="nav-icon" /> Logout</Link></li>
      </ul>
    </nav>
    <div className="register-mentor-form">
      <h2>Register as a Mentor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FaBook /> Course of Study</label>
          <input type="text" name="courseOfStudy" value={formData.courseOfStudy} readOnly />
        </div>
        <div className="form-group">
          <label><FaGraduationCap /> Degree Program</label>
          <input type="text" name="degreeProgram" value={formData.degreeProgram} readOnly />
        </div>
        <div className="form-group">
          <label><FaEnvelope /> Email</label>
          <input type="email" name="email" value={formData.email} readOnly />
        </div>
        <div className="form-group">
          <label><FaUser /> First Name</label>
          <input type="text" name="firstName" value={formData.firstName} readOnly />
        </div>
        <div className="form-group">
          <label><FaUser /> Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} readOnly />
        </div>
        <div className="form-group">
          <label><FaIdCard /> Matriculation Number</label>
          <input type="text" name="matriculationNumber" value={formData.matriculationNumber} readOnly />
        </div>
        <div className="form-group">
          <label><FaUser /> Profile Picture</label>
          <input type="text" name="profile_picture" value={formData.profile_picture} readOnly />
        </div>
        <div className="form-group">
          <label><FaCalendarAlt /> Semester</label>
          <input type="text" name="semester" value={formData.semester} readOnly />
        </div>
        <div className="form-group">
          <label><FaCalendarAlt /> Select Course to Mentor Semester</label>
          <div>
            {userData && userData.degreeProgram.toLowerCase().includes('bachelor') ? (
              bachelorSemesterLabels.map((label, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="courseToMentorSemester" // Updated name attribute
                    value={label}
                    onChange={(e) => {
                      setSelectedSemester(label);
                      setFormData({ ...formData, courseToMentorSemester: label }); // Set in formData
                    }}
                    checked={selectedSemester === label}
                  />{' '}
                  {label}
                </label>
              ))
            ) : (
              masterSemesterLabels.map((label, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="courseToMentorSemester" // Updated name attribute
                    value={label}
                    onChange={(e) => {
                      setSelectedSemester(label);
                      setFormData({ ...formData, courseToMentorSemester: label }); // Set in formData
                    }}
                    checked={selectedSemester === label}
                  />{' '}
                  {label}
                </label>
              ))
            )}
          </div>
        </div>
        <div className="form-group">
          <label><FaBook /> Course to Mentor</label>
          <select
            name="courseToMentor"
            value={formData.courseToMentor}
            onChange={handleChange}
          >
            <option value="">Select course to mentor</option>
            {getAvailableCourses().map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label><FaGraduationCap /> Your Grade in the Course</label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label><FaCalendarAlt /> Tutor Days</label>
          <input
            type="text"
            name="tutorDays"
            value={formData.tutorDays}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
);
};

export default RegisterMentorPage;
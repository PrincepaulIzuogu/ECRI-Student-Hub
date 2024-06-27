from fastapi import FastAPI, HTTPException, Depends, Query, Request, Response, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, desc, DateTime, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import bcrypt
import smtplib
import jwt
import random
import string
import shutil
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import requests
import stripe

# Create a FastAPI instance
app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (you may want to restrict this in production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Mount the directory containing static files
app.mount("/profile_pics", StaticFiles(directory="profile_pics"), name="profile_pics")

# Set up the PostgreSQL database engine
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define database models
Base = declarative_base()

# Define database models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    firstName = Column(String)
    lastName = Column(String)
    courseOfStudy = Column(String)
    semester = Column(String)
    matriculationNumber = Column(String)
    email = Column(String, unique=True, index=True)
    degreeProgram = Column(String)
    hashed_password = Column(String)
    email_confirmed = Column(Boolean, default=False)
    profile_picture = Column(String, nullable=True)
    tokens = relationship("Token", back_populates="user")
    mentor = relationship("Mentor", uselist=False, back_populates="user")
    meetings = relationship("Meeting", back_populates="user")
    mentees = relationship("Mentee", back_populates="user")
    

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="tokens")

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    courseOfStudy = Column(String)
    degreeProgram = Column(String)
    email = Column(String)
    firstName = Column(String)
    lastName = Column(String)
    matriculationNumber = Column(String)
    profile_picture = Column(String)
    semester = Column(String)
    courseToMentor = Column(String)
    grade = Column(String)
    tutorDays = Column(String)
    courseToMentorSemester = Column(String)  # New column added
    user = relationship("User", back_populates="mentor")
    mentees = relationship("Mentee", back_populates="mentor")
    ratings = relationship("Rating", back_populates="mentor")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    privacy = Column(String)
    room_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id", name="fk_meeting_user_id"))  # Explicitly name the foreign key

    email = Column(String)

    user = relationship("User", back_populates="meetings")

class Mentee(Base):
    __tablename__ = "mentees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mentor_id = Column(Integer, ForeignKey("mentors.id"))
    course_name = Column(String)

    user = relationship("User", back_populates="mentees")
    mentor = relationship("Mentor", back_populates="mentees")
    ratings = relationship("Rating", back_populates="mentee")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("mentors.id"))
    mentee_id = Column(Integer, ForeignKey("mentees.id"))
    rating = Column(Float)
    review = Column(Text)

    mentor = relationship("Mentor", back_populates="ratings")
    mentee = relationship("Mentee", back_populates="ratings")

# Database models
class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_username = Column(String)
    sender_email = Column(String)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)


# Create tables in the database
Base.metadata.create_all(bind=engine)

# Pydantic models for request and response payloads
class UserCreate(BaseModel):
    username: str
    firstName: str
    lastName: str
    courseOfStudy: str
    semester: str
    matriculationNumber: str
    email: EmailStr
    password: str
    verifyPassword: str
    degreeProgram: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    degreeProgram: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class EmailData(BaseModel):
    email: EmailStr

class TokenData(BaseModel):
    token: str

class PasswordReset(BaseModel):
    email: EmailStr
    password: str

class MentorCreate(BaseModel):
    courseOfStudy: str
    degreeProgram: str
    email: EmailStr
    firstName: str
    lastName: str
    matriculationNumber: str
    profile_picture: Optional[str] = None
    semester: str
    courseToMentor: str
    grade: str
    tutorDays: str
    courseToMentorSemester: str  # New field added

class CreateMeetingRequest(BaseModel):
    name: str
    privacy: str
    email: str

class MeetingResponse(BaseModel):
    name: str
    privacy: str
    room_url: Optional[str]

class MeetingNameRequest(BaseModel):
    name: str

class MenteeCreate(BaseModel):
    mentor_email: str
    course_name: str
    student_email: str

class RatingCreate(BaseModel):
    mentor_id: int
    mentee_id: int
    rating: float
    review: Optional[str] = None

class RatingResponse(BaseModel):
    mentor_id: int
    mentee_id: int
    rating: float
    review: Optional[str] = None

class MentorRatingResponse(BaseModel):
    mentor_id: int
    mentor_name: str
    average_rating: float
    total_ratings: int
    reviews: List[RatingResponse]

class UserUpdate(BaseModel):
    email: str
    username: str
    firstName: str
    lastName: str
    courseOfStudy: str
    semester: str
    matriculationNumber: str
    degreeProgram: str


class RateMentor(BaseModel):
    rating: int
    review: str
    user_id: int
    mentor_id: int


# Pydantic models
class MessageCreate(BaseModel):
    sender_username: str
    sender_email: EmailStr
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_username: str
    sender_email: EmailStr
    content: str
    timestamp: datetime


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()





# Hash the password using bcrypt
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

# Daily.co API base URL and API key
DAILY_API_BASE_URL = "https://api.daily.co/v1"
DAILY_API_KEY = "b03a1fc342431cc070b95b2ed95413878a42aaa30f221249876f809431ef94c6"
# Set your Stripe API secret key
stripe.api_key = "sk_test_51PTo6n2MU8gPiBkp1zInYRfltX26e6CQ6JQZo0H2tJ47LWh2R7Dmw0phfFX9fBWU9VC3TBhgQbTZcezZVL2tcNYj001sdf3uar"

# Set up a secret key for JWT token generation
SECRET_KEY = "your_secret_key"

# Token expiration time (in minutes)
TOKEN_EXPIRATION_MINUTES = 30

# Generate random token number
def generate_random_token(length: int = 24) -> str:
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for _ in range(length))

# Send confirmation email with token
def send_confirmation_email_with_token(email: str, token: str):
    from_name = "ECRI Student Hub"
    from_email = "baelee570@gmail.com"  # Replace with your email
    to_email = email
    msg = MIMEMultipart()
    msg['From'] = f"{from_name} <{from_email}>"
    msg['To'] = to_email
    msg['Subject'] = "Confirm Your Token"
    body = f"Your confirmation token is: {token}"
    msg.attach(MIMEText(body, 'plain'))
    server = smtplib.SMTP('smtp.gmail.com', 587)  # Replace with your SMTP server details
    server.starttls()
    server.login(from_email, "bdta hlgx qfka njcv")  # Replace with your password
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

# API endpoint for user registration
@app.post("/register/", response_model=UserResponse)
def register_user(request: Request, response: Response, user: UserCreate, db: Session = Depends(get_db)):
    # Check if the username is unique
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists.")

    # Check if the email is a THD email ending with "@stud.th-deg.de"
    if not user.email.endswith("@stud.th-deg.de"):
        raise HTTPException(status_code=400, detail="THD email only")

    # Check if the email is unique
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    # Check if the passwords match
    if user.password != user.verifyPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    # Hash the password before storing it in the database
    hashed_password = hash_password(user.password)

    # Generate random token
    token = generate_random_token()

    # Create a new user in the database
    db_user = User(
        username=user.username,
        firstName=user.firstName,
        lastName=user.lastName,
        courseOfStudy=user.courseOfStudy,
        semester=user.semester,
        matriculationNumber=user.matriculationNumber,
        email=user.email,
        degreeProgram=user.degreeProgram,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create a token record and associate it with the user
    db_token = Token(token=token, user_id=db_user.id)
    db.add(db_token)
    db.commit()

    # Send token via email
    send_confirmation_email_with_token(user.email, token)
    
    # Return the user information
    return {"username": db_user.username, "email": db_user.email}


# API endpoint to confirm token
@app.post("/confirm-token")
def confirm_token(token_data: TokenData, db: Session = Depends(get_db)):
    token = token_data.token
    # Check if the token exists in the database
    db_token = db.query(Token).filter(Token.token == token).first()
    if db_token:
        # Mark email as confirmed for the user associated with the token
        user = db_token.user
        if user:
            user.email_confirmed = True
            db.delete(db_token)  # Remove token after confirmation
            db.commit()
            return {"message": "Token confirmed successfully"}
    # Invalid token or token not found
    raise HTTPException(status_code=400, detail="Invalid token")

# API endpoint to fetch user details
@app.get("/user-details")
def get_user_details():
    db = SessionLocal()
    user = db.query(User).order_by(desc(User.id)).first()  # Get the user with the highest (most recent) ID
    if user:
        user_details = {"username": user.username, "email": user.email}
        db.close()
        return user_details
    else:
        db.close()
        raise HTTPException(status_code=404, detail="User details not found")

# API endpoint for user login
@app.post("/login/")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # Retrieve the user from the database
    db_user = db.query(User).filter(User.email == user.email).first()

    # Check if the user exists and the password matches
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    # Check if the degree program matches
    if db_user.degreeProgram != user.degreeProgram:
        raise HTTPException(status_code=401, detail="Invalid degree program.")

    # Return user data including courseOfStudy and degreeProgram
    return {
        "username": db_user.username,
        "email": db_user.email,
        "courseOfStudy": db_user.courseOfStudy,
        "degreeProgram": db_user.degreeProgram,
        "firstName": db_user.firstName,
        "lastName": db_user.lastName,
        "matriculationNumber": db_user.matriculationNumber,
        "semester": db_user.semester,
        "profile_picture": db_user.profile_picture
    }

# API endpoint for uploading profile pictures without authentication
@app.post("/upload-profile-picture/")
async def upload_profile_picture(
    request: Request,
    file: UploadFile = File(...),
    email: Optional[EmailStr] = Form(None),  # Provide email in the request
    db: Session = Depends(get_db)
):
    try:
        # Save the file to the profile_pics directory
        file_path = os.path.join("profile_pics", file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # If email is provided, find the corresponding user
        if email:
            user = db.query(User).filter(User.email == email).first()
            if user:
                # Update the user's profile_picture column with the file path
                user.profile_picture = file_path
                db.commit()
                return {"file_path": file_path}
            else:
                raise HTTPException(status_code=404, detail="User not found")
        else:
            raise HTTPException(status_code=400, detail="Email not provided")
    except Exception as e:
        print("Error:", e)  # Print the error message
        raise HTTPException(status_code=500, detail="Internal Server Error")

# API endpoint to send token for password reset
@app.post("/send-token/")
def send_token(email_data: EmailData, db: Session = Depends(get_db)):
    email = email_data.email
    # Check if the email exists in the database
    user = db.query(User).filter(User.email == email).first()
    if user:
        # Generate random token
        token = generate_random_token()
        # Create a token record and associate it with the user
        db_token = Token(token=token, user_id=user.id)
        db.add(db_token)
        db.commit()
        # Send token via email
        send_confirmation_email_with_token(email, token)
        return {"message": "Token sent successfully"}
    # Email not found
    raise HTTPException(status_code=404, detail="Email not found")

# API endpoint to check token validity
@app.post("/check-token/")
def check_token(token_data: TokenData, db: Session = Depends(get_db)):
    token = token_data.token
    # Check if the token exists in the database
    db_token = db.query(Token).filter(Token.token == token).first()
    if db_token:
        # Token found, return success message
        return {"message": "Token valid"}
    # Token not found
    raise HTTPException(status_code=404, detail="Token not found")

# API endpoint for resetting password
@app.post("/reset-password/")
def reset_password(password_reset: PasswordReset, db: Session = Depends(get_db)):
    email = password_reset.email
    # Check if the email exists in the database
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    hashed_password = hash_password(password_reset.password)

    # Update the user's password
    db_user.hashed_password = hashed_password
    db.commit()

    # Return a response with the email and a success message
    return {"email": email, "message": "Password reset successfully"}

# API endpoint to register mentor
@app.post("/mentors/")
def register_mentor(mentor: MentorCreate, db: Session = Depends(get_db)):
    # Check if the email is a THD email ending with "@stud.th-deg.de"
    if not mentor.email.endswith("@stud.th-deg.de"):
        raise HTTPException(status_code=400, detail="THD email only")

    # Check if the email exists in the user table
    db_user = db.query(User).filter(User.email == mentor.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user is already a mentor
    if db.query(Mentor).filter(Mentor.user_id == db_user.id).first():
        raise HTTPException(status_code=400, detail="User already registered as a mentor")

    # Create a new mentor in the database
    db_mentor = Mentor(
        user_id=db_user.id,
        courseOfStudy=mentor.courseOfStudy,
        degreeProgram=mentor.degreeProgram,
        email=mentor.email,
        firstName=mentor.firstName,
        lastName=mentor.lastName,
        matriculationNumber=mentor.matriculationNumber,
        profile_picture=mentor.profile_picture,
        semester=mentor.semester,
        courseToMentor=mentor.courseToMentor,
        grade=mentor.grade,
        tutorDays=mentor.tutorDays,
        courseToMentorSemester=mentor.courseToMentorSemester  # New field handled
    )
    db.add(db_mentor)
    db.commit()
    db.refresh(db_mentor)

    # Return the mentor information
    return {
        "courseOfStudy": db_mentor.courseOfStudy,
        "degreeProgram": db_mentor.degreeProgram,
        "email": db_mentor.email,
        "firstName": db_mentor.firstName,
        "lastName": db_mentor.lastName,
        "matriculationNumber": db_mentor.matriculationNumber,
        "profile_picture": db_mentor.profile_picture,
        "semester": db_mentor.semester,
        "courseToMentor": db_mentor.courseToMentor,
        "grade": db_mentor.grade,
        "tutorDays": db_mentor.tutorDays,
        "courseToMentorSemester": db_mentor.courseToMentorSemester  # New field in response
    }



@app.get("/bachelor-find-mentor/")
def find_mentors(degreeProgram: str, courseOfStudy: str, currentCourse: str, courseToMentorSemester: str, db: Session = Depends(get_db)):
    # Normalize input if needed
    degreeProgram = degreeProgram.lower()
    courseOfStudy = courseOfStudy.title()
    courseToMentorSemester = courseToMentorSemester  # Assuming it's already formatted correctly

    # Query mentors based on provided criteria
    mentors = db.query(Mentor).filter(
        Mentor.degreeProgram.ilike(f"%{degreeProgram}%"),
        Mentor.courseOfStudy.ilike(f"%{courseOfStudy}%"),
        Mentor.courseToMentor.ilike(f"%{currentCourse}%"),
        Mentor.courseToMentorSemester.ilike(f"%{courseToMentorSemester}%")
    ).all()

    # Convert mentors to response schema
    mentor_list = []
    for mentor in mentors:
        mentor_data = {
            "courseOfStudy": mentor.courseOfStudy,
            "degreeProgram": mentor.degreeProgram,
            "email": mentor.email,
            "firstName": mentor.firstName,
            "lastName": mentor.lastName,
            "matriculationNumber": mentor.matriculationNumber,
            "profile_picture": mentor.profile_picture,
            "semester": mentor.semester,
            "courseToMentor": mentor.courseToMentor,
            "grade": mentor.grade,
            "tutorDays": mentor.tutorDays,
            "courseToMentorSemester": mentor.courseToMentorSemester  # Ensure this field is included
        }
        mentor_list.append(mentor_data)

    return mentor_list


# Endpoint to create a meeting in Daily.co
@app.post("/api/create-meeting", response_model=MeetingResponse)
def create_meeting(request: CreateMeetingRequest, db: Session = Depends(get_db)):
    try:
        # Make API call to Daily.co to create a new room
        headers = {
            "Authorization": f"Bearer {DAILY_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "name": request.name,
            "privacy": request.privacy
        }
        response = requests.post(f"{DAILY_API_BASE_URL}/rooms", json=payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()

        # Save meeting details to database
        meeting = Meeting(
            name=request.name,
            privacy=request.privacy,
            room_url=response_data.get("url"),
           email=request.email  # Use email instead of user_id
        )
        db.add(meeting)
        db.commit()

        # Return the meeting details in the response
        return MeetingResponse(name=request.name, privacy=request.privacy, room_url=response_data.get("url"))

    except requests.exceptions.RequestException as e:
        print("Error creating meeting:", e)
        raise HTTPException(status_code=500, detail="Failed to create meeting.")

    except Exception as e:
        print("Error creating meeting:", e)
        raise HTTPException(status_code=500, detail="Internal server error.")

# Endpoint to start a meeting immediately
@app.post("/api/start-meeting/{meeting_id}")
def start_meeting(meeting_id: str, db: Session = Depends(get_db)):
    try:
        # Make API call to Daily.co to start the meeting
        headers = {
            "Authorization": f"Bearer {DAILY_API_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.post(f"{DAILY_API_BASE_URL}/meeting-tokens/{meeting_id}/claim", headers=headers)
        response.raise_for_status()
        response_data = response.json()

        # Redirect user to the meeting URL
        if response_data.get("url"):
            return {"meeting_url": response_data.get("url")}
        else:
            raise HTTPException(status_code=404, detail="Meeting not found.")

    except requests.exceptions.RequestException as e:
        print("Error starting meeting:", e)
        raise HTTPException(status_code=500, detail="Failed to start meeting.")

    except Exception as e:
        print("Error starting meeting:", e)
        raise HTTPException(status_code=500, detail="Internal server error.")


@app.post("/api/check-meeting-name")
async def check_meeting_name(request: MeetingNameRequest, db: Session = Depends(get_db)):
    existing_meeting = db.query(Meeting).filter(Meeting.name == request.name).first()
    if existing_meeting:
        return {"exists": True}
    return {"exists": False}



@app.post("/create-checkout-session/")
async def create_checkout_session(request: Request):
    data = await request.json()
    mentor_email = data.get('mentor_email')

    if not mentor_email:
        raise HTTPException(status_code=400, detail="Mentor email is required")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': 'Mentor Booking',
                    },
                    'unit_amount': 1000,  # 10 Euros in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
        )
        return {"id": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/save-mentee/")
def save_mentee(mentee_data: MenteeCreate, db: Session = Depends(get_db)):
    try:
        mentor = db.query(Mentor).filter(Mentor.email == mentee_data.mentor_email).first()
        if not mentor:
            raise HTTPException(status_code=404, detail="Mentor not found")

        student = db.query(User).filter(User.email == mentee_data.student_email).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        mentee = Mentee(
            user_id=student.id,
            mentor_id=mentor.id,
            course_name=mentee_data.course_name,
        )

        db.add(mentee)
        db.commit()
        return {"message": "Mentee data saved successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/check-paid-mentee/{email}")
def check_paid_mentee(email: str, db: Session = Depends(get_db)):
    mentee = db.query(Mentee).join(User).filter(User.email == email).first()
    if mentee:
        return {"is_paid_mentee": True}
    return {"is_paid_mentee": False}

@app.post("/rate-mentor/")
def rate_mentor(rating_data: RateMentor, db: Session = Depends(get_db)):
    try:
        rating = Rating(
            rating=rating_data.rating,
            review=rating_data.review,
            user_id=rating_data.user_id,
            mentor_id=rating_data.mentor_id,
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ratings/{mentor_id}", response_model=List[RatingResponse])
def get_ratings(mentor_id: int, db: Session = Depends(get_db)):
    ratings = db.query(Rating).filter(Rating.mentor_id == mentor_id).all()
    return ratings


# API endpoint for updating user profile
@app.put("/update-profile/")
async def update_profile(
    email: str = Form(...),
    username: str = Form(...),
    firstName: str = Form(...),
    lastName: str = Form(...),
    courseOfStudy: str = Form(...),
    semester: str = Form(...),
    matriculationNumber: str = Form(...),
    degreeProgram: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        user_update = UserUpdate(
            email=email,
            username=username,
            firstName=firstName,
            lastName=lastName,
            courseOfStudy=courseOfStudy,
            semester=semester,
            matriculationNumber=matriculationNumber,
            degreeProgram=degreeProgram
        )

        db_user = db.query(User).filter(User.email == user_update.email).first()

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update user data
        db_user.username = user_update.username
        db_user.firstName = user_update.firstName
        db_user.lastName = user_update.lastName
        db_user.courseOfStudy = user_update.courseOfStudy
        db_user.semester = user_update.semester
        db_user.matriculationNumber = user_update.matriculationNumber
        db_user.degreeProgram = user_update.degreeProgram

        # If a new profile picture is provided, update it
        if file:
            try:
                os.makedirs("profile_pics", exist_ok=True)
                file_path = os.path.join("profile_pics", file.filename)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                db_user.profile_picture = file_path
            except Exception as e:
                print("Error uploading profile picture:", e)
                raise HTTPException(status_code=500, detail="Error uploading profile picture")

        db.commit()
        db.refresh(db_user)

        return {"message": "Profile updated successfully", "user": db_user}
    except Exception as e:
        print("Error updating profile:", e)
        raise HTTPException(status_code=500, detail="Error updating profile")
    

# Endpoint to send a message
@app.post("/messages/", response_model=MessageResponse)
def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    db_message = Message(
        sender_username=message.sender_username,
        sender_email=message.sender_email,
        content=message.content,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Endpoint to get all messages
@app.get("/messages/", response_model=List[MessageResponse])
def get_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).all()
    return messages





@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the ECRI Student Hub API"}

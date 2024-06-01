from fastapi import FastAPI, HTTPException, Depends, Request, Response, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from typing import Optional
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
DATABASE_URL = "postgresql://postgres:THD111@localhost:5432/student_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define database models
Base = declarative_base()

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
    profile_picture = Column(String, nullable=True)  # New column for profile picture
    tokens = relationship("Token", back_populates="user")

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="tokens")

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


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the ECRI Student Hub API"}
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import secrets
from typing import Dict, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ---------------- CONFIG ----------------
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
OTP_EXPIRE_MINUTES = 10

# Email config (update with your email)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your-email@gmail.com"
SMTP_PASSWORD = "your-app-password"
EMAIL_FROM = "noreply@dbdigitalbanking.com"

app = FastAPI(
    title="DB Digital Banking API",
    description="Secure Digital Banking with OTP Password Reset",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ---------------- OTP STORAGE ----------------
otp_storage: Dict[str, Dict] = {}

# ---------------- USER DATABASE ----------------
class UserDB:
    def __init__(self):
        self.users = {
            "john@db.com": {
                "password": "password123",
                "name": "John Doe",
                "phone": "+1234567890",
                "created_at": datetime.utcnow()
            },
            "jane@db.com": {
                "password": "securepass456",
                "name": "Jane Smith",
                "phone": "+0987654321",
                "created_at": datetime.utcnow()
            }
        }
    
    def get_user(self, email: str):
        return self.users.get(email)
    
    def create_user(self, email: str, password: str, name: str, phone: str):
        if email in self.users:
            return False
        self.users[email] = {
            "password": password,
            "name": name,
            "phone": phone,
            "created_at": datetime.utcnow()
        }
        return True
    
    def update_password(self, email: str, new_password: str):
        if email in self.users:
            self.users[email]["password"] = new_password
            return True
        return False

user_db = UserDB()

# ---------------- MODELS ----------------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class LoginRequest(BaseModel):
    username: EmailStr
    password: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict

class OTPResponse(BaseModel):
    message: str
    expires_in: int

class ResetResponse(BaseModel):
    message: str

class ProtectedResponse(BaseModel):
    message: str
    user: Dict
    balance: float
    account_number: str
    last_login: datetime
    recent_transactions: list
    location_verified: bool

# ---------------- EMAIL SERVICE ----------------
async def send_otp_email(email: str, otp: str):
    """Send OTP to user's email"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = "DB Digital Banking - Password Reset OTP"
        
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #4dabf7 0%, #1c7ed6 100%); 
                          color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f8f9fa; padding: 30px; }}
                .otp-box {{ background: white; padding: 20px; text-align: center; 
                           border: 2px dashed #4dabf7; margin: 20px 0; font-size: 32px; 
                           font-weight: bold; color: #1c7ed6; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>DB Digital Banking</h1>
                    <p>Password Reset Verification</p>
                </div>
                <div class="content">
                    <h2>Hello,</h2>
                    <p>You have requested to reset your password.</p>
                    <p>Please use the following OTP:</p>
                    
                    <div class="otp-box">
                        {otp}
                    </div>
                    
                    <p>This OTP is valid for 10 minutes.</p>
                    
                    <p>If you didn't request this, please ignore this email.</p>
                    
                    <p>Best regards,<br>
                    <strong>DB Digital Banking Security Team</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # For demo - print OTP to console
        print(f"📧 [DEMO] OTP for {email}: {otp}")
        print("📧 [DEMO] In production, uncomment SMTP code")
        
        """
        # Uncomment for actual email sending:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        """
        
        return True
        
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# ---------------- OTP FUNCTIONS ----------------
def generate_otp() -> str:
    return ''.join(secrets.choice('0123456789') for _ in range(6))

def store_otp(email: str, otp: str):
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)
    otp_storage[email] = {
        "otp": otp,
        "expires_at": expires_at,
        "attempts": 0
    }
    cleanup_otps()

def verify_otp(email: str, otp: str) -> bool:
    if email not in otp_storage:
        return False
    
    otp_data = otp_storage[email]
    
    if datetime.utcnow() > otp_data["expires_at"]:
        del otp_storage[email]
        return False
    
    if otp_data["otp"] == otp:
        del otp_storage[email]
        return True
    
    otp_data["attempts"] += 1
    if otp_data["attempts"] >= 5:
        del otp_storage[email]
    
    return False

def cleanup_otps():
    current_time = datetime.utcnow()
    expired_emails = [
        email for email, data in otp_storage.items()
        if current_time > data["expires_at"]
    ]
    for email in expired_emails:
        del otp_storage[email]

# ---------------- JWT FUNCTIONS ----------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- PASSWORD RESET APIS ----------------
@app.post("/api/forgot-password", response_model=OTPResponse)
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    email = request.email
    
    user = user_db.get_user(email)
    if not user:
        return {
            "message": "If your email is registered, you will receive an OTP shortly.",
            "expires_in": OTP_EXPIRE_MINUTES
        }
    
    otp = generate_otp()
    store_otp(email, otp)
    background_tasks.add_task(send_otp_email, email, otp)
    
    return {
        "message": "OTP sent to your registered email address",
        "expires_in": OTP_EXPIRE_MINUTES
    }

@app.post("/api/verify-otp")
async def verify_otp_endpoint(request: VerifyOTPRequest):
    email = request.email
    otp = request.otp
    
    if not user_db.get_user(email):
        raise HTTPException(status_code=404, detail="User not found")
    
    if verify_otp(email, otp):
        return {"message": "OTP verified successfully", "verified": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@app.post("/api/reset-password", response_model=ResetResponse)
async def reset_password(request: ResetPasswordRequest):
    email = request.email
    otp = request.otp
    new_password = request.new_password
    
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    user = user_db.get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_otp(email, otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    if user_db.update_password(email, new_password):
        return {"message": "Password reset successful. You can now login with your new password."}
    else:
        raise HTTPException(status_code=500, detail="Failed to reset password")

# ---------------- REGISTRATION API ----------------
@app.post("/api/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    if not user_data.email or "@" not in user_data.email:
        raise HTTPException(status_code=400, detail="Please provide a valid email address")
    
    if len(user_data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    if not user_data.name:
        raise HTTPException(status_code=400, detail="Please provide your full name")
    
    if user_db.get_user(user_data.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    if not user_db.create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name,
        phone=user_data.phone
    ):
        raise HTTPException(status_code=500, detail="Failed to create user account")
    
    token = create_access_token({
        "username": user_data.email,
        "latitude": None,
        "longitude": None
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user_data.name,
            "email": user_data.email,
            "phone": user_data.phone
        }
    }

# ---------------- LOGIN API ----------------
@app.post("/api/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    user = user_db.get_user(data.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({
        "username": data.username,
        "latitude": data.latitude,
        "longitude": data.longitude
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": data.username,
            "phone": user["phone"]
        }
    }

# ---------------- DASHBOARD API ----------------
@app.get("/api/dashboard", response_model=ProtectedResponse)
async def get_dashboard(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    token_data = verify_token(token)
    
    user = user_db.get_user(token_data["username"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    mock_balance = 12500.75
    mock_transactions = [
        {"date": "2023-10-01", "description": "Salary Deposit", "amount": 3000.00},
        {"date": "2023-10-05", "description": "Grocery Store", "amount": -125.50},
        {"date": "2023-10-10", "description": "Online Shopping", "amount": -89.99},
    ]
    
    return {
        "message": f"Welcome to DB Digital Banking, {user['name']}!",
        "user": {
            "name": user["name"],
            "email": token_data["username"],
            "phone": user["phone"],
            "joined": user["created_at"].strftime("%B %d, %Y")
        },
        "balance": mock_balance,
        "account_number": "DB-9876543210",
        "last_login": datetime.utcnow(),
        "recent_transactions": mock_transactions,
        "location_verified": token_data.get("latitude") is not None
    }

# ---------------- ROOT ----------------
@app.get("/")
async def root():
    return {
        "message": "DB Digital Banking API",
        "version": "1.0.0",
        "endpoints": {
            "register": "/api/register",
            "login": "/api/login",
            "forgot_password": "/api/forgot-password",
            "verify_otp": "/api/verify-otp",
            "reset_password": "/api/reset-password",
            "dashboard": "/api/dashboard"
        }
    }
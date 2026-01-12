from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from typing import Dict, Optional

# ---------------- CONFIG ----------------
SECRET_KEY = "db_digital_banking_secret_key_2023"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(
    title="DB Digital Banking API",
    description="Secure Digital Banking with Location-Aware Authentication",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

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

user_db = UserDB()

# ---------------- MODELS ----------------
class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict

class TokenData(BaseModel):
    username: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ProtectedResponse(BaseModel):
    message: str
    user: Dict
    balance: float
    last_login: datetime

# ---------------- JWT FUNCTIONS ----------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(
            username=payload["username"],
            latitude=payload.get("latitude"),
            longitude=payload.get("longitude")
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired. Please login again."
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Please login again."
        )

# ---------------- REGISTRATION API ----------------
@app.post("/api/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """
    Register a new user for DB Digital Banking
    """
    # Basic validation
    if not user_data.email or "@" not in user_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address"
        )
    
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )
    
    if not user_data.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide your full name"
        )
    
    # Check if user already exists
    if user_db.get_user(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create user
    if not user_db.create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name,
        phone=user_data.phone
    ):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account"
        )
    
    # Create token
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
    """
    Login to DB Digital Banking
    """
    # Get user from database
    user = user_db.get_user(data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if user["password"] != data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create token with location data
    token_data = {
        "username": data.username,
        "latitude": data.latitude,
        "longitude": data.longitude
    }
    
    token = create_access_token(token_data)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": data.username,
            "phone": user["phone"]
        }
    }

# ---------------- PROTECTED API (Dashboard) ----------------
@app.get("/api/dashboard", response_model=ProtectedResponse)
async def get_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get user dashboard data
    """
    token = credentials.credentials
    token_data = verify_token(token)
    
    user = user_db.get_user(token_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Mock bank data (in real app, this would come from a database)
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
            "email": token_data.username,
            "phone": user["phone"],
            "joined": user["created_at"].strftime("%B %d, %Y")
        },
        "balance": mock_balance,
        "account_number": "DB-9876543210",
        "last_login": datetime.utcnow(),
        "recent_transactions": mock_transactions,
        "location_verified": token_data.latitude is not None
    }

# ---------------- ACCOUNT INFO API ----------------
@app.get("/api/account")
async def get_account_info(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get detailed account information
    """
    token = credentials.credentials
    token_data = verify_token(token)
    
    user = user_db.get_user(token_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return {
        "account": {
            "holder": user["name"],
            "email": token_data.username,
            "phone": user["phone"],
            "account_type": "Premium Digital Banking",
            "account_since": user["created_at"].strftime("%Y-%m-%d"),
            "status": "Active",
            "routing_number": "021000021",
            "iban": "US33 1234 5678 9012 3456 7890"
        }
    }

# ---------------- HEALTH CHECK ----------------
@app.get("/")
async def root():
    return {
        "message": "DB Digital Banking API",
        "status": "running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
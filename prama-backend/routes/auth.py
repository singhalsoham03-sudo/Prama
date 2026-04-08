from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import sqlite3

from database import get_db
from models import SignupRequest, LoginRequest, TokenResponse, UserResponse

# Google OAuth
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = "prama-yukti-secret-2024"
ALGORITHM = "HS256"
EXPIRE_DAYS = 30
GOOGLE_CLIENT_ID = "812748564517-t5nfapg2benii4kagouvagnac41ef55j.apps.googleusercontent.com"

def make_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=EXPIRE_DAYS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(creds: HTTPAuthorizationCredentials = Depends(security)) -> int:
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/signup", response_model=TokenResponse)
def signup(body: SignupRequest):
    db = get_db()
    try:
        hashed = pwd_context.hash(body.password)
        cursor = db.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
            (body.name, body.email, hashed)
        )
        db.commit()
        user_id = cursor.lastrowid
        token = make_token(user_id)
        return {"access_token": token, "user": {"id": user_id, "name": body.name, "email": body.email}}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        db.close()

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    db = get_db()
    try:
        row = db.execute("SELECT * FROM users WHERE email = ?", (body.email,)).fetchone()
        if not row or not pwd_context.verify(body.password, row["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = make_token(row["id"])
        return {"access_token": token, "user": {"id": row["id"], "name": row["name"], "email": row["email"]}}
    finally:
        db.close()

@router.get("/me", response_model=UserResponse)
def get_me(user_id: int = Depends(get_current_user_id)):
    db = get_db()
    try:
        row = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {"id": row["id"], "name": row["name"], "email": row["email"]}
    finally:
        db.close()

@router.post("/google")
def google_login(body: dict):
    try:
        # Verify the token Google sent is genuine
        idinfo = id_token.verify_oauth2_token(
            body.get("credential"),
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        name = idinfo.get("name", "Google User")
        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="No email from Google")

        db = get_db()
        try:
            row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            if row:
                # Existing user — log them in
                token = make_token(row["id"])
                return {"access_token": token, "user": {"id": row["id"], "name": row["name"], "email": row["email"]}}
            else:
                # New user — create account (no password for Google users)
                cursor = db.execute(
                    "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
                    (name, email, "google_oauth")
                )
                db.commit()
                user_id = cursor.lastrowid
                token = make_token(user_id)
                return {"access_token": token, "user": {"id": user_id, "name": name, "email": email}}
        finally:
            db.close()

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
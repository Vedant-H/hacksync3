import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException

# Secret key used to encode and decode the JWT token
SECRET_KEY = "6_M6IcqkJfnrI-puSbJThmom1VHDIpLdUHAb7398crc="

# Algorithm used for signing the token
ALGORITHM = "HS256"

# Access token expiry time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to verify a plain password against the hashed password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to hash a plain password
def get_password_hash(password):
    return pwd_context.hash(password)

# Function to create a JWT access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to decode a JWT access token
# def decode_access_token(token: str):
#     try:
#         # Decode the token and validate it
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token has expired")
#     except jwt.JWTError:
#         raise HTTPException(status_code=401, detail="Could not validate credentials")


def decode_access_token(token: str):
    try:
        # Decode the token and validate it
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError: # Change Here
        raise HTTPException(status_code=401, detail="Could not validate credentials")
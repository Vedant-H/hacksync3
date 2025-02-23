# # from fastapi import APIRouter, HTTPException
# # from pydantic import BaseModel
# # from auth import create_access_token, get_password_hash, verify_password
# # from database import users_collection

# # router = APIRouter()

# # class UserSignup(BaseModel):
# #     username: str
# #     email: str
# #     password: str

# # @router.post("/signup")
# # async def signup(user: UserSignup):
# #     # Check if the user already exists based on email
# #     if users_collection.find_one({"email": user.email}):
# #         raise HTTPException(status_code=400, detail="User already exists")
    
# #     # Hash the password before storing
# #     hashed_password = get_password_hash(user.password)
    
# #     # Insert the new user into the database
# #     users_collection.insert_one({
# #         "username": user.username,
# #         "email": user.email,
# #         "password": hashed_password
# #     })
# #     return {"message": "User created successfully", "username": user.username, "email": user.email}

# # @router.post("/login")
# # async def login(user: UserSignup):
# #     # Check if the user exists in the database
# #     existing_user = users_collection.find_one({"email": user.email})
    
# #     if not existing_user or not verify_password(user.password, existing_user["password"]):
# #         raise HTTPException(status_code=401, detail="Invalid credentials")
    
# #     # Create and return the access token
# #     token = create_access_token({"sub": existing_user["email"]})
# #     return {"access_token": token}


# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel
# from auth import create_access_token, get_password_hash, verify_password, decode_access_token
# from database import users_collection
# from fastapi.security import OAuth2PasswordBearer

# router = APIRouter()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# # UserSignup model for signup
# class UserSignup(BaseModel):
#     username: str
#     email: str
#     password: str

# # UserLogin model for login (only email and password needed)
# class UserLogin(BaseModel):
#     email: str
#     password: str

# @router.post("/signup")
# async def signup(user: UserSignup):
#     # Check if the user already exists based on email
#     if users_collection.find_one({"email": user.email}):
#         raise HTTPException(status_code=400, detail="User already exists")
    
#     # Hash the password before storing
#     hashed_password = get_password_hash(user.password)
    
#     # Insert the new user into the database
#     users_collection.insert_one({
#         "username": user.username,
#         "email": user.email,
#         "password": hashed_password
#     })
#     return {"message": "User created successfully", "username": user.username, "email": user.email}

# @router.post("/login")
# async def login(user: UserLogin):
#     # Check if the user exists in the database
#     existing_user = users_collection.find_one({"email": user.email})
    
#     if not existing_user or not verify_password(user.password, existing_user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     # Create and return the access token
#     token = create_access_token({"sub": existing_user["email"]})
#     return {"access_token": token}

# # GET route to fetch user information by email
# @router.get("/profile")
# async def get_user_profile(token: str = Depends(oauth2_scheme)):
#     try:
#         # Decode the JWT token to extract the user's email
#         payload = decode_access_token(token)
#         email = payload.get("sub")
        
#         # Retrieve the user's details from the database
#         existing_user = users_collection.find_one({"email": email})
        
#         if not existing_user:
#             raise HTTPException(status_code=404, detail="User not found")
        
#         # Return user details (except the password)
#         return {
#             "username": existing_user["username"],
#             "email": existing_user["email"]
#         }
#     except Exception as e:
#         raise HTTPException(status_code=401, detail="Could not validate credentials")
# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel
# from auth import create_access_token, verify_password, decode_access_token , get_password_hash
# from database import users_collection
# from fastapi.security import OAuth2PasswordBearer
# from bson import ObjectId

# router = APIRouter()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# # UserSignup model for signup
# class UserSignup(BaseModel):
#     username: str
#     email: str
#     password: str

# # UserLogin model for login (only email and password needed)
# class UserLogin(BaseModel):
#     email: str
#     password: str

# # Signup route
# @router.post("/signup")
# async def signup(user: UserSignup):
#     if users_collection.find_one({"email": user.email}):
#         raise HTTPException(status_code=400, detail="User already exists")
    
#     hashed_password = get_password_hash(user.password)
#     users_collection.insert_one({
#         "username": user.username,
#         "email": user.email,
#         "password": hashed_password
#     })
#     return {"message": "User created successfully", "username": user.username, "email": user.email}

# # Login route (POST method to handle login)

# @router.post("/login")
# async def login(user: UserLogin):
#     # Check if the user exists in the database
#     existing_user = users_collection.find_one({"email": user.email})
    
#     if not existing_user:
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     # Verify the password
#     if not verify_password(user.password, existing_user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     # Generate the access token
#     access_token = create_access_token(data={"sub": user.email})
    
#     return {"access_token": access_token, "token_type": "bearer"}

# user_routes.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth import create_access_token, verify_password, get_password_hash
from database import users_collection
from bson import ObjectId

router = APIRouter()

# UserSignup model for signup
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

# UserLogin model for login (only email and password needed)
class UserLogin(BaseModel):
    email: str
    password: str

# Signup route
@router.post("/signup")
async def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = get_password_hash(user.password)
    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    })
    return {"message": "User created successfully", "username": user.username, "email": user.email}

# Login route (POST method to handle login)
@router.post("/login")
async def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    user_id = str(existing_user["_id"])  # Convert ObjectId to string

    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id}  # Return user_id
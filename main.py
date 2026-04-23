from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# 1. The VIP List (CORS) - Allows your HTML Live Server to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any frontend to connect during the hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Defining the exact shape of the data coming from JavaScript
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TrafficRequest(BaseModel):
    location: str

# 3. A Fake Database (A simple Python dictionary to hold users until we add SQL)
fake_users_db = {} 

# ==========================================
# 4. THE API ENDPOINTS (The Kitchen Recipes)
# ==========================================

@app.post("/api/register")
def register_user(user: UserRegister):
    # Check if the email is already in our fake database
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Save the new user
    fake_users_db[user.email] = {
        "name": user.name,
        "password": user.password
    }
    return {"message": "User created successfully"}


@app.post("/api/login")
def login_user(user: UserLogin):
    # Try to find the user by their email
    db_user = fake_users_db.get(user.email)
    
    # If no user is found, or the password doesn't match
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return {"message": "Login successful", "name": db_user["name"]}


@app.post("/api/check-traffic")
def check_traffic(request: TrafficRequest):
    # Generate a random traffic condition to simulate real data
    traffic_conditions = ["Light", "Moderate", "Heavy", "Standstill Gridlock"]
    current_traffic = random.choice(traffic_conditions)
    
    # Send the result back to the JavaScript frontend!
    return {
        "location": request.location,
        "trafficLevel": current_traffic
    }
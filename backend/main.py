from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, story_routes, payment_routes

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with a specific list of allowed origins (e.g., ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the routers for different modules
app.include_router(user_routes.router, prefix="/user")
app.include_router(story_routes.router, prefix="/story")
app.include_router(payment_routes.router, prefix="/payment")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

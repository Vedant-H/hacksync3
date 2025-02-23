from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
# mongodb+srv://vedanthariyan29:dV6DSY2TeeDlrN5J@cluster0.k8mod.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
# Access the database
db = client["hacksync"]

# Access the users collection
users_collection = db["users"]
stories_collection = db["stories"]  # Replace 'stories' with the actual name of your collection

# Example: Insert a document



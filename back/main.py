from fastapi import FastAPI, Response, status, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, get_db
import models

# Create tables in database
models.Base.metadata.create_all(bind=engine)

# Pydantic models for request validation
class LoginSchema(BaseModel):
    username: str
    password: str
    
    class Config:
        orm_mode = True

class NewUserSchema(BaseModel):
    Name: str
    RollNo: str
    username: str
    password: str
    
    class Config:
        orm_mode = True

# FastAPI application
app = FastAPI()

@app.get("/")
async def mainpage():
    return {"message": "Welcome to ACM Student Chapter"}

@app.post("/login")
async def login(post: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.LoginModel).filter(models.LoginModel.username == post.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # In a real application, use password hashing and verification
    if user.password != post.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {"username": post.username, "status": "logged in successfully"}

@app.post("/newuser", status_code=status.HTTP_201_CREATED)
async def create_user(post: NewUserSchema, db: Session = Depends(get_db)):
    try:
        # Check if username already exists
        existing_user = db.query(models.UserModel).filter(models.UserModel.username == post.username).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                               detail=f"User with username {post.username} already exists")
        
        # Create new user
        new_user = models.UserModel(
            username=post.username,
            password=post.password,  # In production, hash the password
            name=post.Name,
            rollno=post.RollNo
        )
        
        # Create login entry
        new_login = models.LoginModel(
            username=post.username,
            password=post.password  # In production, hash the password
        )
        
        db.add(new_user)
        db.add(new_login)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "User created successfully", "data": {
            "username": new_user.username,
            "name": new_user.name,
            "rollno": new_user.rollno
        }}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/newuser/{username}")
async def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.UserModel).filter(models.UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                           detail=f"User with username {username} not found")
    
    return {"post_detail": {
        "username": user.username,
        "name": user.name,
        "rollno": user.rollno
    }}

@app.put("/newuser/{username}")
def update_password(username: str, post: LoginSchema, db: Session = Depends(get_db)):
    user_query = db.query(models.UserModel).filter(models.UserModel.username == username)
    user = user_query.first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                           detail=f"User with username {username} not found")
    
    # Update user password
    user_query.update({"password": post.password}, synchronize_session=False)
    
    # Update login password
    login_query = db.query(models.LoginModel).filter(models.LoginModel.username == username)
    login_query.update({"password": post.password}, synchronize_session=False)
    
    db.commit()
    
    return {"message": "Password updated successfully"}

@app.get("/sqlalchemy")
def test_post(db: Session = Depends(get_db)):
    return {"Status": "success"}
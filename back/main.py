from fastapi import FastAPI, Response, status, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import Column, String, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# Database setup
DATABASE_URL = 'postgresql://postgres:Visu%402006@localhost/app'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy models
class UserModel(Base):
    __tablename__ = 'newuser'
    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    rollno = Column(String, nullable=False)
    
    # Optional relationship
    logins = relationship("LoginModel", back_populates="user")

class LoginModel(Base):
    __tablename__ = "login"
    username = Column(String, ForeignKey("newuser.username"), primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Optional relationship
    user = relationship("UserModel", back_populates="logins")

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

# FastAPI app
app = FastAPI()

@app.get("/")
async def mainpage():
    return {"message": "Welcome to ACM Student Chapter"}

@app.post("/login")
async def login(post: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(LoginModel).filter(LoginModel.username == post.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # In real application, use password hashing and verification
    if user.password != post.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {"username": post.username, "status": "logged in successfully"}

@app.post("/newuser", status_code=status.HTTP_201_CREATED)
async def create_user(post: NewUserSchema, db: Session = Depends(get_db)):
    try:
        # Check if username already exists
        existing_user = db.query(UserModel).filter(UserModel.username == post.username).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                               detail=f"User with username {post.username} already exists")
        
        # Create new user
        new_user = UserModel(
            username=post.username,
            password=post.password,  # In production, hash the password
            name=post.Name,
            rollno=post.RollNo
        )
        
        # Create login entry
        new_login = LoginModel(
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
    user = db.query(UserModel).filter(UserModel.username == username).first()
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
    user_query = db.query(UserModel).filter(UserModel.username == username)
    user = user_query.first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                           detail=f"User with username {username} not found")
    
    # Update user password
    user_query.update({"password": post.password}, synchronize_session=False)
    
    # Update login password
    login_query = db.query(LoginModel).filter(LoginModel.username == username)
    login_query.update({"password": post.password}, synchronize_session=False)
    
    db.commit()
    
    return {"message": "Password updated successfully"}

@app.get("/sqlalchemy")
def test_post(db: Session = Depends(get_db)):
    return {"Status": "success"}
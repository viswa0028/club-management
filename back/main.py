# from datetime import datetime
from sqlite3 import Date
import getpass
import smtplib
from fastapi import FastAPI, Response, status, HTTPException, Depends
from param.ipython import message
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from sqlalchemy import func
models.Base.metadata.create_all(bind=engine)

Host = 'smtp.gmail.com'
port= 587
from_email = 'kodalivisu0028@gmail.com'
password = getpass.getpass("Enter the Password:")
class KPISchema(BaseModel):
    name: str
    value: float
    target: float
    category: str
    date_recorded: str = None

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    username: str
    password: str
    class Config:
        orm_mode = True

class NewUserSchema(BaseModel):
    Name: str
    RollNo: str
    email:str
    username: str
    password: str
    
    class Config:
        orm_mode = True
# In main.py
class ProjectSchema(BaseModel):
    title: str
    deadline: str
    username: str
    completed: bool
    class Config:
        from_attributes = True
app = FastAPI()

@app.get("/")
async def mainpage():
    return {"message": "Welcome to ACM Student Chapter"}

@app.post("/login")
async def login(post: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.LoginModel).filter(models.LoginModel.username == post.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

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
            password=post.password,
            name=post.Name,
            rollno=post.RollNo
        )
        
        # Create login entry
        new_login = models.LoginModel(
            username=post.username,
            password=post.password
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


@app.get("/login/{username}/projects")
def Projects(username: str, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.UserModel).filter(models.UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    projects = db.query(models.NewProjects).filter(models.NewProjects.username == username).all()
    return {"projects": projects}

@app.put('/login/{username}/addproject')
def addProjects(username: str, project: ProjectSchema, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.UserModel).filter(models.UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        deadline_date = Date.fromisoformat(project.deadline)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    new_project = models.NewProjects(
        username=username,
        title=project.title,
        deadline=deadline_date,
        completed=project.completed,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


@app.post('/kpi/{username}')
def add_kpi(username: str, kpi: KPISchema, db: Session = Depends(get_db)):
    user = db.query(models.UserModel).filter(models.UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_kpi = models.KPI(
        name=kpi.name,
        value=kpi.value,
        target=kpi.target,
        username=username,
        category=kpi.category
    )

    if kpi.date_recorded:
        try:
            new_kpi.date_recorded = Date.fromisoformat(kpi.date_recorded)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    db.add(new_kpi)
    db.commit()
    db.refresh(new_kpi)

    return new_kpi


@app.get('/kpi/{username}')
def get_kpi(username: str, db: Session = Depends(get_db)):
    user = db.query(models.UserModel).filter(models.UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    kpis = db.query(models.KPI).filter(models.KPI.username == username).all()
    projects = db.query(models.NewProjects).filter(
        models.NewProjects.username == username,
        models.NewProjects.completed == False
    ).all()
    notifications = []
    for project in projects:
        notifications.append({
            "project": project.title,
            "deadline": project.deadline.isoformat() if project.deadline else None
        })
    if(notifications['deadline']-func.current_date <=1):
        send_deadline_notification(models.UserModel.email,notifications['project'],notifications['deadline'])
    return {
        'kpis': kpis,
        'notifications': notifications
    }


@app.get('/kpi/{username}/performance')
def get_performance(username: str, db: Session = Depends(get_db)):
    kpis = db.query(models.KPI).filter(models.KPI.username == username).all()
    categories = {}
    for kpi in kpis:
        if kpi.category not in categories:
            categories[kpi.category] = []
        performance = (kpi.value / kpi.target * 100) if kpi.target != 0 else 0

        categories[kpi.category].append({
            "name": kpi.name,
            "value": kpi.value,
            "target": kpi.target,
            "performance": performance
        })

    performance_data = {
        'overall_score': 0,
        'categories': {},
        'metrics_count': len(kpis)
    }

    total_score = 0
    for category, metrics in categories.items():
        category_score = sum(m['performance'] for m in metrics) / len(metrics) if metrics else 0
        performance_data['categories'][category] = {
            "score": category_score,
            "metrics": metrics
        }
        total_score += category_score

    if categories:
        performance_data["overall_score"] = total_score / len(categories)

    return performance_data


def send_deadline_notification(user_email, project_title, deadline_date):
    try:
        message = f"Subject: Project Deadline Reminder\n\nYour project '{project_title}' is due on {deadline_date}."

        smtp = smtplib.SMTP(Host, port)
        smtp.ehlo()
        smtp.starttls()
        smtp.login(from_email, password)
        smtp.sendmail(from_email, user_email, message)
        smtp.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

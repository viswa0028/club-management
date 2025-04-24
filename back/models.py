from sqlalchemy import Column, String, ForeignKey, Date, Boolean,Integer,Float,func
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class UserModel(Base):
    __tablename__ = 'newuser'
    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String,nullable=False)
    name = Column(String, nullable=True)
    rollno = Column(String, nullable=False)

    # Relationship with LoginModel
    logins = relationship("LoginModel", back_populates="user")
    # Add relationship with projects
    projects = relationship("NewProjects", back_populates="user")
    kpis = relationship("KPI", back_populates="user")
class LoginModel(Base):
    __tablename__ = "login"
    username = Column(String, ForeignKey("newuser.username"), primary_key=True, nullable=False)
    password = Column(String, nullable=False)

    # Relationship with UserModel
    user = relationship("UserModel", back_populates="logins")


class NewProjects(Base):
    __tablename__ = 'projects'
    username = Column(String, ForeignKey("newuser.username"), nullable=False, primary_key=True)
    title = Column(String, nullable=False, primary_key=True)
    deadline = Column(Date, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)

    # Add relationship with UserModel
    user = relationship("UserModel", back_populates="projects")

class KPI(Base):
    __tablename__ = "kpis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    target = Column(Float, nullable=False)
    date_recorded = Column(Date, default=func.current_date())
    username = Column(String, ForeignKey("newuser.username"))
    category = Column(String)  #

    # Relationship to user
    user = relationship("UserModel", back_populates="kpis")
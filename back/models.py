from sqlalchemy import Column, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class UserModel(Base):
    __tablename__ = 'newuser'
    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    rollno = Column(String, nullable=False)

    # Relationship with LoginModel
    logins = relationship("LoginModel", back_populates="user")
    # Add relationship with projects
    projects = relationship("NewProjects", back_populates="user")


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
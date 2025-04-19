from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Newuser(Base):
    __tablename__ = 'newuser'
    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    rollno = Column(String, nullable=False)
    
    # If you want a relationship
    logins = relationship("Login", back_populates="user")

class Login(Base):
    __tablename__ = "login"
    username = Column(String, ForeignKey("newuser.username"), primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    
    # If you want a relationship
    user = relationship("Newuser", back_populates="logins")
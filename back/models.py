from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  

class UserModel(Base):
    __tablename__ = 'newuser'
    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    rollno = Column(String, nullable=False)
    
    # Relationship with LoginModel
    logins = relationship("LoginModel", back_populates="user")

class LoginModel(Base):
    __tablename__ = "login"
    username = Column(String, ForeignKey("newuser.username"), primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Relationship with UserModel
    user = relationship("UserModel", back_populates="logins")
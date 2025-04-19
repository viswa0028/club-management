from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# Using URL encoding for special characters in password
Sqlalchemy_Database_url = 'postgresql://postgres:Visu%402006@localhost/app'
engine = create_engine(Sqlalchemy_Database_url)
SessionLocal = sessionmaker(autocommit = False,autoflush=False,bind=engine)
Base = declarative_base()
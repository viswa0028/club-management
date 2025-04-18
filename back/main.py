from fastapi import FastAPI,Response,status,HTTPException
from fastapi.params import Body
from pydantic import BaseModel
from random import randrange
import psycopg2
from psycopg2.extras import RealDictCursor
app = FastAPI()

try:
    conn = psycopg2.connect(host='localhost',database='app',user='postgres',password='Visu@2006',cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    print("Database connection was successful")
except Exception as error:
    print("Connection failed due to ")
    print(error)
class Login(BaseModel):
    username:str
    password:str
class Newuser(BaseModel):
    Name:str
    RollNo:str
    username:str
    password:str

@app.get("/")
async def mainpage():
    return {"message":"Welcome to ACM Student Chapter"}

@app.post("/login")
async def login(post:Login):
    user_dict = post
    if user_dict.username==None:
        raise Exception(status.HTTP_404_NOT_FOUND,detail = "not found")
    
    return {post.username}

@app.post("/newuser")
async def newuser(post: Newuser):
    try:
        cursor.execute(
            "INSERT INTO newuser (username, password, rollno, name) VALUES (%s, %s, %s, %s) RETURNING *",
            (post.username, post.password, post.RollNo, post.Name)
        )
        data = cursor.fetchone()
        conn.commit()
        return {"message": "User created successfully", "data": data}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@app.get("/newuser/{username}")
async def getuser(username: str):
    cursor.execute("SELECT * FROM newuser WHERE username = %s", (username,)) 
    post = cursor.fetchone()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username {username} not found")
    return {"post_detail": post}

@app.put("/newuser/{username}")
def update_password(username: str, post: Newuser):
    cursor.execute("UPDATE newuser SET password = %s WHERE username = %s", (post.password, username))
    updated_rows = cursor.rowcount
    conn.commit()
    
    if updated_rows == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username {username} not found")
    
    return {"message": "Password updated successfully"}
# class post1(BaseModel):
#     title: str
#     content:str
#     rating: int
#     id: int
# model_1 = [{'title':'I love beach','content':'I am always there','rating':4,'id':1},{'title':'I am viswa','content':'I love JAV','rating':5,'id':4}]
# @app.get("/")
# async def root():
#     return {"message": "hi World"}

# @app.post("/create")
# async def posts(filter: post1):
#     model1_dict = filter.dict()
#     status.
#     model_1.append(model1_dict)
#     return {"model1_dict"}

# @app.delete("/posts/{id}")
# async def deletepost(status: status.HTTP_204_NO_CONTENT):
#     for i,p in enumerate(model_1):
#         if(id == i):
#             model_1.pop(model_1[p])

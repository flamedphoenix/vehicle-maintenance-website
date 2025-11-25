from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, cars, logs, admin
from app.db.session import engine  # keep session/engine imports
from app import models  # import your models from app/models.py


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(admin.router)

#Allow requests from your frontend (adjust as needed)
origins = [
    "https://vehiclemaintenance.xyz",
    "http://102.177.72.71:3000",  # your React dev server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # allow this frontend
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],              # allow all headers
)

app.include_router(users.router)
app.include_router(cars.router)
app.include_router(logs.router)
app.include_router(admin.router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, cars, logs, admin
from app.db.session import engine  
from app import models  


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(admin.router)


origins = [
    "https://vehiclemaintenance.xyz",
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

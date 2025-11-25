from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    is_admin: bool
    last_login: datetime | None = None
    last_ip: str | None = None

    model_config = {
        "from_attributes": True
    }

class ServiceLogCreate(BaseModel):
    title: str
    description: str
    date: datetime
    next_due: Optional[datetime] = None
    car_id: int

    model_config = {
        "from_attributes": True
    }

class ServiceLogOut(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    next_due: Optional[datetime] = None
    car_id: int

    model_config = {
        "from_attributes": True
    }

class CarCreate(BaseModel):
    name: str

class CarOut(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }

class ChangePasswordRequest(BaseModel):
    username: str
    old_password: str
    new_password: str

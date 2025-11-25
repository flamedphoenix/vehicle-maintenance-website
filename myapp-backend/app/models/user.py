from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    last_login = Column(DateTime, nullable=True)
    last_ip = Column(String, nullable=True)

    # Relationships
    cars = relationship("Car", back_populates="user", cascade="all, delete, delete-orphan")
    logs = relationship("ServiceLog", back_populates="user", cascade="all, delete-orphan")

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String)

    # Relationships
    user = relationship("User", back_populates="cars")
    logs = relationship("ServiceLog", back_populates="car", cascade="all, delete-orphan")


class ServiceLog(Base):
    __tablename__ = "service_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    title = Column(String)
    description = Column(Text)
    date = Column(Date)        # Date performed
    next_due = Column(Date)    # Next due date

    # Relationships
    user = relationship("User", back_populates="logs")
    car = relationship("Car", back_populates="logs")
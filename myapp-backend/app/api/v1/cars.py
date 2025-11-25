from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, auth
from app.db.session import get_db

router = APIRouter(prefix="/cars", tags=["cars"])

@router.get("/", response_model=List[schemas.CarOut])
def get_cars(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Car).filter(models.Car.user_id == current_user.id).all()

@router.post("/", response_model=schemas.CarOut)
def create_car(car: schemas.CarCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    new_car = models.Car(**car.dict(), user_id=current_user.id)
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.delete("/{car_id}", status_code=204)
def delete_car(car_id: int = Path(...), current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    car = db.query(models.Car).filter_by(id=car_id, user_id=current_user.id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    db.delete(car)
    db.commit()
    return None

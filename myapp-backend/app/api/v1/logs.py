from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas, auth
from app.db.session import get_db

router = APIRouter(prefix="/logs", tags=["logs"])

@router.post("/", response_model=schemas.ServiceLogOut)
def create_service_log(log: schemas.ServiceLogCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    new_log = models.ServiceLog(
        user_id=current_user.id,
        title=log.title,
        description=log.description,
        date=log.date,
        next_due=log.next_due,
        car_id=log.car_id
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/", response_model=List[schemas.ServiceLogOut])
def get_logs(car_id: Optional[int] = Query(None), current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    query = db.query(models.ServiceLog).filter(models.ServiceLog.user_id == current_user.id)
    if car_id:
        query = query.filter(models.ServiceLog.car_id == car_id)
    return query.all()

@router.delete("/{log_id}")
def delete_log(log_id: int, car_id: Optional[int] = Query(None), current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    query = db.query(models.ServiceLog).filter(models.ServiceLog.id == log_id, models.ServiceLog.user_id == current_user.id)
    if car_id:
        query = query.filter(models.ServiceLog.car_id == car_id)
    log = query.first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found or not yours")
    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}

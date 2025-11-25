from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas, auth, utils
from app.db.session import get_db
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = utils.hash_password(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token")
def login_for_access_token(request: Request, form_data=Depends(OAuth2PasswordRequestForm), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # Update last login info
    user.last_login = datetime.utcnow()
    user.last_ip = request.client.host
    db.commit()
    db.refresh(user)

    access_token = auth.create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    data : schemas.ChangePasswordRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db : Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not auth.verify_password(data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    current_user.password = auth.get_password_hash(data.new_password)
    db.commit()
    
    return {"detail": "Password changed successfully"}
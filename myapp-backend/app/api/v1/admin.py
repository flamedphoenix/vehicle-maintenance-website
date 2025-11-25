from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth import admin_required
from app.db.session import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/dashboard", response_model=list[schemas.UserOut])
def admin_dashboard(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(admin_required)  # Only admins allowed
):
    """
    Returns a list of all users. Accessible only by admin users.
    """
    users = db.query(models.User).all()
    return users

@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()
    return 
    

from app.schemas.user import UserOut

def get_dummy_user():
    return UserOut(id=1, name="John Doe")

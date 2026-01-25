from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_role
from app.database import get_db
from app.models import User
from app.schemas import UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get(
    "/users",
    response_model=list[UserOut],
    summary="List all users (admin only)",
)
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    return db.query(User).all()

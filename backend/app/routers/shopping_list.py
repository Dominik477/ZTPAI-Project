from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Meal, MealItem, MealPlan, Product, User
from app.schemas import ShoppingItemOut

router = APIRouter(prefix="/api/shopping-list", tags=["shopping-list"])


@router.get("", response_model=list[ShoppingItemOut])
def get_shopping_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan_rows = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()
    meal_ids = [p.meal_id for p in plan_rows]
    if not meal_ids:
        return []

    items = (
        db.query(MealItem)
        .filter(MealItem.meal_id.in_(meal_ids))
        .all()
    )

    totals: dict[int, float] = {}
    for it in items:
        totals[it.product_id] = totals.get(it.product_id, 0.0) + float(it.quantity_grams)

    products = db.query(Product).filter(Product.id.in_(list(totals.keys()))).all()
    name_map = {p.id: p.name for p in products}

    out: list[ShoppingItemOut] = []
    for pid, grams in sorted(totals.items(), key=lambda x: x[0]):
        out.append(
            ShoppingItemOut(
                product_id=pid,
                product_name=name_map.get(pid, f"Product {pid}"),
                total_grams=grams,
            )
        )
    return out

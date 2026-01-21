from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import MealItem, MealPlan, Product, User, InventoryItem
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

    items = db.query(MealItem).filter(MealItem.meal_id.in_(meal_ids)).all()

    needed: dict[int, float] = {}
    for it in items:
        needed[it.product_id] = needed.get(it.product_id, 0.0) + float(it.quantity_grams)

    products = db.query(Product).filter(Product.id.in_(list(needed.keys()))).all()
    name_map = {p.id: p.name for p in products}

    inv_rows = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.user_id == current_user.id,
            InventoryItem.product_id.in_(list(needed.keys())),
        )
        .all()
    )
    stock_map = {r.product_id: float(r.quantity_grams) for r in inv_rows}

    out: list[ShoppingItemOut] = []
    for pid, total_needed in sorted(needed.items(), key=lambda x: x[0]):
        in_stock = stock_map.get(pid, 0.0)
        missing = max(0.0, total_needed - in_stock)
        out.append(
            ShoppingItemOut(
                product_id=pid,
                product_name=name_map.get(pid, f"Product {pid}"),
                total_needed_grams=total_needed,
                in_stock_grams=in_stock,
                missing_grams=missing,
            )
        )
    return out

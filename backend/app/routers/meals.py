from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app.models import Meal, MealItem, Product, User, InventoryItem 
from app.schemas import MealCreate, MealOut, MealItemOut

router = APIRouter(prefix="/api/meals", tags=["meals"])


def build_meal_out(meal: Meal) -> MealOut:
    total = 0.0
    out_items: list[MealItemOut] = []

    for item in meal.items:
        if not item.product:
            continue
        calories = (item.quantity_grams / 100.0) * item.product.calories_per_100g
        total += calories
        out_items.append(
            MealItemOut(
                product_id=item.product_id,
                product_name=item.product.name,
                quantity_grams=item.quantity_grams,
                calories=calories,
            )
        )

    return MealOut(
        id=meal.id,
        name=meal.name,
        total_calories=total,
        items=out_items,
    )


@router.get("", response_model=list[MealOut])
def list_meals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meals = (
        db.query(Meal)
        .filter(Meal.user_id == current_user.id)
        .order_by(Meal.id)
        .all()
    )
    return [build_meal_out(m) for m in meals]


@router.post("", response_model=MealOut, status_code=status.HTTP_201_CREATED)
def create_meal(
    payload: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Meal must have at least one item")

    meal = Meal(user_id=current_user.id, name=payload.name)
    db.add(meal)
    db.flush()

    for it in payload.items:
        product = db.query(Product).filter(Product.id == it.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {it.product_id} not found")

        db.add(
            MealItem(
                meal_id=meal.id,
                product_id=it.product_id,
                quantity_grams=it.quantity_grams,
            )
        )

    db.commit()
    db.refresh(meal)
    return build_meal_out(meal)


@router.post("/{meal_id}/cook")
def cook_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meal = (
        db.query(Meal)
        .filter(Meal.id == meal_id, Meal.user_id == current_user.id)
        .first()
    )
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    for it in meal.items:
        inv = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.user_id == current_user.id,
                InventoryItem.product_id == it.product_id,
            )
            .first()
        )
        if not inv:
            continue

        inv.quantity_grams = max(0.0, float(inv.quantity_grams) - float(it.quantity_grams))

    db.commit()
    return {"status": "ok"}
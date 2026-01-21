from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import InventoryItem, MealItem, MealPlan, Product, User
from app.schemas import InventoryItemOut, InventoryUpsertIn

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


def _reserved_map(db: Session, user_id: int) -> dict[int, float]:

    rows = (
        db.query(MealItem.product_id, func.sum(MealItem.quantity_grams))
        .join(MealPlan, MealPlan.meal_id == MealItem.meal_id)
        .filter(MealPlan.user_id == user_id)
        .group_by(MealItem.product_id)
        .all()
    )
    return {pid: float(total or 0.0) for pid, total in rows}


@router.get("", response_model=list[InventoryItemOut])
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reserved = _reserved_map(db, current_user.id)

    products = db.query(Product).order_by(Product.id).all()

    inv_rows = (
        db.query(InventoryItem)
        .filter(InventoryItem.user_id == current_user.id)
        .all()
    )
    stock_map = {r.product_id: float(r.quantity_grams) for r in inv_rows}

    out: list[InventoryItemOut] = []
    for p in products:
        stock = stock_map.get(p.id, 0.0)
        res = reserved.get(p.id, 0.0)
        available = stock - res
        out.append(
            InventoryItemOut(
                product_id=p.id,
                product_name=p.name,
                quantity_grams=stock,
                reserved_grams=res,
                available_grams=available,
            )
        )
    return out


@router.post("", response_model=InventoryItemOut, status_code=status.HTTP_201_CREATED)
def upsert_inventory_item(
    payload: InventoryUpsertIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.quantity_grams < 0:
        raise HTTPException(status_code=400, detail="quantity_grams must be >= 0")

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.user_id == current_user.id,
            InventoryItem.product_id == payload.product_id,
        )
        .first()
    )

    if existing:
        existing.quantity_grams = payload.quantity_grams
        db.commit()
        db.refresh(existing)
    else:
        row = InventoryItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity_grams=payload.quantity_grams,
        )
        db.add(row)
        db.commit()

    reserved = _reserved_map(db, current_user.id).get(payload.product_id, 0.0)
    available = float(payload.quantity_grams) - reserved

    return InventoryItemOut(
        product_id=product.id,
        product_name=product.name,
        quantity_grams=float(payload.quantity_grams),
        reserved_grams=reserved,
        available_grams=available,
    )

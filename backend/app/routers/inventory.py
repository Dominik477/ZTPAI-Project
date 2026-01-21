from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import InventoryItem, Product, User
from app.schemas import InventoryItemOut, InventoryUpsertIn

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.get("", response_model=list[InventoryItemOut])
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(InventoryItem)
        .filter(InventoryItem.user_id == current_user.id)
        .all()
    )

    out: list[InventoryItemOut] = []
    for r in rows:
        name = r.product.name if r.product else f"Product {r.product_id}"
        out.append(
            InventoryItemOut(
                product_id=r.product_id,
                product_name=name,
                quantity_grams=float(r.quantity_grams),
            )
        )
    out.sort(key=lambda x: x.product_id)
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
        row = existing
        code = status.HTTP_200_OK
    else:
        row = InventoryItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity_grams=payload.quantity_grams,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        code = status.HTTP_201_CREATED

    return InventoryItemOut(
        product_id=row.product_id,
        product_name=product.name,
        quantity_grams=float(row.quantity_grams),
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Meal, MealPlan, User
from app.schemas import PlanSetIn, PlanOut
from app.routers.meals import build_meal_out  

router = APIRouter(prefix="/api/planner", tags=["planner"])

DAYS = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}


@router.get("", response_model=list[PlanOut])
def get_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()

    out: list[PlanOut] = []
    for p in plans:
        meal = db.query(Meal).filter(Meal.id == p.meal_id).first()
        if not meal:
            continue
        meal_out = build_meal_out(meal)
        out.append(
          PlanOut(
            day=p.day,
            meal_id=meal.id,
            meal_name=meal.name,
            total_calories=meal_out.total_calories,
          )
        )
    order = {"mon": 1, "tue": 2, "wed": 3, "thu": 4, "fri": 5, "sat": 6, "sun": 7}
    out.sort(key=lambda x: order.get(x.day, 999))
    return out


@router.post("", response_model=PlanOut, status_code=status.HTTP_201_CREATED)
def set_plan_day(
    payload: PlanSetIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    day = payload.day.lower()
    if day not in DAYS:
        raise HTTPException(status_code=400, detail="Invalid day (use mon..sun)")

    meal = db.query(Meal).filter(Meal.id == payload.meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    existing = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id, MealPlan.day == day)
        .first()
    )

    if existing:
        existing.meal_id = meal.id
        db.commit()
        db.refresh(existing)
    else:
        mp = MealPlan(user_id=current_user.id, day=day, meal_id=meal.id)
        db.add(mp)
        db.commit()

    meal_out = build_meal_out(meal)
    return PlanOut(day=day, meal_id=meal.id, meal_name=meal.name, total_calories=meal_out.total_calories)

@router.delete("/{day}", status_code=status.HTTP_204_NO_CONTENT)
def clear_day(
    day: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    d = day.lower()
    existing = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id, MealPlan.day == d)
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
    return

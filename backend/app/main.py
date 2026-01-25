from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app import models  
from app.routers.products import router as products_router
from app.routers.auth import router as auth_router
from app.routers.meals import router as meals_router
from app.seed import seed_products
from app.routers.planner import router as planner_router
from app.routers.shopping_list import router as shopping_list_router
from app.routers.inventory import router as inventory_router
from app.routers.admin import router as admin_router
import os
from sqlalchemy import text as sql_text





app = FastAPI(title="MealPrep API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

with engine.begin() as conn:
    if engine.dialect.name == "sqlite":
        cols = conn.execute(sql_text("PRAGMA table_info(users)")).fetchall()
        if not any(c[1] == "role" for c in cols):
            conn.execute(
                sql_text(
                    "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'"
                )
            )

with SessionLocal() as db:
    seed_products(db)


app.include_router(auth_router)
app.include_router(products_router)
app.include_router(meals_router)
app.include_router(planner_router)
app.include_router(shopping_list_router)
app.include_router(inventory_router)
app.include_router(admin_router)






@app.get("/health")
def health():
    return {"status": "ok"}

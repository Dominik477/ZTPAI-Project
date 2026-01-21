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



app = FastAPI(title="MealPrep API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed_products(db)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(meals_router)
app.include_router(planner_router)
app.include_router(shopping_list_router)
app.include_router(inventory_router)





@app.get("/health")
def health():
    return {"status": "ok"}

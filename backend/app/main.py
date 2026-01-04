from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app import models  
from app.routers.products import router as products_router
from app.routers.auth import router as auth_router
from app.seed import seed_products

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


@app.get("/health")
def health():
    return {"status": "ok"}

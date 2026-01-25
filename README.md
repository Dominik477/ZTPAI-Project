# MealPrep Planner

Web app for meal planning, pantry inventory and shopping list generation.
Users create products (kcal/macros per 100g), build meals from products, plan meals for a week, track pantry stock, and generate shopping lists (needed vs in stock vs missing). Cooking a meal consumes inventory.

## Tech stack
- Backend: FastAPI, SQLAlchemy, JWT
- Frontend: React (Vite)
- DB: PostgreSQL
- Infra: Docker Compose

## Quick start (Docker)
```bash
docker compose up --build

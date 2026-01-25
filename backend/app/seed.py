from sqlalchemy.orm import Session

from app.models import Product, User
from app.auth import hash_password


def seed_products(db: Session):
    admin = db.query(User).filter(User.email == "admin@demo.com").first()
    if not admin:
        db.add(
            User(
                email="admin@demo.com",
                full_name="Admin",
                password_hash=hash_password("admin123"),
                role="admin",
            )
        )
        db.commit()

    exists = db.query(Product).first()
    if exists:
        return

    products = [
        Product(name="Ryż biały", calories_per_100g=360),
        Product(name="Makaron pełnoziarnisty", calories_per_100g=350),
        Product(name="Kasza bulgur", calories_per_100g=340),
        Product(name="Ziemniaki", calories_per_100g=77),
        Product(name="Płatki owsiane", calories_per_100g=389),
        Product(name="Pierś z kurczaka", calories_per_100g=165),
        Product(name="Pierś z indyka", calories_per_100g=135),
        Product(name="Wołowina chuda", calories_per_100g=176),
        Product(name="Łosoś świeży", calories_per_100g=208),
        Product(name="Tuńczyk w wodzie", calories_per_100g=116),
        Product(name="Jajko kurze", calories_per_100g=155),
        Product(name="Mleko 2%", calories_per_100g=50),
        Product(name="Jogurt naturalny", calories_per_100g=59),
        Product(name="Ser żółty", calories_per_100g=356),
        Product(name="Twaróg półtłusty", calories_per_100g=133),
        Product(name="Brokuł", calories_per_100g=35),
        Product(name="Marchew", calories_per_100g=41),
        Product(name="Papryka czerwona", calories_per_100g=31),
        Product(name="Pomidor", calories_per_100g=18),
        Product(name="Ogórek", calories_per_100g=16),
        Product(name="Oliwa z oliwek", calories_per_100g=884),
        Product(name="Masło", calories_per_100g=717),
        Product(name="Olej rzepakowy", calories_per_100g=884),
        Product(name="Banan", calories_per_100g=89),
        Product(name="Jabłko", calories_per_100g=52),
        Product(name="Truskawki", calories_per_100g=32),
        Product(name="Orzechy włoskie", calories_per_100g=654),
        Product(name="Migdały", calories_per_100g=579),
        Product(name="Czekolada gorzka 70%", calories_per_100g=598),
    ]

    db.add_all(products)
    db.commit()

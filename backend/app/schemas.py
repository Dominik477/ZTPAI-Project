from pydantic import BaseModel, EmailStr, constr


class ProductOut(BaseModel):
    id: int
    name: str
    calories_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    carbs_per_100g: float

    class Config:
        from_attributes = True



class ProductUpdate(BaseModel):
    name: str | None = None
    calories_per_100g: float | None = None
    protein_per_100g: float | None = None
    fat_per_100g: float | None = None
    carbs_per_100g: float | None = None




class ProductCreate(BaseModel):
    name: str
    calories_per_100g: float
    protein_per_100g: float = 0
    fat_per_100g: float = 0
    carbs_per_100g: float = 0




class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str
    password: constr(min_length=6, max_length=72)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class MealItemIn(BaseModel):
    product_id: int
    quantity_grams: float


class MealCreate(BaseModel):
    name: str
    items: list[MealItemIn]


class MealItemOut(BaseModel):
    product_id: int
    product_name: str
    quantity_grams: float
    calories: float
    protein: float
    fat: float
    carbs: float



class MealOut(BaseModel):
    id: int
    name: str
    total_calories: float
    total_protein: float
    total_fat: float
    total_carbs: float
    items: list[MealItemOut]


class PlanSetIn(BaseModel):
    day: str  
    meal_id: int


class PlanOut(BaseModel):
    day: str
    meal_id: int
    meal_name: str
    total_calories: float
    total_protein: float
    total_fat: float
    total_carbs: float




class ShoppingItemOut(BaseModel):
    product_id: int
    product_name: str
    total_needed_grams: float
    in_stock_grams: float
    missing_grams: float




class InventoryUpsertIn(BaseModel):
    product_id: int
    quantity_grams: float


class InventoryItemOut(BaseModel):
    product_id: int
    product_name: str
    quantity_grams: float
    reserved_grams: float
    available_grams: float

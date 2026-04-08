from pydantic import BaseModel
from typing import Optional, List, Any

# Auth
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Products
class Product(BaseModel):
    id: str
    name: str
    image: Optional[str] = None
    category: str
    section: str
    prices: List[dict]
    rating: Optional[float] = None
    tags: Optional[List[str]] = []

class Category(BaseModel):
    id: str
    name: str
    image: Optional[str] = None
    section: str
    tag: Optional[str] = None

# Orders
class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    qty: int
    provider: str
    section: str

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    total: float
    payment_method: str
    address: dict

class OrderResponse(BaseModel):
    id: int
    items: List[Any]
    total: float
    payment_method: str
    address: Any
    status: str
    created_at: str
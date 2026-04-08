import httpx
from typing import List

BASE_URL = "https://dummyjson.com"
USD_TO_INR = 83.5

def to_inr(usd: float) -> float:
    return round(usd * USD_TO_INR, 2)

async def search_products(query: str, limit: int = 10) -> List[dict]:
    url = f"{BASE_URL}/products/search"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url, params={"q": query, "limit": limit})
            data = r.json()
            products = []
            for p in data.get("products", []):
                products.append({
                    "id": f"dj_{p['id']}",
                    "name": p["title"],
                    "image": (p.get("images") or [None])[0],
                    "price": to_inr(p["price"]),
                    "provider": "DummyJSON",
                    "category": p.get("category", "general"),
                    "rating": p.get("rating"),
                    "inStock": p.get("stock", 1) > 0,
                })
            return products
        except Exception:
            return []

async def get_categories() -> List[dict]:
    url = f"{BASE_URL}/products/categories"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
            cats = r.json()
            return [
                {"id": c["slug"], "name": c["name"], "source": "dummyjson"}
                for c in cats
                if isinstance(c, dict)
            ]
        except Exception:
            return []

async def get_by_category(category: str, limit: int = 20) -> List[dict]:
    url = f"{BASE_URL}/products/category/{category}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url, params={"limit": limit})
            data = r.json()
            products = []
            for p in data.get("products", []):
                products.append({
                    "id": f"dj_{p['id']}",
                    "name": p["title"],
                    "image": (p.get("images") or [None])[0],
                    "price": to_inr(p["price"]),
                    "provider": "DummyJSON",
                    "category": p.get("category", category),
                    "rating": p.get("rating"),
                    "inStock": p.get("stock", 1) > 0,
                })
            return products
        except Exception:
            return []
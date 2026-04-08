import httpx
from typing import List

BASE_URL = "https://fakestoreapi.com"
USD_TO_INR = 83.5

def to_inr(usd: float) -> float:
    return round(usd * USD_TO_INR, 2)

_cache: List[dict] = []  # saves all products in memory so we don't fetch repeatedly

async def get_all() -> List[dict]:
    global _cache
    if _cache:
        return _cache
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(f"{BASE_URL}/products")
            raw = r.json()
            _cache = []
            for p in raw:
                _cache.append({
                    "id": f"fs_{p['id']}",
                    "name": p["title"],
                    "image": p.get("image"),
                    "price": to_inr(p["price"]),
                    "provider": "FakeStore",
                    "category": p.get("category", "general"),
                    "rating": p.get("rating", {}).get("rate"),
                    "inStock": True,
                })
            return _cache
        except Exception:
            return []

async def search_products(query: str) -> List[dict]:
    all_products = await get_all()
    query_lower = query.lower()
    return [
        p for p in all_products
        if query_lower in p["name"].lower() or query_lower in p["category"].lower()
    ]

async def get_by_category(category: str) -> List[dict]:
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(f"{BASE_URL}/products/category/{category}")
            raw = r.json()
            results = []
            for p in raw:
                results.append({
                    "id": f"fs_{p['id']}",
                    "name": p["title"],
                    "image": p.get("image"),
                    "price": to_inr(p["price"]),
                    "provider": "FakeStore",
                    "category": p.get("category", category),
                    "rating": p.get("rating", {}).get("rate"),
                    "inStock": True,
                })
            return results
        except Exception:
            return []
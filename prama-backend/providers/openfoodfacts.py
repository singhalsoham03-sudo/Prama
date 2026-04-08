import httpx
from typing import List, Optional

BASE_URL = "https://world.openfoodfacts.org"

PRICE_MAP = {
    "milk": 55, "bread": 45, "butter": 85, "egg": 90,
    "rice": 65, "sugar": 50, "salt": 20, "oil": 140,
    "flour": 55, "tea": 120, "coffee": 180, "juice": 95,
    "biscuit": 40, "chocolate": 80, "cheese": 220,
}

def estimate_price(name: str) -> float:
    name_lower = name.lower()
    for keyword, price in PRICE_MAP.items():
        if keyword in name_lower:
            return float(price)
    return 79.0

async def search_products(query: str, page_size: int = 10) -> List[dict]:
    url = f"{BASE_URL}/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": page_size,
        "fields": "id,product_name,image_url,categories_tags"
    }
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url, params=params)
            data = r.json()
            products = []
            for p in data.get("products", []):
                name = p.get("product_name", "").strip()
                if not name:
                    continue
                products.append({
                    "id": f"off_{p.get('id', p.get('_id', ''))}",
                    "name": name,
                    "image": p.get("image_url"),
                    "price": estimate_price(name),
                    "provider": "OpenFoodFacts",
                    "category": (p.get("categories_tags") or ["general"])[0].replace("en:", ""),
                    "inStock": True,
                })
            return products
        except Exception:
            return []

async def get_by_barcode(barcode: str) -> Optional[dict]:
    url = f"{BASE_URL}/api/v0/product/{barcode}.json"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
            data = r.json()
            p = data.get("product", {})
            name = p.get("product_name", "").strip()
            if not name:
                return None
            return {
                "id": f"off_{barcode}",
                "name": name,
                "image": p.get("image_url"),
                "price": estimate_price(name),
                "provider": "OpenFoodFacts",
                "inStock": True,
            }
        except Exception:
            return None
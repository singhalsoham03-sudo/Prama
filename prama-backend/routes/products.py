import asyncio
from fastapi import APIRouter, Query
from providers import openfoodfacts, dummyjson, fakestore

router = APIRouter()

SECTION_PROVIDERS = {
    "quick-commerce": ["openfoodfacts"],
    "e-commerce":     ["dummyjson", "fakestore"],
    "food-meals":     ["dummyjson"],
}

def merge_into_comparison(results_by_provider: dict, query: str) -> list:
    all_products = []
    for provider, products in results_by_provider.items():
        all_products.extend(products)

    if not all_products:
        return []

    groups: dict = {}
    for p in all_products:
        key = p["name"].split()[0].lower() if p["name"] else "other"
        if key not in groups:
            groups[key] = {
                "name": p["name"],
                "image": p.get("image"),
                "category": p.get("category", ""),
                "prices": [],
                "rating": p.get("rating"),
            }
        groups[key]["prices"].append({
            "provider": p["provider"],
            "price": p["price"],
            "inStock": p.get("inStock", True),
        })

    comparison = []
    for i, (key, group) in enumerate(groups.items()):
        group["prices"].sort(key=lambda x: x["price"])
        group["id"] = f"cmp_{i}_{key}"
        group["section"] = query
        comparison.append(group)

    return comparison[:20]

@router.get("/search")
async def search(q: str = Query(...), section: str = Query("e-commerce")):
    providers = SECTION_PROVIDERS.get(section, ["dummyjson", "fakestore"])
    tasks = {}

    if "openfoodfacts" in providers:
        tasks["OpenFoodFacts"] = openfoodfacts.search_products(q)
    if "dummyjson" in providers:
        tasks["DummyJSON"] = dummyjson.search_products(q)
    if "fakestore" in providers:
        tasks["FakeStore"] = fakestore.search_products(q)

    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    results_by_provider = {}
    for provider, result in zip(tasks.keys(), results):
        if isinstance(result, list):
            results_by_provider[provider] = result

    return {"results": merge_into_comparison(results_by_provider, q), "query": q, "section": section}

@router.get("/categories/{section}")
async def get_categories(section: str):
    if section == "e-commerce":
        cats = await dummyjson.get_categories()
        return {"categories": cats[:12]}
    elif section == "quick-commerce":
        return {"categories": [
            {"id": "dairy",         "name": "Dairy & Eggs",    "section": section},
            {"id": "bakery",        "name": "Breads & Bakery", "section": section},
            {"id": "beverages",     "name": "Beverages",       "section": section},
            {"id": "snacks",        "name": "Snacks",          "section": section},
            {"id": "staples",       "name": "Rice & Staples",  "section": section},
            {"id": "personal-care", "name": "Personal Care",   "section": section},
        ]}
    elif section == "food-meals":
        return {"categories": [
            {"id": "pizza",    "name": "Pizza",    "section": section},
            {"id": "burgers",  "name": "Burgers",  "section": section},
            {"id": "chinese",  "name": "Chinese",  "section": section},
            {"id": "indian",   "name": "Indian",   "section": section},
            {"id": "desserts", "name": "Desserts", "section": section},
        ]}
    return {"categories": []}

@router.get("/products/{category_id}")
async def get_products(category_id: str, section: str = Query("e-commerce")):
    if section == "quick-commerce":
        results = await openfoodfacts.search_products(category_id, page_size=15)
        return {"products": results}
    elif section == "e-commerce":
        dj = await dummyjson.get_by_category(category_id)
        fs = await fakestore.get_by_category(category_id)
        return {"products": dj + fs}
    elif section == "food-meals":
        results = await dummyjson.search_products(category_id)
        return {"products": results}
    return {"products": []}
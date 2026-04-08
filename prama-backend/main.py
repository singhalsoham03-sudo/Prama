from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import auth, products, orders

app = FastAPI(title="Pramā API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/auth",   tags=["auth"])
app.include_router(products.router, prefix="/api",        tags=["products"])
app.include_router(orders.router,   prefix="/api/orders", tags=["orders"])

@app.on_event("startup")
def startup():
    init_db()
    print("✅ Pramā backend started — DB initialized")

@app.get("/")
def root():
    return {"message": "Pramā API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import json
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models import CreateOrderRequest
from routes.auth import get_current_user_id
from typing import List

router = APIRouter()

@router.post("", status_code=201)
def create_order(body: CreateOrderRequest, user_id: int = Depends(get_current_user_id)):
    db = get_db()
    try:
        items_json = json.dumps([item.dict() for item in body.items])
        address_json = json.dumps(body.address)
        cursor = db.execute(
            "INSERT INTO orders (user_id, items, total, payment_method, address) VALUES (?, ?, ?, ?, ?)",
            (user_id, items_json, body.total, body.payment_method, address_json)
        )
        db.commit()
        order_id = cursor.lastrowid
        return {"id": order_id, "status": "placed", "message": "Yukti has placed your order!"}
    finally:
        db.close()

@router.get("", response_model=List[dict])
def get_orders(user_id: int = Depends(get_current_user_id)):
    db = get_db()
    try:
        rows = db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        ).fetchall()
        orders = []
        for row in rows:
            orders.append({
                "id": row["id"],
                "items": json.loads(row["items"]),
                "total": row["total"],
                "payment_method": row["payment_method"],
                "address": json.loads(row["address"]),
                "status": row["status"],
                "created_at": row["created_at"],
            })
        return orders
    finally:
        db.close()

@router.get("/{order_id}")
def get_order(order_id: int, user_id: int = Depends(get_current_user_id)):
    db = get_db()
    try:
        row = db.execute(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            (order_id, user_id)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        return {
            "id": row["id"],
            "items": json.loads(row["items"]),
            "total": row["total"],
            "payment_method": row["payment_method"],
            "address": json.loads(row["address"]),
            "status": row["status"],
            "created_at": row["created_at"],
        }
    finally:
        db.close()
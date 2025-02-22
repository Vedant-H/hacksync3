from fastapi import APIRouter

router = APIRouter()

@router.post("/mock_payment")
async def mock_payment():
    return {"message": "Payment successful, upgraded to premium!"}

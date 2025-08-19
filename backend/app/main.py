from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import date
from typing import List, Optional

from .models import EmployeeIn, EmployeeOut, LeaveIn, LeaveOut, LeaveAction
from .deps import settings, cors_origins
from .utils import normalize_doc, obj_id

app = FastAPI(title="Leave Management System (FastAPI + MongoDB)")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mongo connection
client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]
employees = db["employees"]
leaves = db["leaves"]


@app.get("/health")
async def health():
    return {"status": "ok"}

# ---------------- Employees ----------------
@app.post("/employees", response_model=dict)
async def add_employee(emp: EmployeeIn):
    exists = await employees.find_one({"email": emp.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email already exists")
    doc = emp.model_dump()
    # Store dates as ISO strings for simplicity (Mongo will also accept datetimes)
    doc["joining_date"] = emp.joining_date.isoformat()
    res = await employees.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Employee added"}


@app.get("/employees", response_model=List[EmployeeOut])
async def list_employees():
    out = []
    async for d in employees.find().sort("name", 1):
        out.append(normalize_doc(d))
    print(out)
    return out


@app.get("/employees/{emp_id}", response_model=EmployeeOut)
async def get_employee(emp_id: str):
    d = await employees.find_one({"_id": obj_id(emp_id)})
    if not d:
        raise HTTPException(status_code=404, detail="Employee not found")
    return normalize_doc(d)


@app.get("/employees/{emp_id}/balance", response_model=dict)
async def leave_balance(emp_id: str):
    d = await employees.find_one({"_id": obj_id(emp_id)}, {"leave_balance": 1})
    if not d:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"employee_id": emp_id, "leave_balance": d.get("leave_balance", 0)}


# ---------------- Leaves ----------------
@app.post("/leaves", response_model=dict)
async def apply_leave(req: LeaveIn):
    emp = await employees.find_one({"_id": obj_id(req.employee_id)})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Validations
    joining_date = date.fromisoformat(emp["joining_date"]) if isinstance(emp["joining_date"], str) else emp["joining_date"]
    if req.start_date < joining_date:
        raise HTTPException(status_code=400, detail="Leave before joining date not allowed")
    if req.end_date < req.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")

    days = (req.end_date - req.start_date).days + 1
    if days > int(emp.get("leave_balance", 0)):
        raise HTTPException(status_code=400, detail="Not enough leave balance")

    # Overlapping (approved only)
    overlap = await leaves.find_one({
        "employee_id": req.employee_id,
        "status": "APPROVED",
        "$or": [
            {
                "$and": [
                    {"start_date": {"$lte": req.end_date.isoformat()}},
                    {"end_date": {"$gte": req.start_date.isoformat()}},
                ]
            }
        ],
    })
    if overlap:
        raise HTTPException(status_code=400, detail="Overlapping leave request")

    doc = {
        "employee_id": req.employee_id,
        "start_date": req.start_date.isoformat(),
        "end_date": req.end_date.isoformat(),
        "status": "PENDING",
    }
    res = await leaves.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Leave applied"}


@app.get("/leaves", response_model=List[LeaveOut])
async def list_leaves(status: Optional[str] = None, employee_id: Optional[str] = None):
    q = {}
    if status:
        q["status"] = status
    if employee_id:
        q["employee_id"] = employee_id

    out = []
    async for d in leaves.find(q).sort("start_date", -1):
        out.append(normalize_doc(d))
    return out


@app.post("/leaves/{leave_id}/action", response_model=dict)
async def approve_reject_leave(leave_id: str, action: LeaveAction):
    leave = await leaves.find_one({"_id": obj_id(leave_id)})
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    if leave["status"] != "PENDING":
        raise HTTPException(status_code=400, detail="Leave already processed")

    if action.action.upper() == "APPROVE":
        days = (date.fromisoformat(leave["end_date"]) - date.fromisoformat(leave["start_date"]))
        days = days.days + 1
        await employees.update_one({"_id": obj_id(leave["employee_id"])}, {"$inc": {"leave_balance": -days}})
        await leaves.update_one({"_id": obj_id(leave_id)}, {"$set": {"status": "APPROVED"}})
    elif action.action.upper() == "REJECT":
        await leaves.update_one({"_id": obj_id(leave_id)}, {"$set": {"status": "REJECTED"}})
    else:
        raise HTTPException(status_code=400, detail="Invalid action (use APPROVE or REJECT)")

    return {"message": f"Leave {action.action.upper()}"}


@app.get("/employees/{emp_id}/leaves", response_model=List[LeaveOut])
async def leaves_for_employee(emp_id: str):
    out = []
    async for d in leaves.find({"employee_id": emp_id}).sort("start_date", -1):
        out.append(normalize_doc(d))
    return out
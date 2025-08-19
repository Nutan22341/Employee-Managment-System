from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class EmployeeIn(BaseModel):
    name: str
    email: EmailStr
    department: str
    joining_date: date
    leave_balance: int = 20

class EmployeeOut(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    department: str
    joining_date: date
    leave_balance: int

    class Config:
        populate_by_name = True

class LeaveIn(BaseModel):
    employee_id: str
    start_date: date
    end_date: date

class LeaveOut(BaseModel):
    id: str = Field(..., alias="_id")
    employee_id: str
    start_date: date
    end_date: date
    status: str

    class Config:
        populate_by_name = True

class LeaveAction(BaseModel):
    action: str  # APPROVE or REJECT
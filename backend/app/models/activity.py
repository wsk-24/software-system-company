from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.core.database import Base


class EmployeeActivity(Base):
    __tablename__ = "employee_activity"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # relation ไป employee
    employee_id = Column(String(10), ForeignKey("employees.id"), index=True)

    # activity data
    type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String(20), nullable=True)  # หรือใช้ Date ถ้าจะ strict

    # optional metadata (ถ้าจะขยายในอนาคต)
    created_at = Column(String(20), nullable=True)
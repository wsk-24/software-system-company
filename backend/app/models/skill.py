from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # relation ไป employee
    employee_id = Column(String(10), ForeignKey("employees.id"), index=True)

    # skill data
    name = Column(String(100), nullable=False)
    level = Column(Integer, nullable=False)  # 1-5
    category = Column(String(20), nullable=False)  # tech | soft | domain
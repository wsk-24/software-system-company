from sqlalchemy import Column, String, Integer, Text, ForeignKey
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(10), primary_key=True)

    firstName = Column(String(100))
    lastName = Column(String(100))
    email = Column(String(150))
    phone = Column(String(50))

    position = Column(String(150))
    departmentId = Column(String(10), ForeignKey("departments.id"))

    role = Column(String(20))
    status = Column(String(20))

    salary = Column(Integer)
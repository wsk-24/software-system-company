from sqlalchemy import Column, String, Integer, Text
from app.core.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(10), primary_key=True)
    name = Column(String(100))
    color = Column(String(20))
    budget = Column(Integer)
    description = Column(Text)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.employee import Employee

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()


@router.post("/")
def create_employee(emp: dict, db: Session = Depends(get_db)):
    new_emp = Employee(**emp)
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp


@router.get("/{emp_id}")
def get_employee(emp_id: str, db: Session = Depends(get_db)):
    return db.query(Employee).filter(Employee.id == emp_id).first()


@router.delete("/{emp_id}")
def delete_employee(emp_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    db.delete(emp)
    db.commit()
    return {"message": "deleted"}
from sqlalchemy.orm import Session
from app.models.employee import Employee


# ─────────────────────────────
# CREATE
# ─────────────────────────────
def create_employee(db: Session, data: dict):
    emp = Employee(**data)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


# ─────────────────────────────
# READ ALL
# ─────────────────────────────
def get_employees(db: Session):
    return db.query(Employee).all()


# ─────────────────────────────
# READ BY ID
# ─────────────────────────────
def get_employee(db: Session, emp_id: str):
    return db.query(Employee).filter(Employee.id == emp_id).first()


# ─────────────────────────────
# UPDATE
# ─────────────────────────────
def update_employee(db: Session, emp_id: str, data: dict):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        return None

    for key, value in data.items():
        if hasattr(emp, key):
            setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp


# ─────────────────────────────
# DELETE
# ─────────────────────────────
def delete_employee(db: Session, emp_id: str):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        return False

    db.delete(emp)
    db.commit()
    return True
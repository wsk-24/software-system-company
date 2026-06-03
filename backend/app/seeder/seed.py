from faker import Faker
from app.core.database import SessionLocal
from app.models.employee import Employee
import random

fake = Faker()

def seed_employees(n=20):
    db = SessionLocal()

    for i in range(n):
        emp = Employee(
            id=f"E{100+i}",
            firstName=fake.first_name(),
            lastName=fake.last_name(),
            email=fake.email(),
            phone=fake.phone_number(),
            position="Engineer",
            departmentId="D01",
            role=random.choice(["junior","mid","senior"]),
            status="active",
            salary=random.randint(50000, 200000)
        )

        db.add(emp)

    db.commit()
    db.close()


if __name__ == "__main__":
    seed_employees()
from fastapi import FastAPI
from app.api.routes import employee

app = FastAPI()

app.include_router(employee.router, prefix="/employees", tags=["Employees"])
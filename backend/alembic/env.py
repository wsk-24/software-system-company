from app.core.database import Base
import app.models  # 👈 สำคัญที่สุด

target_metadata = Base.metadata

print(Base.metadata.tables.keys())


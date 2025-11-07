from sqlalchemy.orm import sessionmaker 
from app.db import engine



SessionLocal = sessionmaker(autocommit=False,
                            autoflush=False,
                            bind=engine)
# Todo ese archivo realizado por douglas   
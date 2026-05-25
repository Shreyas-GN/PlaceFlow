from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.companies import router as company_router
from app.api.applications import router as application_router
from app.api.notifications import router as notification_router
from app.api.audit import router as audit_router
from app.api.search import router as search_router
from app.db.session import engine

app = FastAPI(title="PlaceFlow API")

import os

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(company_router)
app.include_router(application_router)
app.include_router(notification_router)
app.include_router(audit_router)
app.include_router(search_router)

@app.get("/")
def root():
    return {"message": "PlaceFlow API Running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {
                "database": "connected",
                "result": result.scalar()
            }
    except Exception as e:
        return {
            "database": "failed",
            "error": str(e)
        }
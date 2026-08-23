from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.detect import router as detect_router
from app.api.executions import router as executions_router
from app.api.stream import router as stream_router

from app.core.database import (
    connect_to_mongodb,
    close_mongodb_connection,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongodb()

    yield

    # Shutdown
    await close_mongodb_connection()


app = FastAPI(
    title="Autonomous Business Workflow Engine",
    description="AI-driven business workflow automation engine",
    version="0.1.0",
    lifespan=lifespan,
)


# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(auth_router)
app.include_router(detect_router)
app.include_router(executions_router)
app.include_router(stream_router)


@app.get("/")
async def root():
    return {
        "name": "Autonomous Business Workflow Engine",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }


@app.get("/health/database")
async def database_health():
    return {
        "status": "healthy",
        "database": "mongodb",
    }
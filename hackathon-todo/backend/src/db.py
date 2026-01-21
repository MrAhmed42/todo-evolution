from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlmodel import SQLModel, Session
from typing import Generator
from .config import get_settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# FIXED: Enhanced connection pooling for Neon Serverless stability
# These settings ensure that if Neon closes an idle connection,
# SQLAlchemy will automatically reconnect instead of throwing an SSL error.
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,  # Use QueuePool for better connection management
    pool_pre_ping=True,   # Checks if connection is alive before every request
    pool_recycle=300,     # Re-creates connections every 5 minutes
    pool_size=5,          # Number of connection objects to maintain
    max_overflow=10,      # Additional connections beyond pool_size
    pool_timeout=30,      # Seconds to wait before giving up on getting a connection
    echo=settings.db_echo,  # Conditionally enable SQL logging based on settings
    connect_args={
        "connect_timeout": 10,  # Timeout for establishing connections
    }
)

def create_db_and_tables():
    """Create database tables with error handling"""
    try:
        logger.info("Creating database tables...")
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

def get_session() -> Generator[Session, None, None]:
    """Get database session with error handling"""
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        raise
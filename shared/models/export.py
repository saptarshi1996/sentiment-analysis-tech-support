from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    func,
    Enum,
)
from sqlalchemy.orm import relationship

from shared.config.db import Base


# Export model representing the 'exports' table
class Export(Base):
    __tablename__ = 'exports'

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String(255), nullable=False)
    file_id = Column(String(255), nullable=False)
    status = Column(Enum(
        'pending', 'processing', 'completed', 'failed', name='export_status'
    ), default='pending')
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), onupdate=func.now(),
        nullable=False
    )
    deleted_at = Column(TIMESTAMP, nullable=True)

    # One-to-many relationship with records
    records = relationship("Record", back_populates="export")

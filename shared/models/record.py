from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    TIMESTAMP,
    func,
)
from sqlalchemy.orm import relationship

from shared.config.db import Base


class Record(Base):
    __tablename__ = 'records'

    id = Column(Integer, primary_key=True, index=True)
    sentiment = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    export_id = Column(
        Integer, ForeignKey('exports.id', ondelete='SET NULL'),
        nullable=True
    )
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), onupdate=func.now(),
        nullable=False
    )
    deleted_at = Column(TIMESTAMP, nullable=True)

    # Many-to-one relationship with exports
    export = relationship("Export", back_populates="records")

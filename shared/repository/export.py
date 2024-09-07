from sqlalchemy.orm import Session
from shared.models.export import Export
from shared.models.record import Record


def list_exports(db: Session, page: int, limit: int, file_name: str = None):
    offset = (page - 1) * limit
    query = db.query(Export)

    if file_name:
        query = query.filter(Export.file_name.like(f"%{file_name}%"))

    total = query.count()
    exports = query.offset(offset).limit(limit).all()

    return exports, total


def add_export(db: Session, file_name: str, file_id: str):
    export_new = Export(
        file_name=file_name,
        file_id=file_id
    )
    db.add(export_new)
    db.commit()
    db.refresh(export_new)
    return export_new


def get_export_by_id(db: Session, export_id: int):
    return db.query(Export).filter(Export.id == export_id).first()


def get_records_by_export_id(db: Session, export_id: int):
    return db.query(Record).filter(Record.export_id == export_id).all()

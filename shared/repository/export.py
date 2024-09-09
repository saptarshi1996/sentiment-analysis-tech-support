from sqlalchemy import desc

from shared.config.db import get_db
from shared.config.logger import logger

from shared.models.export import Export
from shared.models.record import Record


def list_exports(page: int, limit: int, file_name: str = None):
    db = get_db()

    offset = (page - 1) * limit
    query = db.query(Export).order_by(desc(Export.id))

    if file_name:
        query = query.filter(Export.file_name.like(f"%{file_name}%"))

    total = query.count()
    exports = query.offset(offset).limit(limit).all()

    db.close()

    return exports, total


def add_export(
    file_name,
    file_id,
    record_count,
    processed_count,
):
    db = get_db()

    logger.info(record_count)
    logger.info(processed_count)

    export_new = Export(
        file_name=file_name,
        file_id=file_id,
        record_count=record_count,
        processed_count=processed_count,
    )

    logger.info(export_new)

    db.add(export_new)
    db.commit()
    db.refresh(export_new)

    db.close()
    return export_new


def update_processed_count(export_id):
    db = get_db()

    export_record = db.query(Export).filter(
        Export.id == export_id
    ).first()

    logger.info(export_id)

    logger.info(f"Count: {export_record.processed_count}")
    export_record.processed_count = export_record.processed_count + 1

    db.commit()
    db.close()


def get_export_by_id(export_id: int):
    db = get_db()
    result = db.query(Export).filter(Export.id == export_id).first()
    db.close()
    return result


def get_records_by_export_id(export_id: int):
    db = get_db()
    result = db.query(Record).filter(Record.export_id == export_id).all()
    db.close()
    return result

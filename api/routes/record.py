import traceback

from fastapi import APIRouter, Query, HTTPException

from shared.config.db import get_db
from shared.config.logger import logger

from shared.models.record import Record

record_router = APIRouter(prefix="/api/record")


@record_router.get(
    '',
    tags=['Record'],
    description='List records',
)
async def list_record(
    page: int = Query(1, get=1),
    limit: int = Query(20, get=20),
    export_id: int = Query(None, description="Optional to filter record")
):
    try:
        db = get_db()

        offset = (page - 1) * limit

        query = db.query(Record)

        if export_id is not None:
            query = query.filter(Record.export_id == export_id)

        total = query.count()

        records = query.offset(offset=offset).limit(limit).all()
        has_prev = page > 1
        has_next = (page * limit) < total

        page = {
            "page": page,
            "limit": limit,
            "total": total,
            "has_prev": has_prev,
            "has_next": has_next,
            "prev_page": page - 1 if has_prev else None,
            "next_page": page + 1 if has_next else None
        }

        if not records:
            return {
                "records": [],
                "page": page
            }
        else:
            return {
                "records": records,
                "page": page
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@record_router.get(
    '/sentiment',
    tags=['Record'],
    description='Get sentiments',
)
async def sentiment():
    try:
        db = get_db()

        positive = db.query(Record).filter(
            Record.sentiment == "Positive"
        ).count()
        negative = db.query(Record).filter(
            Record.sentiment == "Negative"
        ).count()
        neutral = db.query(Record).filter(
            Record.sentiment == "Neutral"
        ).count()
        mixed = db.query(Record).filter(
            Record.sentiment == "Mixed"
        ).count()

        logger.info(f"Positive: {positive}")
        logger.info(f"Negative: {negative}")
        logger.info(f"Neutral: {neutral}")
        logger.info(f"Mixed: {mixed}")

        return {
            "positive": positive,
            "negative": negative,
            "neutral": neutral,
            "mixed": mixed
        }

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

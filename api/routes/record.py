import traceback

from fastapi import APIRouter, Query, HTTPException

from shared.config.db import get_db
from shared.config.logger import logger
from shared.repository.record import list_records, get_sentiments

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

        records, total = list_records(db, page, limit, export_id)

        has_prev = page > 1
        has_next = (page * limit) < total

        page_info = {
            "page": page,
            "limit": limit,
            "total": total,
            "has_prev": has_prev,
            "has_next": has_next,
            "prev_page": page - 1 if has_prev else None,
            "next_page": page + 1 if has_next else None
        }

        return {
            "records": records,
            "page": page_info
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

        sentiments = get_sentiments(db)

        logger.info(f"Positive: {sentiments['positive']}")
        logger.info(f"Negative: {sentiments['negative']}")
        logger.info(f"Neutral: {sentiments['neutral']}")
        logger.info(f"Mixed: {sentiments['mixed']}")

        return sentiments

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

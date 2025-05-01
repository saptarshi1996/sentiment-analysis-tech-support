import traceback

from fastapi import APIRouter, Query, HTTPException

from shared.helpers.groq import get_completion
from shared.config.logger import logger
from shared.repository.record import list_records, get_sentiments

record_router = APIRouter(prefix="/api/record")


@record_router.get(
    "",
    tags=["Record"],
    description="List records",
)
async def list_record(
    page: int = Query(1, get=1),
    limit: int = Query(20, get=20),
    export_id: int = Query(
        None, description="Optional to filter record"
    ),
    sentiment: str = Query(None),
):
    try:

        records, total = list_records(
            page,
            limit,
            export_id,
            sentiment
        )

        has_prev, has_next = page > 1, (page * limit) < total

        page_info = {
            "page": page,
            "limit": limit,
            "total": total,
            "has_prev": has_prev,
            "has_next": has_next,
            "prev_page": page - 1 if has_prev else None,
            "next_page": page + 1 if has_next else None,
        }

        return {"records": records, "page": page_info}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@record_router.get(
    "/sentiment",
    tags=["Record"],
    description="Get sentiments",
)
async def sentiment(
    export_id: int = Query(
        None, description="Optional to filter record"
    ),
):
    try:

        sentiments = get_sentiments(export_id=export_id)

        # get the sentiment values
        positive = sentiments.get('positive')
        negative = sentiments.get('negative')
        neutral = sentiments.get('neutral')
        mixed = sentiments.get('mixed')

        content_prompt = [
            "Give a summary from the count of user sentiments.",
            "This will help business by using the data.",
            f"There {positive} positive feedback.",
            f"There {negative} negative feedback.",
            f"There {neutral} neutral feedback.",
            f"There {mixed} mixed feedback.",
            "A single line without here you are looking or other.",
            "Also add how it affects the business.",
        ]

        prompt = "".join(content_prompt)
        logger.info(prompt)
        content = get_completion(content=prompt)

        return {"sentiments": sentiments, "summary": content}

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

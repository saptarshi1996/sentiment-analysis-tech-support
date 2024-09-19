import uuid
import traceback

from fastapi import (
    File,
    UploadFile,
    HTTPException,
    Query,
    APIRouter,
)

from fastapi.responses import StreamingResponse

from shared.config.logger import logger
from shared.helpers.queue import send_message
from shared.helpers.csv import read_csv, write_csv
from shared.repository.export import (
    list_exports,
    add_export,
    get_export_by_id,
    get_records_by_export_id,
)


export_router = APIRouter(prefix="/api/export")


@export_router.get(
    '',
    tags=['Export'],
    description='List exports'
)
async def list_export(
    page: int = Query(1, get=1),
    limit: int = Query(20, get=20),
    file_name: str = Query(None, description="Search by file name")
):
    try:

        exports, total = list_exports(page, limit, file_name)

        has_prev = page > 1
        has_next = (page * limit) < total

        return {
            "exports": exports,
            "page": {
                "page": page,
                "limit": limit,
                "total": total,
                "has_prev": has_prev,
                "has_next": has_next,
                "prev_page": page - 1 if has_prev else None,
                "next_page": page + 1 if has_next else None
            }
        }
    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@export_router.post(
    "",
    tags=['Export'],
    description='Upload feedback CSV'
)
async def post_export(file: UploadFile = File(...)):
    try:

        if file.content_type != 'text/csv':
            raise HTTPException(status_code=400, detail='Invalid file type.')

        file_content = await file.read()
        rows = read_csv(file_content)

        # Used for testing with smaller data
        # rows = rows[:15]

        file_id = str(uuid.uuid4())
        logger.info(file_id)

        record_count = len(rows)
        logger.info(record_count)

        export_new = add_export(
            file.filename,
            file_id,
            record_count=record_count,
            processed_count=0
        )

        # send message to consumer.
        send_message(
            queue_name='GET_SENTIMENT',
            rows=rows,
            export_new=export_new,
        )

        response_message = [
            "Analysing sentiments. ",
            "Download export from the table."
        ]

        return {
            "message": "".join(response_message)
        }
    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@export_router.get(
    '/{export_id}/count',
    tags=['Export'],
    description='Check count of processed files.'
)
async def check_count(export_id: int):
    try:

        export = get_export_by_id(export_id)

        record_count = export.record_count
        processed_count = export.processed_count

        if record_count == processed_count:
            message = "All records have been proceessed. Downloading export."
            return {
                "message": message
            }
        else:
            count = "All records have not been processed."
            message = "Downloading partial export."

            return {
                "message": count + message,
            }

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@export_router.get(
    '/{export_id}/csv',
    tags=['Export'],
    description='Download CSV by export id'
)
async def export_csv(export_id: int):
    try:

        export = get_export_by_id(export_id)

        if not export:
            raise HTTPException(status_code=404, detail="Export not found")

        records = get_records_by_export_id(export_id)

        logger.info(records)

        if not records:
            raise HTTPException(status_code=404, detail='Records not found')

        header = ['ID', 'Sentiment', 'Summary']
        output = write_csv([{
            'ID': record.id,
            'Sentiment': record.sentiment,
            'Summary': record.summary,
        } for record in records], header)

        file_name = f"records_{export_id}.csv"

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={file_name}"
            }
        )

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

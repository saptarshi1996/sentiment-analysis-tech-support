import csv
import io
import uuid
import json
import traceback

from fastapi import (
    File,
    UploadFile,
    HTTPException,
    Query,
    APIRouter,
)

from fastapi.responses import (
    StreamingResponse,
)

from shared.config.logger import logger
from shared.config.db import get_db
from shared.models.export import Export
from shared.models.record import Record
from shared.helpers.queue import send_message

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
        db = get_db()

        offset = (page - 1) * limit

        query = db.query(Export)

        if file_name:
            query = query.filter(Export.file_name.like(f"%{file_name}%"))

        total = query.count()

        query = query.offset(offset).limit(limit)

        exports = query.all()

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

        db = get_db()

        if file.content_type != 'text/csv':
            raise HTTPException(status_code=400, detail='Invalid file type.')

        contents = await file.read()
        content_decoded = contents.decode()

        csv_reader = csv.reader(io.StringIO(content_decoded))

        rows = []

        file_id = str(uuid.uuid4())
        logger.info(file_id)

        export_new = Export(
            file_name=file.filename,
            file_id=file_id
        )

        logger.info(export_new)
        db.add(export_new)
        db.commit()

        headers = next(csv_reader)
        for row in csv_reader:
            rows.append(dict(zip(headers, row)))

        rows = rows[:5]

        first, last = 0, len(rows) - 1

        for idx, row in enumerate(rows):
            body = row['body'] if 'body' in row else ''

            payload = {
                "export_id": export_new.id,
                "text_body": body,
            }

            if idx == first:
                payload['is_first'] = 1
            if idx == last:
                payload['is_last'] = 1

            json_payload = json.dumps(payload)
            logger.info(json_payload)

            # send message to consumer.
            send_message(
                queue_name='GET_SENTIMENT',
                payload=json_payload,
            )

        response_message = [
            "Analysing sentiments. ",
            "Keep checking the status of the records and exports."
        ]

        return {
            "message": "".join(response_message)
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
        db = get_db()

        export = db.query(Export).filter(Export.id == export_id).first()

        if not export:
            raise HTTPException(status_code=404, detail="Export not found")

        if export and export.status != "completed":
            return {"message": f"Export status: {export.status}"}

        records = db.query(Record).filter(Record.export_id == export_id).all()

        logger.info(records)

        if not records:
            raise HTTPException(status_code=404, detail='Records not found')

        output = io.StringIO()
        csv_writer = csv.writer(output)

        # Create the header of the export.
        csv_writer.writerow(['ID', 'Sentiment', 'Summary'])

        for record in records:
            csv_writer.writerow([record.id, record.sentiment, record.summary])

        output.seek(0)

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

import json
import traceback

from shared.helpers.groq import get_completion

from shared.config.logger import logger
from shared.config.constants import PROMPT
from shared.config.db import get_db

from shared.models.record import Record
from shared.models.export import Export


def get_sentiment(ch, method, properties, body):
    try:

        db = get_db()

        message = json.loads(body.decode('utf-8'))

        text_body = message.get('text_body', None)
        export_id = message.get('export_id', None)

        is_first = message.get('is_first', None)
        is_last = message.get('is_last', None)

        logger.info(is_first)
        logger.info(is_last)

        PROMPT_STR = "".join(PROMPT)
        prompt = PROMPT_STR + "" + text_body

        sentiment, summary = get_completion(content=prompt)

        logger.info(sentiment)
        logger.info(summary)

        # Storing the summary in DB for all sentiments for future use.
        # Can be hidden in UI.
        new_record = Record(
            sentiment=sentiment,
            summary=summary,
            export_id=export_id,
        )

        db.add(new_record)
        db.commit()

        # if first record, set status to processing
        # if last record, set status to completed
        if is_first == 1 or is_last == 1:
            export_record = db.query(Export).filter(
                Export.id == export_id
            ).first()
            if is_first == 1:
                export_record.status = 'processing'
                db.commit()
            if is_last == 1:
                export_record.status = 'completed'
                db.commit()

            logger.info('Export updated')

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())

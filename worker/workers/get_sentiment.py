import json
import traceback

from shared.helpers.groq import get_completion

from shared.config.logger import logger
from shared.config.constants import PROMPT

from shared.repository.record import create_record
from shared.repository.export import (
    update_processed_count,
)


def get_sentiment(ch, method, properties, body):
    try:

        message = json.loads(body.decode('utf-8'))

        text_body = message.get('text_body', None)
        export_id = message.get('export_id', None)

        PROMPT_STR = "".join(PROMPT)
        prompt = PROMPT_STR + "" + text_body

        content = get_completion(content=prompt)

        json_content = json.loads(content)

        sentiment: str = json_content['sentiment']
        summary: str = json_content['summary']

        logger.info(sentiment)
        logger.info(summary)

        # Storing the summary in DB for all sentiments for future use.
        # Can be hidden in UI.
        if sentiment:
            create_record(sentiment, summary, export_id)

            # if first record, set status to processing
            # if last record, set status to completed
            update_processed_count(export_id)

            logger.info('Export updated')

    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())

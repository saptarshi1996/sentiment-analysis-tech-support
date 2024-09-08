import json
import traceback

import requests

from shared.helpers.groq import get_completion

from shared.config.environment import SOCKET_URL

from shared.config.logger import logger
from shared.config.constants import PROMPT

from shared.repository.record import create_record
from shared.repository.export import (
    update_processed_count,
    get_export_by_id,
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
            export_result = get_export_by_id(export_id)

            if export_result.processed_count == 1:
                try:
                    message = 'File export started successfully.'
                    notify_url = f"{SOCKET_URL}/notify?trigger=NOTIFICATION"
                    requests.get(
                        f"{notify_url}&message={message}"
                    )
                except Exception as api_error:
                    logger.error(api_error)
                    logger.error('Failed')

            if export_result.processed_count == export_result.record_count:
                try:
                    message = 'File export completed successfully.'
                    notify_url = f"{SOCKET_URL}/notify?trigger=NOTIFICATION"
                    requests.get(
                        f"{notify_url}&message={message}"
                    )
                except Exception as api_error:
                    logger.error(api_error)
                    logger.error('Failed')

            try:
                requests.get(
                    f"{SOCKET_URL}/notify?trigger=REFETCH"
                )

            except Exception as api_error:
                logger.error(api_error)
                logger.error('Failed')

            logger.info('Export updated')

    except Exception as e:
        try:
            message = 'Something went wrong with this item.'
            notify_url = f"{SOCKET_URL}/notify?trigger=NOTIFICATION"
            requests.get(
                f"{notify_url}&message={message}"
            )
        except Exception as api_error:
            logger.error(api_error)
            logger.error('Failed')

        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())

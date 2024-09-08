import pika
import json

from shared.config.logger import logger
from shared.config.constants import (
    QUEUE
)
from shared.config.environment import (
    RABBITMQ_HOST,
    RABBITMQ_PORT
)


def send_message(queue_name: str, rows, export_new):
    if queue_name not in QUEUE:
        return

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            heartbeat=60,
        )
    )

    channel = connection.channel()

    queue_name = QUEUE[queue_name]

    for idx, row in enumerate(rows):
        logger.info(idx)
        body = row.get('body', '')

        payload = {
            "export_id": export_new.id,
            "text_body": body,
        }

        json_payload = json.dumps(payload)
        logger.info(json_payload)

        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=json_payload,
            properties=pika.BasicProperties(
                delivery_mode=2,
            )
        )

    channel.close()
    connection.close()


def check_rabbitmq_health():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=RABBITMQ_HOST,
                port=RABBITMQ_PORT,
                heartbeat=60,
            )
        )
        channel = connection.channel()
        channel.close()
        connection.close()
        return True
    except Exception as e:
        logger.error(f"RabbitMQ health check failed: {e}")
        return False

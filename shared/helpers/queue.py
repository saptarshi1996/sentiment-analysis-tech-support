import pika

from shared.config.constants import (
    QUEUE
)
from shared.config.producer import (
    channel
)


def send_message(queue_name: str, payload: str):

    if queue_name not in QUEUE:
        return

    queue_name = QUEUE[queue_name]

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=payload,
        properties=pika.BasicProperties(
            delivery_mode=2,
        )
    )

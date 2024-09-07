import pika

from shared.config.environment import (
    RABBITMQ_HOST,
    RABBITMQ_PORT,
)

from shared.config.constants import (
    QUEUE
)

queue_name = QUEUE['PROCESS_RECORDS']

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
    )
)
channel = connection.channel()
channel.queue_declare(queue=queue_name, durable=True)

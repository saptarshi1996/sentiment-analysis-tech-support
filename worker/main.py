import pika
import threading

from fastapi import FastAPI, APIRouter

from shared.config.environment import (
    RABBITMQ_HOST,
    RABBITMQ_PORT,
)

from shared.config.logger import logger
from shared.config.constants import QUEUE

from worker.workers.read_export import get_sentiment


app = FastAPI()

router = APIRouter()


# RabbitMQ connection URL
queue_name = QUEUE["GET_SENTIMENT"]
PREFETCH_COUNT = 1


def consume_messages():
    # Establish RabbitMQ connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
    ))
    channel = connection.channel()
    channel.basic_qos(prefetch_count=PREFETCH_COUNT)

    # Declare the queue
    channel.queue_declare(queue=queue_name, durable=True)

    # Set up subscription
    channel.basic_consume(
        queue=queue_name,
        on_message_callback=get_sentiment,
        auto_ack=True,
    )
    logger.info('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


# Start the RabbitMQ consumer in a separate thread
thread = threading.Thread(target=consume_messages)
thread.start()


@router.get("/")
async def root():
    return {'message': 'Worker Server Running'}


app.include_router(router)

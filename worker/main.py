import pika
import threading
import time
from fastapi import FastAPI, APIRouter
from shared.config.environment import RABBITMQ_HOST, RABBITMQ_PORT
from shared.config.logger import logger
from shared.config.constants import QUEUE
from worker.workers.get_sentiment import get_sentiment

app = FastAPI()
router = APIRouter()

# RabbitMQ connection and queue configuration
queue_name = QUEUE["GET_SENTIMENT"]
PREFETCH_COUNT = 1
RECONNECT_DELAY = 5  # Delay in seconds before retrying connection


def consume_messages():
    """Continuously consume messages from RabbitMQ with auto-reconnect."""
    while True:
        try:
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

        except pika.exceptions.AMQPConnectionError as e:
            logger.error(
                f"Connection error: {e}. Reconnecting in {RECONNECT_DELAY} ..."
            )
            time.sleep(RECONNECT_DELAY)

        except Exception as e:
            logger.error(f"An error occurred: {e}. Restarting the consumer...")
            time.sleep(RECONNECT_DELAY)

        finally:
            try:
                # Attempt to close the connection cleanly
                if connection.is_open:
                    connection.close()
            except Exception as e:
                logger.error(f"Error closing connection: {e}")


# Start the RabbitMQ consumer in a separate thread
thread = threading.Thread(target=consume_messages, daemon=True)
thread.start()


@router.get("/")
async def root():
    return {'message': 'Worker Server Running'}


app.include_router(router)

import pika
import time
import threading

from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException
)

from shared.config.environment import (
    RABBITMQ_HOST,
    RABBITMQ_PORT
)
from shared.config.logger import logger
from shared.config.constants import QUEUE
from shared.helpers.queue import check_rabbitmq_health

from worker.workers.get_sentiment import get_sentiment

HEARTBEAT = 60
PREFETCH_COUNT = 1
RECONNECT_DELAY = 5

queue_name = QUEUE["GET_SENTIMENT"]

app = FastAPI()
router = APIRouter()


# Consume incoming messages
def consume_messages():
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    port=RABBITMQ_PORT,
                    heartbeat=HEARTBEAT,
                )
            )
            channel = connection.channel()
            channel.basic_qos(prefetch_count=PREFETCH_COUNT)

            channel.queue_declare(queue=queue_name, durable=True)

            channel.basic_consume(
                queue=queue_name,
                on_message_callback=get_sentiment,
                auto_ack=True,
            )

            logger.info("Waiting for messages. To exit press CTRL+C")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError as e:
            logger.error(
                f"Connection error: {e}. Reconnecting in {RECONNECT_DELAY} ..."
            )
            time.sleep(RECONNECT_DELAY)

        except Exception as e:
            logger.error(
                f"An error occurred: {e}. Restarting the consumer..."
            )
            time.sleep(RECONNECT_DELAY)

        finally:
            try:
                if connection.is_open:
                    connection.close()
            except Exception as e:
                logger.error(f"Error closing connection: {e}")


@router.get("/api/healthcheck")
def health_check():
    rabbitmq_status = check_rabbitmq_health()
    if not rabbitmq_status:
        raise HTTPException(status_code=503, detail="Failed")
    return {"status": "ok"}


@router.get("/")
async def root():
    return {"message": "Worker Server Running"}


app.include_router(router)

# Run Worker
thread = threading.Thread(target=consume_messages, daemon=True)
thread.start()

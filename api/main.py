from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware

from shared.helpers.queue import (
    check_rabbitmq_health
)

from api.routes.export import export_router
from api.routes.record import record_router


app = FastAPI(
    title="Sentiment Analysis and Export",
    description="Perform sentiment analysis of customer feedback",
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/api/healthcheck', tags=["Health"], description="Health check")
def health_check():
    rabbitmq_status = check_rabbitmq_health()
    if not rabbitmq_status:
        raise HTTPException(status_code=503, detail="Failed")
    return {"status": "ok"}


app.include_router(export_router)
app.include_router(record_router)

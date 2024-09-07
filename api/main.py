from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware


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

app.include_router(export_router)
app.include_router(record_router)

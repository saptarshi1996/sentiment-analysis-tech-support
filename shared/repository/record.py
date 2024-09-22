from shared.config.db import get_db

from shared.models.record import Record


def create_record(sentiment, summary, export_id):
    db = get_db()

    new_record = Record(
        sentiment=sentiment,
        summary=summary,
        export_id=export_id,
    )

    db.add(new_record)
    db.commit()
    db.close()


def list_records(
    page: int,
    limit: int,
    export_id: int = None,
    sentiment: str = None,
):
    db = get_db()

    offset = (page - 1) * limit

    query = db.query(Record)

    if export_id is not None:
        query = query.filter(Record.export_id == export_id)

    if sentiment is not None:
        query = query.filter(Record.sentiment == sentiment)

    total = query.count()
    records = query.offset(offset).limit(limit).all()

    db.close()

    return records, total


def get_sentiments(export_id):
    db = get_db()

    if export_id is not None:
        query = db.query(Record).filter(Record.export_id == export_id)
    else:
        query = db.query(Record)

    # Get all responses.
    positive = query.filter(Record.sentiment == "Positive").count()
    negative = query.filter(Record.sentiment == "Negative").count()
    neutral = query.filter(Record.sentiment == "Neutral").count()
    mixed = query.filter(Record.sentiment == "Mixed").count()

    db.close()

    return {
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "mixed": mixed
    }

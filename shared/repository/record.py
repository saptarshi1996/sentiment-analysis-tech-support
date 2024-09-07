from shared.models.record import Record


def list_records(db, page: int, limit: int, export_id: int = None):
    offset = (page - 1) * limit

    query = db.query(Record)

    if export_id is not None:
        query = query.filter(Record.export_id == export_id)

    total = query.count()
    records = query.offset(offset).limit(limit).all()

    return records, total


def get_sentiments(db):
    positive = db.query(Record).filter(Record.sentiment == "Positive").count()
    negative = db.query(Record).filter(Record.sentiment == "Negative").count()
    neutral = db.query(Record).filter(Record.sentiment == "Neutral").count()
    mixed = db.query(Record).filter(Record.sentiment == "Mixed").count()

    return {
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "mixed": mixed
    }

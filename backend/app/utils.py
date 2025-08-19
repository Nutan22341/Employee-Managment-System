from bson import ObjectId
from datetime import date, datetime

# Convert Mongo ObjectId to string and ensure ISO dates

def normalize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    d = {**doc}
    _id = d.pop("_id", None)
    if isinstance(_id, ObjectId):
        d["_id"] = str(_id)
    # Normalize date fields that might be stored as datetime/date/str
    for k in ("joining_date", "start_date", "end_date"):
        if k in d:
            v = d[k]
            if isinstance(v, datetime):
                d[k] = v.date().isoformat()
            elif isinstance(v, date):
                d[k] = v.isoformat()
    return d


def obj_id(oid: str) -> ObjectId:
    return ObjectId(oid)
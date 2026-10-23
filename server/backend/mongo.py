# backend/mongo.py
import logging
from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError, ConfigurationError
from django.conf import settings

logger = logging.getLogger(__name__)

_client = None

def get_mongo_client():
    """Returns a cached MongoClient instance with reasonable timeouts."""
    global _client
    if _client is None:
        uri = getattr(settings, "MONGO_URI", "")
        if not uri:
            # Fallback to local MongoDB
            uri = "mongodb://localhost:27017"
            logger.warning("MONGODB_URI not set. Falling back to mongodb://localhost:27017")
        _client = MongoClient(
            uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=5000,
        )
    return _client

def get_db():
    client = get_mongo_client()
    db_name = getattr(settings, "MONGO_DB_NAME", "decision_iq_db") or "decision_iq_db"
    return client[db_name]

class LazyCollection:
    """Lazily proxies calls to the MongoDB collection to avoid connection attempts during import."""
    def __init__(self, collection_name):
        self.collection_name = collection_name

    def _get_collection(self):
        return get_db()[self.collection_name]

    def __getattr__(self, name):
        if name.startswith("_"):
            raise AttributeError(name)
        return getattr(self._get_collection(), name)

    def __getitem__(self, item):
        return self._get_collection()[item]

decisions_collection = LazyCollection("decisions")

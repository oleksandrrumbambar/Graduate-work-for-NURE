# model_train.py

import os
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest
from joblib import dump
from config import (
    MONGO_URI,
    MONGO_DB,
    MONGO_REVIEW_COLLECTION,
    TFIDF_MODEL_PATH,
    IFOREST_MODEL_PATH,
)

def load_reviews_from_mongo(min_length: int = 10):
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    collection = db[MONGO_REVIEW_COLLECTION]

    cursor = collection.find({}, {"review_text": 1})
    texts = []
    for doc in cursor:
        text = doc.get("review_text", "")
        if not text:
            continue
        text = str(text).strip()
        if len(text) < min_length:
            continue
        texts.append(text)

    client.close()
    return texts

def train_models():
    print("Завантажую відгуки з MongoDB...")
    texts = load_reviews_from_mongo()

    if not texts:
        print("Не знайдено достатньо відгуків для навчання.")
        return

    print(f"Знайдено {len(texts)} відгуків. Навчаю TF-IDF...")
    tfidf = TfidfVectorizer(max_features=5000) 
    X = tfidf.fit_transform(texts)

    print("Навчаю IsolationForest...")
    iforest = IsolationForest(
        n_estimators=200,
        contamination=0.1, 
        random_state=42,
        n_jobs=-1,
    )
    iforest.fit(X)

    os.makedirs(os.path.dirname(TFIDF_MODEL_PATH), exist_ok=True)
    dump(tfidf, TFIDF_MODEL_PATH)
    dump(iforest, IFOREST_MODEL_PATH)

    print("Моделі збережено:")
    print(f"  TF-IDF → {TFIDF_MODEL_PATH}")
    print(f"  IsolationForest → {IFOREST_MODEL_PATH}")

if __name__ == "__main__":
    train_models()

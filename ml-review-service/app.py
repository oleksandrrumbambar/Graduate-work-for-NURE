# app.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from joblib import load
from config import (
    TFIDF_MODEL_PATH,
    IFOREST_MODEL_PATH,
    FRAUD_THRESHOLD,
)

import numpy as np
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification


app = FastAPI()

tfidf = None
iforest = None
tokenizer = None
sentiment_model = None

SENTIMENT_MODEL = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
SENTIMENT_LABELS = ["negative", "neutral", "positive"]


class ReviewInput(BaseModel):
    review_text: str
    rating: Optional[int] = None
    user_id: Optional[str] = None
    game_id: Optional[str] = None

class ReviewAnalysis(BaseModel):
    fraud_score: float
    is_suspicious: bool
    sentiment: str
    sentiment_score: float


@app.on_event("startup")
def load_models():
    global tfidf, iforest, tokenizer, sentiment_model

    tfidf = load(TFIDF_MODEL_PATH)
    iforest = load(IFOREST_MODEL_PATH)
    print("TF-IDF та IsolationForest завантажено.")

    tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL)
    sentiment_model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL)
    print("Sentiment-модель RoBERTa завантажено.")

def compute_fraud_score(text: str) -> (float, bool):
    X = tfidf.transform([text])
    score = iforest.decision_function(X)[0]  

    raw = -score
    fraud_score = float(1 / (1 + np.exp(-raw)))

    is_suspicious = score < FRAUD_THRESHOLD
    return fraud_score, is_suspicious


def compute_sentiment(text: str):
    encoded = tokenizer(
        text,
        return_tensors="pt",
        truncation=False,    
        padding=False
    )

    input_ids = encoded["input_ids"][0]
    total_tokens = input_ids.size(0)

    chunk_size = 512
    chunks = (total_tokens + chunk_size - 1) // chunk_size

    sentiment_scores = []
    sentiment_labels = []

    for i in range(chunks):
        start = i * chunk_size
        end = min(start + chunk_size, total_tokens)

        chunk_ids = input_ids[start:end].unsqueeze(0)

        chunk_encoded = {
            "input_ids": chunk_ids,
            "attention_mask": torch.ones_like(chunk_ids)
        }

        chunk_encoded.pop("token_type_ids", None)

        with torch.no_grad():
            output = sentiment_model(**chunk_encoded)
            scores = F.softmax(output.logits, dim=1)[0].tolist()

        idx = int(np.argmax(scores))
        sentiment_labels.append(SENTIMENT_LABELS[idx])
        sentiment_scores.append(scores[idx])

    avg_score = float(np.mean(sentiment_scores))

    from collections import Counter
    final_label = Counter(sentiment_labels).most_common(1)[0][0]

    return final_label, avg_score

@app.post("/analyse_review", response_model=ReviewAnalysis)
def analyse_review(review: ReviewInput):
    text = review.review_text.strip()

    if not text:
        return ReviewAnalysis(
            fraud_score=1.0,
            is_suspicious=True,
            sentiment="neutral",
            sentiment_score=0.5,
        )

    fraud_score, is_suspicious = compute_fraud_score(text)
    sentiment_label, sentiment_score = compute_sentiment(text)

    return ReviewAnalysis(
        fraud_score=fraud_score,
        is_suspicious=is_suspicious,
        sentiment=sentiment_label,
        sentiment_score=sentiment_score,
    )

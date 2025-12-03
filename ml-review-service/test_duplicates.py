# test_duplicates.py

import requests
import time
import random

URL = "http://localhost:8090/review"
GAME_ID = "66629e219ef35252d2bf76eb"

USER_IDS = [
    "7410568f-01d9-45b5-96a9-cf96c7cf06e8",
    "f917b76e-5822-41bb-9c88-6b72f5ccfa8d",
    "aa8cfad8-32ae-47c0-8b78-976729034e53",
    "6a734d95-cc82-43a0-9cdc-3ee8fbe84657",
    "aa8cfad8-19ae-32c0-8b73-976729034e53",
]

NEGATIVE_TEXTS = [
    "Гра повний шлак. Взагалі не recommend.",
    "Це просто жахлива гра, не раджу нікому.",
    "Гра не варта своїх грошей. Суцільний шлак.",
    "Дуже погана оптимізація, не рекомендую.",
    "НАЙГІРШИЙ досвід за довгий час. Жахлива гра.",
    "Гра вкрай погана, купувати не треба.",
]

POSITIVE_TEXTS = [
    "Гра супер, дуже рекомендую!",
    "Класна гра, багато задоволення!",
    "Дуже крута гра, 5/5, рекомендую!",
    "Шедевр! Просто топ.",
    "Сильний сюжет і крутий геймплей.",
]

def send_review(i, user_id, text, rating, label):
    payload = {
        "user_id": user_id,
        "game_id": GAME_ID,
        "review_text": text,
        "rating": rating,
    }

    print(f"[{i}/12] Sending {label} review by {user_id[:6]}...")

    resp = requests.post(URL, json=payload)

    try:
        print(" → Response:", resp.status_code, resp.text[:150], "\n")
    except:
        print(" → Response decode error\n")


def main():
    print("\n=== TEST: 5 NEGATIVE → then 7 mixed (exactly 2 positive) ===\n")

    # === PHASE 1: перші 5 обов'язково негативні ===
    print("=== PHASE 1: 5 NEGATIVE ===\n")

    for i in range(1, 6):
        send_review(
            i,
            random.choice(USER_IDS),
            random.choice(NEGATIVE_TEXTS),
            rating=5,
            label="NEGATIVE"
        )
        time.sleep(random.randint(5, 10))

    print("\n=== PHASE 2: 7 REVIEWS (2 POSITIVE, 5 NEGATIVE) ===\n")

    mixed_reviews = (
        ["POS"] * 2 + ["NEG"] * 5
    )
    random.shuffle(mixed_reviews)

    for i, review_type in enumerate(mixed_reviews, start=6):

        if review_type == "POS":
            text = random.choice(POSITIVE_TEXTS)
            rating = 90
            label = "POSITIVE"
        else:
            text = random.choice(NEGATIVE_TEXTS)
            rating = 10
            label = "NEGATIVE"

        send_review(
            i,
            random.choice(USER_IDS),
            text,
            rating,
            label
        )

        time.sleep(random.randint(5, 10))

    print("\nDONE!\n")
    print("→ NEGATIVE reviews after #5 should be flagged as anomaly")
    print("→ POSITIVE reviews should NOT be flagged\n")


if __name__ == "__main__":
    main()

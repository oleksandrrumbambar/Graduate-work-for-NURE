# test_duplicates.py

import requests
import uuid
import time

URL = "http://localhost:8090/review"

COMMENT_TEXT = "Гра повний шлак. Взагалі не recommend."
GAME_ID = "66629e219ef35252d2bf76eb"   # твій GameID
USER_ID = "7410568f-01d9-45b5-96a9-cf96c7cf06e8"  # той самий user
BASE_RATING = 10  # негативний

def send_review(i):
    payload = {
        "user_id": USER_ID,
        "game_id": GAME_ID,
        "review_text": COMMENT_TEXT,
        "rating": BASE_RATING
    }

    print(f"Sending review #{i+1}...")
    resp = requests.post(URL, json=payload)

    try:
        print("Response:", resp.status_code, resp.text)
    except:
        print("Response decode error")

def main():
    print("=== Sending 6 duplicate reviews through API ===\n")

    for i in range(6):
        send_review(i)
        time.sleep(0.5)  # невелика пауза, щоб встигали інсерти

    print("\nDONE. Check MongoDB or frontend for duplicate detection.")

if __name__ == "__main__":
    main()

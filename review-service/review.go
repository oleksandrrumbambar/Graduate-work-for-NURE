package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"time"
	"strings"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var reviewCollection *mongo.Collection
var libraryCollection *mongo.Collection

func connectToMongoDB() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://sashapena1337:BmRKBfE83jJMfcau@users.bi8zdnp.mongodb.net/?retryWrites=true&w=majority&appName=Users"))
	if err != nil {
		fmt.Println("Error creating MongoDB client:", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		fmt.Println("Error connecting to MongoDB:", err)
		return
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		fmt.Println("Error pinging MongoDB:", err)
		return
	}

	fmt.Println("Connected to MongoDB successfully")

	reviewCollection = client.Database("Games").Collection("Review")
	libraryCollection = client.Database("Users").Collection("Library")
}


type MLAnalysis struct {
	Sentiment        string  `bson:"sentiment" json:"sentiment"`
	SentimentScore   float64 `bson:"sentiment_score" json:"sentiment_score"`
	FraudScore       float64 `bson:"fraud_score" json:"fraud_score"`
	IsSuspicious     bool    `bson:"is_suspicious" json:"is_suspicious"`
	IsDuplicate      bool    `bson:"is_duplicate" json:"is_duplicate"`
	DuplicateSim     float64 `bson:"duplicate_similarity" json:"duplicate_similarity"`
	TemporalAnomaly  bool    `bson:"is_temporal_anomaly" json:"is_temporal_anomaly"`
	TemporalReason   string  `bson:"temporal_reason" json:"temporal_reason"`
}

type Review struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID     string             `bson:"user_id" json:"user_id"`
	GameID     string             `bson:"game_id" json:"game_id"`
	ReviewText string             `bson:"review_text" json:"review_text"`
	Rating     int                `bson:"rating" json:"rating"`

	// NEW FIELDS
	CreatedAt time.Time  `bson:"created_at" json:"created_at"`
	ML        MLAnalysis `bson:"ml_analysis" json:"ml_analysis"`
}


type MLRequest struct {
	ReviewText string `json:"review_text"`
	Rating     int    `json:"rating"`
	UserID     string `json:"user_id"`
	GameID     string `json:"game_id"`
}

type MLResponse struct {
	FraudScore     float64 `json:"fraud_score"`
	IsSuspicious   bool    `json:"is_suspicious"`
	Sentiment      string  `json:"sentiment"`
	SentimentScore float64 `json:"sentiment_score"`
}

func callMLService(text string, rating int, userID, gameID string) (*MLResponse, error) {
	body, _ := json.Marshal(MLRequest{
		ReviewText: text, Rating: rating, UserID: userID, GameID: gameID,
	})

	resp, err := http.Post("http://localhost:9001/analyse_review", "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)

	var result MLResponse
	json.Unmarshal(respBody, &result)

	return &result, nil
}



func cosineSimilarity(a, b []float64) float64 {
	var dot, normA, normB float64
	for i := range a {
		dot += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}
	if normA == 0 || normB == 0 {
		return 0
	}
	return dot / (math.Sqrt(normA) * math.Sqrt(normB))
}

func computeTFIDFVectors(texts []string) ([][]float64, []string) {
	tokenize := func(s string) []string {
		s = strings.ToLower(s)
		s = strings.ReplaceAll(s, ".", " ")
		s = strings.ReplaceAll(s, ",", " ")
		s = strings.ReplaceAll(s, "!", " ")
		s = strings.ReplaceAll(s, "?", " ")
		return strings.Fields(s)
	}

	vocabSet := map[string]struct{}{}
	tokenized := [][]string{}

	for _, txt := range texts {
		toks := tokenize(txt)
		tokenized = append(tokenized, toks)
		for _, t := range toks {
			vocabSet[t] = struct{}{}
		}
	}

	// Vocabulary slice
	vocab := make([]string, 0, len(vocabSet))
	for t := range vocabSet {
		vocab = append(vocab, t)
	}

	df := make([]int, len(vocab))

	for i, word := range vocab {
		for _, toks := range tokenized {
			for _, t := range toks {
				if t == word {
					df[i]++
					break
				}
			}
		}
	}

	N := float64(len(texts))

	vectors := make([][]float64, len(texts))

	for i, toks := range tokenized {
		vec := make([]float64, len(vocab))

		// Count TF
		tf := map[string]float64{}
		for _, t := range toks {
			tf[t]++
		}

		for j, word := range vocab {
			// TF
			tfreq := tf[word] / float64(len(toks))

			// IDF
			idf := math.Log((N + 1) / (float64(df[j]) + 1))

			vec[j] = tfreq * idf
		}

		vectors[i] = vec
	}

	return vectors, vocab
}


func detectDuplicate(newText string, oldTexts []string) (float64, bool) {
	texts := append([]string{newText}, oldTexts...)

	vectors, _ := computeTFIDFVectors(texts)

	target := vectors[0]
	maxSim := 0.0

	for i := 1; i < len(vectors); i++ {
		sim := cosineSimilarity(target, vectors[i])
		if sim > maxSim {
			maxSim = sim
		}
	}

	return maxSim, maxSim > 0.85
}

var negativeStreak = make(map[string]int) 
var positiveStreak = make(map[string]int)

func detectTemporalAnomaly(gameID, newSent string) (bool, string) {

    const negThreshold = 5
    const posThreshold = 245

    fmt.Println("---- detectTemporalAnomaly ----")
    fmt.Println("Game:", gameID, "| New:", newSent)

    if newSent == "negative" {
        negativeStreak[gameID]++                      // збільшуєм негатив
        fmt.Println("NEGATIVE streak:", negativeStreak[gameID])

        if negativeStreak[gameID] >= negThreshold {
            fmt.Println("ANOMALY many-negative")
            return true, "many-negative"
        }
    }

    if newSent == "positive" {
        positiveStreak[gameID]++                      // збільшуєм позитив
        fmt.Println("POSITIVE streak:", positiveStreak[gameID])

        if positiveStreak[gameID] >= posThreshold {
            fmt.Println("ANOMALY many-positive")
            return true, "many-positive"
        }
    }

    return false, ""
}



func addReview(w http.ResponseWriter, r *http.Request) {
	var review Review
	err := json.NewDecoder(r.Body).Decode(&review)
	if err != nil {
		http.Error(w, "Invalid data format", http.StatusBadRequest)
		return
	}

	review.CreatedAt = time.Now()

	ml, err := callMLService(review.ReviewText, review.Rating, review.UserID, review.GameID)
	if err != nil {
		http.Error(w, "ML service error", 500)
		return
	}

	review.ML.Sentiment = ml.Sentiment
	review.ML.SentimentScore = ml.SentimentScore
	review.ML.FraudScore = ml.FraudScore
	review.ML.IsSuspicious = ml.IsSuspicious

	var existing []string
	cur, _ := reviewCollection.Find(context.Background(), bson.M{"game_id": review.GameID})
	for cur.Next(context.Background()) {
		var ex Review
		cur.Decode(&ex)
		existing = append(existing, ex.ReviewText)
	}

	sim, isDup := detectDuplicate(review.ReviewText, existing)
	review.ML.DuplicateSim = sim
	review.ML.IsDuplicate = isDup

	isTemp, reason := detectTemporalAnomaly(review.GameID, review.ML.Sentiment)
	review.ML.TemporalAnomaly = isTemp
	review.ML.TemporalReason = reason

	_, err = reviewCollection.InsertOne(context.Background(), review)
	if err != nil {
		http.Error(w, "Error adding review", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func handleReviewRequests(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		addReview(w, r)
	case "GET":
		getReviews(w, r)
	case "PUT":
		updateReviewByUserIDAndGameID(w, r)
	case "DELETE":
		deleteReviewByUserIDAndGameID(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getReviews(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	gameID := r.URL.Query().Get("game_id")

	var filter bson.M

	if userID != "" {
		filter = bson.M{"user_id": userID}
	} else if gameID != "" {
		filter = bson.M{"game_id": gameID}
	} else {
		http.Error(w, "User_id or game_id required", http.StatusBadRequest)
		return
	}

	cursor, err := reviewCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var reviews []Review
	cursor.All(context.Background(), &reviews)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}

func updateReviewByUserIDAndGameID(w http.ResponseWriter, r *http.Request) {
	vars := r.URL.Query()
	userID := vars.Get("user_id")
	gameID := vars.Get("game_id")

	var updated Review
	json.NewDecoder(r.Body).Decode(&updated)

	filter := bson.M{"user_id": userID, "game_id": gameID}
	update := bson.M{
		"$set": bson.M{
			"review_text": updated.ReviewText,
			"rating":      updated.Rating,
		},
	}

	reviewCollection.UpdateOne(context.Background(), filter, update)
	w.WriteHeader(http.StatusOK)
}

func deleteReviewByUserIDAndGameID(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	gameID := r.URL.Query().Get("game_id")

	filter := bson.M{"user_id": userID, "game_id": gameID}
	res, _ := reviewCollection.DeleteOne(context.Background(), filter)

	if res.DeletedCount == 0 {
		http.Error(w, "Review not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func getGamesForUser(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")

	var library struct {
		Games []string `bson:"games"`
	}

	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		json.NewEncoder(w).Encode([]string{})
		return
	}

	gamesWith := []string{}
	gamesWithout := []string{}

	for _, gameID := range library.Games {
		err := reviewCollection.FindOne(context.Background(), bson.M{"user_id": userID, "game_id": gameID}).Err()

		if err == mongo.ErrNoDocuments {
			gamesWithout = append(gamesWithout, gameID)
		} else {
			gamesWith = append(gamesWith, gameID)
		}
	}

	json.NewEncoder(w).Encode(map[string][]string{
		"gamesWithReviews":    gamesWith,
		"gamesWithoutReviews": gamesWithout,
	})
}

func getReviewsByUserID(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")

	cursor, err := reviewCollection.Find(context.Background(), bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}

	defer cursor.Close(context.Background())

	var reviews []Review
	cursor.All(context.Background(), &reviews)

	json.NewEncoder(w).Encode(reviews)
}

func getReviewsByGameID(w http.ResponseWriter, r *http.Request) {
	gameID := r.URL.Query().Get("game_id")

	cursor, err := reviewCollection.Find(context.Background(), bson.M{"game_id": gameID})
	if err != nil {
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var reviews []Review
	cursor.All(context.Background(), &reviews)

	json.NewEncoder(w).Encode(reviews)
}



func main() {
	connectToMongoDB()

	http.HandleFunc("/review", handleReviewRequests)
	http.HandleFunc("/review/users/games", getGamesForUser)
	http.HandleFunc("/reviews/user", getReviewsByUserID)
	http.HandleFunc("/reviews/game", getReviewsByGameID)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Server running on port 8090...")
	http.ListenAndServe(":8090", handler)
}

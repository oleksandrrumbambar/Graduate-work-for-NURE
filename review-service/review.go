package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var reviewCollection *mongo.Collection
var libraryCollection *mongo.Collection

func connectToMongoDB() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://sashapena1337:yeaqxhqPjaw1P8S8@users.bi8zdnp.mongodb.net/?retryWrites=true&w=majority&appName=Users"))
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

type Review struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID     string             `bson:"user_id" json:"user_id"`
	GameID     string             `bson:"game_id" json:"game_id"`
	ReviewText string             `bson:"review_text" json:"review_text"`
	Rating     int                `bson:"rating" json:"rating"`
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

func addReview(w http.ResponseWriter, r *http.Request) {
	var review Review
	err := json.NewDecoder(r.Body).Decode(&review)
	if err != nil {
		http.Error(w, "Invalid data format", http.StatusBadRequest)
		return
	}

	_, err = reviewCollection.InsertOne(context.Background(), review)
	if err != nil {
		http.Error(w, "Error adding review", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func getReviews(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	userID := query.Get("user_id")
	gameID := query.Get("game_id")

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
	if err = cursor.All(context.Background(), &reviews); err != nil {
		http.Error(w, "Error processing reviews", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}

func updateReviewByUserIDAndGameID(w http.ResponseWriter, r *http.Request) {
	vars := r.URL.Query()
	userID := vars.Get("user_id")
	gameID := vars.Get("game_id")

	var updatedReview Review
	err := json.NewDecoder(r.Body).Decode(&updatedReview)
	if err != nil {
		http.Error(w, "Invalid data format", http.StatusBadRequest)
		return
	}

	filter := bson.M{"user_id": userID, "game_id": gameID}
	update := bson.M{
		"$set": bson.M{
			"review_text": updatedReview.ReviewText,
			"rating":      updatedReview.Rating,
		},
	}

	_, err = reviewCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Error updating review", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func deleteReviewByUserIDAndGameID(w http.ResponseWriter, r *http.Request) {
	vars := r.URL.Query()
	userID := vars.Get("user_id")
	gameID := vars.Get("game_id")

	filter := bson.M{"user_id": userID, "game_id": gameID}

	result, err := reviewCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error deleting review", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Review not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func getGamesForUser(w http.ResponseWriter, r *http.Request) {
	// Отримання параметра user_id з URL-запиту
	userID := r.URL.Query().Get("user_id")

	// Перевірка, чи вказаний параметр
	if userID == "" {
		http.Error(w, "User_id is required", http.StatusBadRequest)
		return
	}

	// Пошук ігор в бібліотеці користувача
	var userLibrary struct {
		Games []string `bson:"games"`
	}
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&userLibrary)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Якщо бібліотека користувача порожня, відправляємо порожній список
			jsonResponse, _ := json.Marshal([]string{})
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResponse)
			return
		} else {
			http.Error(w, "Failed to fetch user library", http.StatusInternalServerError)
			return
		}
	}

	// Створення списку ігор з відгуками і без
	gamesWithReviews := make([]string, 0)
	gamesWithoutReviews := make([]string, 0)

	// Перевірка наявності відгуку для кожної гри в бібліотеці користувача
	for _, gameID := range userLibrary.Games {
		var review struct {
			ID primitive.ObjectID `bson:"_id,omitempty"`
		}
		err = reviewCollection.FindOne(context.Background(), bson.M{"user_id": userID, "game_id": gameID}).Decode(&review)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				// Якщо відгук відсутній, додаємо гру до списку без відгуків
				gamesWithoutReviews = append(gamesWithoutReviews, gameID)
			} else {
				http.Error(w, "Failed to fetch reviews", http.StatusInternalServerError)
				return
			}
		} else {
			// Якщо відгук для гри знайдено, додаємо гру до списку з відгуками
			gamesWithReviews = append(gamesWithReviews, gameID)
		}
	}

	// Відправка списків ігор з відгуками і без відгуків
	response := map[string][]string{
		"gamesWithReviews":    gamesWithReviews,
		"gamesWithoutReviews": gamesWithoutReviews,
	}
	jsonResponse, _ := json.Marshal(response)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func getReviewsByUserID(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")

	if userID == "" {
		http.Error(w, "User_id is required", http.StatusBadRequest)
		return
	}

	filter := bson.M{"user_id": userID}
	cursor, err := reviewCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var reviews []Review
	if err = cursor.All(context.Background(), &reviews); err != nil {
		http.Error(w, "Error processing reviews", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}

func getReviewsByGameID(w http.ResponseWriter, r *http.Request) {
	gameID := r.URL.Query().Get("game_id")

	if gameID == "" {
		http.Error(w, "Game_id is required", http.StatusBadRequest)
		return
	}

	filter := bson.M{"game_id": gameID}
	cursor, err := reviewCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error fetching reviews", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var reviews []Review
	if err = cursor.All(context.Background(), &reviews); err != nil {
		http.Error(w, "Error processing reviews", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}

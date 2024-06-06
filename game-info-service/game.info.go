package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Game структура представляє гру
type Game struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name             string        `bson:"name" json:"name"`
	Genre            []string      `bson:"genre" json:"genre"`
	Description      string        `bson:"description" json:"description"`
	ShortDescription string        `bson:"short_description" json:"short_description"`
	Price            string        `bson:"price" json:"price"`
	Developer        string        `bson:"developer" json:"developer"`
	Publisher        string        `bson:"publisher" json:"publisher"`
	ReleaseDate      string        `bson:"release_date" json:"release_date"`
	Rating           Rating        `bson:"rating" json:"rating"`
	AgeRating        string        `bson:"age_rating" json:"age_rating"`
	AgeRatingImage   string        `bson:"age_rating_image" json:"age_rating_image"`
	Languages        Languages     `bson:"languages" json:"languages"`
	SystemRequirements SystemRequirements `bson:"system_requirements" json:"system_requirements"`
	Gallery          []GalleryItem `bson:"gallery" json:"gallery"`
	HeaderImage      string        `bson:"header_image" json:"header_image"`
	FriendActivity   FriendActivity `bson:"friend_activity" json:"friend_activity"`
}

type Rating struct {
	Store     int `bson:"store" json:"store"`
	Friends   int `bson:"friends" json:"friends"`
	Community int `bson:"community" json:"community"`
}

type Languages struct {
	Voice []string `bson:"voice" json:"voice"`
	Text  []string `bson:"text" json:"text"`
}

type SystemRequirements struct {
	Minimum     Requirements `bson:"minimum" json:"minimum"`
	Recommended Requirements `bson:"recommended" json:"recommended"`
	Ultra       Requirements `bson:"ultra" json:"ultra"`
}

type Requirements struct {
	OS       string `bson:"os" json:"os"`
	Processor string `bson:"processor" json:"processor"`
	Memory   string `bson:"memory" json:"memory"`
	Graphics string `bson:"graphics" json:"graphics"`
	Storage  string `bson:"storage" json:"storage"`
	Notes    string `bson:"notes" json:"notes"`
}

type GalleryItem struct {
	Type string `bson:"type" json:"type"`
	URL  string `bson:"url" json:"url"`
}

type FriendActivity struct {
	Own      []string `bson:"own" json:"own"`
	Wishlist []string `bson:"wishlist" json:"wishlist"`
}

var client *mongo.Client
var gameCollection *mongo.Collection

func connectToMongoDB() {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI("mongodb+srv://sashapena1337:yeaqxhqPjaw1P8S8@users.bi8zdnp.mongodb.net/?retryWrites=true&w=majority&appName=Users"))
	if err != nil {
		fmt.Println("Помилка створення MongoDB клієнта:", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		fmt.Println("Помилка підключення до MongoDB:", err)
		return
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		fmt.Println("Помилка пінгування MongoDB:", err)
		return
	}

	fmt.Println("Підключення до MongoDB успішне")

	gameCollection = client.Database("Games").Collection("Game")
}

func main() {
	// Підключення до MongoDB
	connectToMongoDB()

	// Обробник для маршруту /game
	http.HandleFunc("/game", getGameHandler)

	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер запущено на порті 8050...")
	http.ListenAndServe(":8050", handler)
}

func getGameHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Метод не підтримується", http.StatusMethodNotAllowed)
		return
	}

	// Отримання параметру id з URL
	gameID := r.URL.Query().Get("id")
	if gameID == "" {
		http.Error(w, "Не вказано id гри", http.StatusBadRequest)
		return
	}

	// Створення об'єкту ObjectID з рядка
	objID, err := primitive.ObjectIDFromHex(gameID)
	if err != nil {
		http.Error(w, "Некоректний id гри", http.StatusBadRequest)
		return
	}

	// Пошук гри в базі даних
	var game Game
	err = gameCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&game)
	if err != nil {
		http.Error(w, "Гру не знайдено", http.StatusNotFound)
		return
	}

	// Відправка інформації про гру у відповідь
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

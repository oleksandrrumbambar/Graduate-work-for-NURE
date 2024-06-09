package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var userCollection *mongo.Collection
var libraryCollection *mongo.Collection
var basketCollection *mongo.Collection
var wishlistCollection *mongo.Collection
var paymentCollection *mongo.Collection

var library struct {
	UserID string   `bson:"user" json:"user"`
	Games  []string `bson:"games" json:"games"`
}

type Friend struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserIDAccept     string             `bson:"user_id_accept" json:"user_id_accept"`
	UserIDSent       string             `bson:"user_id_sent" json:"user_id_sent"`
	FriendshipStatus string             `bson:"friendship_status" json:"friendship_status"`
}

// User структура представляє користувача
type User struct {
	Login    string `bson:"login" json:"login"`
	Email    string `bson:"email" json:"email"`
	Password string `bson:"password" json:"password"`
	Country  string `bson:"country" json:"country"`
	FullName string `bson:"full_name" json:"full_name"`
	Postcode string `bson:"postcode" json:"postcode"`
	GameName string `bson:"game_name" json:"game_name"`
	UserID   string `bson:"user_id" json:"user_id"`
	Avatar   string `bson:"avatar" json:"avatar"`
	Status   string `bson:"status" json:"status"`
}

// Basket модель кошика користувача
type Basket struct {
	ID    primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	User  string             `bson:"user" json:"user"`
	Games []string           `bson:"games" json:"games"`
}

// Wishlist модель списку бажаного користувача
type Wishlist struct {
	ID    primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	User  string             `bson:"user" json:"user"`
	Games []string           `bson:"games" json:"games"`
}

// GameID структура представляє ідентифікатор гри
type GameID struct {
	ID string `bson:"id" json:"id"`
}

// Payment структура представляє модель платежу
type Payment struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Transaction struct {
		Time   string `bson:"time" json:"time"`
		Amount int       `bson:"amount" json:"amount"`
		User   struct {
			ID string `bson:"id" json:"id"`
		} `bson:"user" json:"user"`
		Games []GameID `bson:"games" json:"games"`
	} `bson:"transaction" json:"transaction"`
}
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

	userCollection = client.Database("Users").Collection("User")
	libraryCollection = client.Database("Users").Collection("Library")
	basketCollection = client.Database("Users").Collection("Basket")
	wishlistCollection = client.Database("Users").Collection("WishList")
	paymentCollection = client.Database("Payment").Collection("Payment")
}

func main() {
	// Підключення до MongoDB
	connectToMongoDB()

	// Реєстрація HTTP маршруту для обробки платежів
	http.HandleFunc("/payment", handlePayment)

	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер запущено на порті 8040...")
	http.ListenAndServe(":8040", handler)
}

func handlePayment(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into the Payment struct
	var payment Payment
	err := json.NewDecoder(r.Body).Decode(&payment)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Process the payment
	err = processPayment(payment)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to process payment: %v", err), http.StatusInternalServerError)
		return
	}

	// Insert the payment data into the paymentCollection
	_, err = paymentCollection.InsertOne(context.Background(), payment)
	if err != nil {
		http.Error(w, "Failed to record payment", http.StatusInternalServerError)
		return
	}

	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Payment processed successfully"))
}

func processPayment(payment Payment) error {
	userID := payment.Transaction.User.ID

	// Clear user's favorites list
	err := clearUserFavorites(userID, payment.Transaction.Games)
	if err != nil {
		return fmt.Errorf("failed to clear user's favorites: %w", err)
	}

	// Clear user's cart
	err = clearUserCart(userID)
	if err != nil {
		return fmt.Errorf("failed to clear user's cart: %w", err)
	}

	// Add games to user's library
	err = addGamesToLibrary(userID, payment.Transaction.Games)
	if err != nil {
		return fmt.Errorf("failed to add games to library: %w", err)
	}

	return nil
}

func clearUserFavorites(userID string, games []GameID) error {
	gameIDs := make([]string, len(games))
	for i, game := range games {
		gameIDs[i] = game.ID
	}

	_, err := wishlistCollection.UpdateOne(
		context.Background(),
		map[string]interface{}{"user": userID},
		map[string]interface{}{
			"$pull": map[string]interface{}{
				"games": map[string]interface{}{
					"$in": gameIDs,
				},
			},
		},
	)
	if err != nil {
		return fmt.Errorf("failed to clear user's favorites: %w", err)
	}
	fmt.Printf("Cleared favorites for user: %s\n", userID)
	return nil
}


func clearUserCart(userID string) error {
	_, err := basketCollection.UpdateOne(
		context.Background(),
		map[string]interface{}{"user": userID},
		map[string]interface{}{
			"$set": map[string]interface{}{
				"games": []string{},
			},
		},
	)
	if err != nil {
		return fmt.Errorf("failed to clear user's cart: %w", err)
	}
	fmt.Printf("Cleared cart for user: %s\n", userID)
	return nil
}


func addGamesToLibrary(userID string, games []GameID) error {
	gameIDs := make([]string, len(games))
	for i, game := range games {
		gameIDs[i] = game.ID
	}

	_, err := libraryCollection.UpdateOne(
		context.Background(),
		map[string]interface{}{"user": userID},
		map[string]interface{}{
			"$addToSet": map[string]interface{}{
				"games": map[string]interface{}{
					"$each": gameIDs,
				},
			},
		},
	)
	if err != nil {
		return fmt.Errorf("failed to add games to library: %w", err)
	}
	fmt.Printf("Added games to library for user: %s\n", userID)
	return nil
}


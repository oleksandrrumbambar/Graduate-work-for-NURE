package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/lithammer/fuzzysearch/fuzzy"
	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var userCollection *mongo.Collection
var libraryCollection *mongo.Collection
var friendCollection *mongo.Collection

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
	friendCollection = client.Database("Users").Collection("Friend")
}

func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Метод не підтримується", http.StatusMethodNotAllowed)
		return
	}

	// Отримання параметру user_id з URL
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Не вказано user_id", http.StatusBadRequest)
		return
	}

	// Пошук користувача в базі даних за його user_id
	var user map[string]interface{}
	err := userCollection.FindOne(context.Background(), bson.M{"user_id": userID}).Decode(&user)
	fmt.Println()
	if err != nil {
		http.Error(w, "Користувача не знайдено", http.StatusNotFound)
		return
	}

	// Відправка інформації про користувача у відповідь
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func getGamesByUserIDHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Метод не підтримується", http.StatusMethodNotAllowed)
		return
	}

	// Отримання параметру user_id з URL
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Не вказано user_id", http.StatusBadRequest)
		return
	}

	// Пошук ігор у бібліотеці користувача за його user_id
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		http.Error(w, "Бібліотеку користувача не знайдено", http.StatusNotFound)
		return
	}

	// Відправка інформації про ігри користувача у відповідь
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(library)
}

func main() {
	// Підключення до MongoDB
	connectToMongoDB()

	// Обробник для маршруту
	http.HandleFunc("/user", getUserInfoHandler)

	//
	http.HandleFunc("/user/games", getGamesByUserIDHandler)

	//
	http.HandleFunc("/addFriendRequest", addFriendRequestHandler)
	http.HandleFunc("/confirmFriendRequest", confirmFriendRequestHandler)
	http.HandleFunc("/removeFriend", removeFriendHandler)
	http.HandleFunc("/friendRequests", getFriendRequestsHandler)
	
	//
	http.HandleFunc("/searchUser", searchUserHandler)

	//
	http.HandleFunc("/getFriends", getFriendsHandler)

	// Перевірка статусу дружби
	http.HandleFunc("/checkFriendship", checkFriendshipHandler)

	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер запущено на порті 8070...")
	http.ListenAndServe(":8070", handler)
}

func addFriendRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var friend Friend
	err := json.NewDecoder(r.Body).Decode(&friend)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Перевірка, що user_id_accept та user_id_sent присутні
	if friend.UserIDAccept == "" || friend.UserIDSent == "" {
		http.Error(w, "Missing user_id_accept or user_id_sent", http.StatusBadRequest)
		return
	}

	friend.FriendshipStatus = "request"

	_, err = friendCollection.InsertOne(context.Background(), friend)
	if err != nil {
		http.Error(w, "Error adding friend request", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Friend request added"))
}

func confirmFriendRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var friend Friend
	err := json.NewDecoder(r.Body).Decode(&friend)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	filter := bson.M{
		"user_id_accept":    friend.UserIDAccept,
		"user_id_sent":      friend.UserIDSent,
		"friendship_status": "request",
	}

	update := bson.M{
		"$set": bson.M{
			"friendship_status": "friendship",
		},
	}

	result, err := friendCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Error confirming friend request", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Friend request not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Friend request confirmed"))
}

func removeFriendHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var friend Friend
	err := json.NewDecoder(r.Body).Decode(&friend)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	filter := bson.M{
		"user_id_accept": friend.UserIDAccept,
		"user_id_sent":   friend.UserIDSent,
	}

	result, err := friendCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error deleting friend", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Friend not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Friend deleted"))
}

func searchUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query().Get("query")
	if query == "" {
		http.Error(w, "Query parameter is required", http.StatusBadRequest)
		return
	}

	users, err := searchUsers(query)
	if err != nil {
		http.Error(w, "Error searching users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func searchUsers(query string) ([]User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Пошук користувачів за допомогою регулярних виразів для часткового збігу
	filter := bson.M{"game_name": bson.M{"$regex": query, "$options": "i"}}
	cursor, err := userCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []User
	for cursor.Next(ctx) {
		var user User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	// Сортування результатів за релевантністю з використанням fuzzysearch
	sort.Slice(users, func(i, j int) bool {
		return fuzzy.RankMatch(query, users[i].GameName) < fuzzy.RankMatch(query, users[j].GameName)
	})

	return users, nil
}

func getFriendsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID parameter is required", http.StatusBadRequest)
		return
	}

	// Отримання списку ID друзів за допомогою функції findFriendsByID
	friendIDs, err := findFriendsByID(userID)
	if err != nil {
		http.Error(w, "Error finding friends", http.StatusInternalServerError)
		return
	}
	
	// Запит на інформацію про друзів з колекції користувачів
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var friendsInfo []User
	for _, friendID := range friendIDs {
		var user User
		err := userCollection.FindOne(ctx, bson.M{"user_id": friendID}).Decode(&user)
		fmt.Println(err)
		if err != nil {
			http.Error(w, "Error finding friend info", http.StatusInternalServerError)
			return
		}
		friendsInfo = append(friendsInfo, user)
	}


	// Повернення інформації про друзів користувача у відповідь
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(friendsInfo)
}


func findFriendsByID(userID string) ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Пошук друзів користувача за його ID у полях user_id_accept та user_id_sent
	filter := bson.M{
		"$or": []bson.M{
			{"user_id_accept": userID},
			{"user_id_sent": userID},
		},
	}
	cursor, err := friendCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var friendIDs []string
	for cursor.Next(ctx) {
		var friend Friend
		if err := cursor.Decode(&friend); err != nil {
			return nil, err
		}
		// Додавання ID друга до масиву
		if friend.UserIDAccept != userID {
			friendIDs = append(friendIDs, friend.UserIDAccept)
		}
		if friend.UserIDSent != userID {
			friendIDs = append(friendIDs, friend.UserIDSent)
		}
	}

	return friendIDs, nil
}

func checkFriendshipHandler(w http.ResponseWriter, r *http.Request) {
    // Перевірка методу запиту
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    // Отримання ID з параметрів запиту
    user1ID := r.URL.Query().Get("user_id1")
    user2ID := r.URL.Query().Get("user_id2")
    if user1ID == "" || user2ID == "" {
        http.Error(w, "Both user IDs are required", http.StatusBadRequest)
        return
    }
    // Перевірка чи існує "дружба" між користувачами за переданими ID
    filter := bson.M{
        "$or": []bson.M{
            {"user_id_accept": user1ID, "user_id_sent": user2ID},
            {"user_id_accept": user2ID, "user_id_sent": user1ID},
        },
    }
    // Пошук "дружби" в колекції
    var friendship bson.M
    err := friendCollection.FindOne(context.Background(), filter).Decode(&friendship)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            fmt.Fprintf(w, "No friendship between %s and %s", user1ID, user2ID)
            return
        }
        http.Error(w, "Error checking friendship", http.StatusInternalServerError)
        return
    }
    // Відправлення статусу дружби, якщо знайдено
	w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(friendship); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func getFriendRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDAccept := r.URL.Query().Get("user_id_accept")
	if userIDAccept == "" {
		http.Error(w, "User ID parameter is required", http.StatusBadRequest)
		return
	}

	// Знайти всі запити на дружбу з user_id_accept і статусом "request"
	filter := bson.M{"user_id_accept": userIDAccept, "friendship_status": "request"}
	cursor, err := friendCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error finding friend requests", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var friendRequests []Friend
	if err = cursor.All(context.Background(), &friendRequests); err != nil {
		http.Error(w, "Error decoding friend requests", http.StatusInternalServerError)
		return
	}

	// Отримати інформацію про користувачів, які надіслали запит
	var users []User
	for _, friendRequest := range friendRequests {
		var user User
		err := userCollection.FindOne(context.Background(), bson.M{"user_id": friendRequest.UserIDSent}).Decode(&user)
		if err != nil {
			http.Error(w, "Error finding user info", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	// Повернення інформації про користувачів у відповідь
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var userCollection *mongo.Collection

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
}

var users []User

func main() {
	// Підключення до MongoDB
	loadUsers()

	// Обробник для маршруту /login
	http.HandleFunc("/login", loginHandler)

	// Обробник для маршруту /register
	http.HandleFunc("/register", registerHandler)

	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер запущено на порті 8080...")
	http.ListenAndServe(":8080", handler)
}

// Обробник для маршруту /login
func loginHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Метод не підтримується", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Помилка розкодування JSON", http.StatusBadRequest)
		return
	}

	// Перевірка, чи існує користувач з вказаним email та паролем
	authUser := authenticateUser(user.Email, user.Password)
	fmt.Println(authUser)
	if authUser != nil {

		token := jwt.New(jwt.SigningMethodHS256)
		claims := token.Claims.(jwt.MapClaims)
		claims["user_id"] = authUser.UserID
		fmt.Println(claims)
		// Підпис токена
		tokenString, err := token.SignedString([]byte("1337fasola"))
		if err != nil {
			http.Error(w, "Помилка створення токена", http.StatusInternalServerError)
			return
		}
		response := map[string]interface{}{
			"success": true,
			"token":   tokenString,
		}
		jsonResponse, _ := json.Marshal(response)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	} else {
		response := map[string]interface{}{
			"success": false,
		}
		jsonResponse, _ := json.Marshal(response)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(jsonResponse)
	}
}

// Обробник для маршруту /register
func registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не підтримується", http.StatusMethodNotAllowed)
		return
	}

	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, "Помилка розкодування JSON", http.StatusBadRequest)
		return
	}
	newUser.UserID = uuid.New().String()

	err = addUser(newUser)
	if err != nil {
		http.Error(w, "Помилка додавання користувача до бази даних", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// Завантаження користувачів з JSON файлу
func loadUsers() {
	connectToMongoDB()
}

// Збереження користувачів у JSON файл
func saveUsers() {
	data, err := json.Marshal(users)
	if err != nil {
		fmt.Println("Помилка кодування JSON:", err)
		return
	}

	err = ioutil.WriteFile("../json/user.json", data, 0644)
	if err != nil {
		fmt.Println("Помилка запису у файл:", err)
	}
}

// Перевірка аутифікації користувача за допомогою email та пароля
func authenticateUser(email, password string) *User {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User
	err := userCollection.FindOne(ctx, bson.M{"email": email, "password": password}).Decode(&user)
	if err != nil {
		return nil
	}

	return &user
}

func addUser(user User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := userCollection.InsertOne(ctx, user)
	return err
}

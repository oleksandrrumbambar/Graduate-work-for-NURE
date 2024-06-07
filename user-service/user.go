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

func main() {
    // Підключення до MongoDB
    connectToMongoDB()

    // Обробник для маршруту
    http.HandleFunc("/user", getUserInfoHandler)

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

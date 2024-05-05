package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"github.com/google/uuid"
	"github.com/dgrijalva/jwt-go"
	"github.com/rs/cors"
)

// User структура представляє користувача
type User struct {
	Login    	string `json:"login"`
	Email    	string `json:"email"`
	Password 	string `json:"password"`
	Country 	string `json:"country"`
	FullName    string `json:"full_name"`
	Postcode 	string `json:"postcode"`
	GameName 	string `json:"game_name"`
	UserID   	string	`json:"user_id"`
}

var users []User

func main() {
	// Завантаження користувачів з JSON файлу
	loadUsers()

	// Обробник для маршруту /login
	http.HandleFunc("/login", loginHandler)

	// Обробник для маршруту /register
	http.HandleFunc("/register", registerHandler)

	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"},
        AllowedMethods: []string{"GET", "POST"},
        AllowedHeaders: []string{"Content-Type"},
        AllowCredentials: true,
    })

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер запущено на порті 8000...")
	http.ListenAndServe(":8000", handler)
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
        // Підпис токена
        tokenString, err := token.SignedString([]byte("1337fasola"))
        if err != nil {
            http.Error(w, "Помилка створення токена", http.StatusInternalServerError)
            return
        }
		response := map[string]interface{}{
			"success": true,
			"token": tokenString,
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
	// Додавання нового користувача до списку
	users = append(users, newUser)

	// Збереження користувачів у JSON файл
	saveUsers()

	w.WriteHeader(http.StatusCreated)
}

// Завантаження користувачів з JSON файлу
func loadUsers() {
	data, err := ioutil.ReadFile("../json/user.json")
	if err != nil {
		fmt.Println("Помилка читання файлу:", err)
		return
	}

	err = json.Unmarshal(data, &users)
	if err != nil {
		fmt.Println("Помилка розкодування JSON:", err)
		return
	}
}

// Збереження користувачів у JSON файл
func saveUsers() {
	data, err := json.Marshal(users)
	if err != nil {
		fmt.Println("Помилка кодування JSON:", err)
		return
	}

	err =  ioutil.WriteFile("../json/user.json", data, 0644)
	if err != nil {
		fmt.Println("Помилка запису у файл:", err)
	}
}

// Перевірка аутифікації користувача за допомогою email та пароля
func authenticateUser(email, password string) *User {
	for _, u := range users {
		if u.Email == email && u.Password == password {
			return &u
		}
	}
	return nil
}

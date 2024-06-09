package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

var userCollection *mongo.Collection
var friendCollection *mongo.Collection
var libraryCollection *mongo.Collection
var basketCollection *mongo.Collection
var wishlistCollection *mongo.Collection
var gameCollection *mongo.Collection
var paymentCollection *mongo.Collection

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
	friendCollection = client.Database("Users").Collection("Friend")
	gameCollection = client.Database("Games").Collection("Game")
	paymentCollection = client.Database("Payment").Collection("Payment")
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

// Game структура представляє гру
type Game struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name               string             `bson:"name" json:"name"`
	Genre              []string           `bson:"genre" json:"genre"`
	Description        string             `bson:"description" json:"description"`
	ShortDescription   string             `bson:"short_description" json:"short_description"`
	Price              string             `bson:"price" json:"price"`
	Developer          string             `bson:"developer" json:"developer"`
	Publisher          string             `bson:"publisher" json:"publisher"`
	ReleaseDate        string             `bson:"release_date" json:"release_date"`
	Rating             Rating             `bson:"rating" json:"rating"`
	AgeRating          string             `bson:"age_rating" json:"age_rating"`
	AgeRatingImage     string             `bson:"age_rating_image" json:"age_rating_image"`
	Languages          Languages          `bson:"languages" json:"languages"`
	SystemRequirements SystemRequirements `bson:"system_requirements" json:"system_requirements"`
	Gallery            []GalleryItem      `bson:"gallery" json:"gallery"`
	HeaderImage        string             `bson:"header_image" json:"header_image"`
	FriendActivity     FriendActivity     `bson:"friend_activity" json:"friend_activity"`
	CopiesSold         int64              `bson:"copies_sold" json:"copies_sold"`
	Franchise		   string			  `bson:"franchise" json:"franchise"`
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
	OS        string `bson:"os" json:"os"`
	Processor string `bson:"processor" json:"processor"`
	Memory    string `bson:"memory" json:"memory"`
	Graphics  string `bson:"graphics" json:"graphics"`
	Storage   string `bson:"storage" json:"storage"`
	Notes     string `bson:"notes" json:"notes"`
}

type GalleryItem struct {
	Type string `bson:"type" json:"type"`
	URL  string `bson:"url" json:"url"`
}

type FriendActivity struct {
	Own      []string `bson:"own" json:"own"`
	Wishlist []string `bson:"wishlist" json:"wishlist"`
}

// Library модель кошика користувача
type Library struct {
	ID    primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	User  string             `bson:"user" json:"user"`
	Games []string           `bson:"games" json:"games"`
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

// Friend модель списку бажаного користувача
type Friend struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserIDAccept     string             `bson:"user_id_accept" json:"user_id_accept"`
	UserIDSent       string             `bson:"user_id_sent" json:"user_id_sent"`
	FriendshipStatus string             `bson:"friendship_status" json:"friendship_status"`
}

// Transaction структура для представлення транзакції
type Transaction struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Transaction Details            `json:"transaction" bson:"transaction"`
}

// Details структура для деталей транзакції
type Details struct {
	Time   time.Time         `json:"time" bson:"time"`
	Amount int               `json:"amount" bson:"amount"`
	User   UserTransaction   `json:"user" bson:"user"`
	Games  []GameTransaction `json:"games" bson:"games"`
}

// User структура для представлення користувача
type UserTransaction struct {
	ID string `json:"id" bson:"id"`
}

// Game структура для представлення гри
type GameTransaction struct {
	ID string `json:"id" bson:"id"`
}

func main() {
	connectToMongoDB()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})
	http.HandleFunc("/user/statistics", userStatisticsHandler)

	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Сервер STATISTIC запущено на порті 8030...")
	http.ListenAndServe(":8030", handler)
}

// UserStatistics представляє статистику користувача.
type UserStatistics struct {
	FavoriteGenre         string             `json:"favorite_genre"`
	GenreWeights          map[string]float64 `json:"genre_weights"`
	GameAgePercentages    map[string]float64 `json:"game_age_percentages"`
	GamesPurchasedPerYear map[int]int        `json:"games_purchased_per_year"`
	TotalAccountPrice     float64            `json:"total_account_price"`
	FavoriteFranchises    []string           `json:"favorite_franchises"`
}

// userStatisticsHandler це HTTP-обробник для кінцевого пункту статистики користувачів.
func userStatisticsHandler(w http.ResponseWriter, r *http.Request) {
	// Витягніть ідентифікатор користувача із запиту (це має бути реалізовано на основі вашого механізму автентифікації).
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Missing user_id parameter", http.StatusBadRequest)
		return
	}

	// Вирахувати улюблений жанр користувача.
	favoriteGenre, err := getFavoriteGenre(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Розрахуйте вагу кожного жанру в бібліотеці користувача.
	genreWeights, err := getGenreWeights(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	gameAgePercentages, err := calculateGameAgePercentages(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	gamesPurchasedPerYear, err := getGamesPurchasedPerYear(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	totalAccountPrice, err := getTotalAccountPrice(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	favoriteFranchises, err := getFavoriteFranchises(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Створіть відповідь зі статистикою користувачів.
	stats := UserStatistics{
		FavoriteGenre:         favoriteGenre,
		GenreWeights:          genreWeights,
		GameAgePercentages:    gameAgePercentages,
		GamesPurchasedPerYear: gamesPurchasedPerYear,
		TotalAccountPrice:     totalAccountPrice,
		FavoriteFranchises:    favoriteFranchises,
	}


	// Перетворіть статистику в JSON і надішліть відповідь.
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// getFavoriteGenre обчислює улюблений жанр користувача на основі його бібліотеки.
func getFavoriteGenre(userID string) (string, error) {
	// Знаходження бібліотеки користувача, щоб отримати список ігор.
	library := Library{}
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		return "", err
	}

	// Підрахунок, як часто зустрічається кожен жанр у бібліотеці.
	genreCounts := make(map[string]int)
	for _, gameID := range library.Games {
		game := Game{}
		// Створення об'єкту ObjectID з рядка
		objID, err := primitive.ObjectIDFromHex(gameID)
		err = gameCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&game)
		if err != nil {
			fmt.Println(err)
			continue // Пропустити ігри, які неможливо знайти
		}
		for _, genre := range game.Genre {
			genreCounts[genre]++
		}
	}
	fmt.Println(genreCounts)
	// Знайти жанр з максимальною кількістю.
	maxCount := 0
	favoriteGenre := ""
	for genre, count := range genreCounts {
		if count > maxCount {
			maxCount = count
			favoriteGenre = genre
		}
	}

	return favoriteGenre, nil
}

// getGenreWeights це HTTP-обробник для кінцевого пункту статистики користувачів.
func getGenreWeights(userID string) (map[string]float64, error) {
	// Зверніться до бібліотеки користувача, щоб отримати список ігор.
	library := Library{}
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		return nil, err
	}

	// Підрахуйте загальну кількість ігор у бібліотеці.
	totalGames := len(library.Games)
	if totalGames == 0 {
		return nil, fmt.Errorf("no games in library")
	}

	// Підрахуйте, як часто зустрічається кожен жанр у бібліотеці.
	genreCounts := make(map[string]int)
	for _, gameID := range library.Games {
		game := Game{}
		// Створення об'єкту ObjectID з рядка
		objID, err := primitive.ObjectIDFromHex(gameID)
		err = gameCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&game)
		if err != nil {
			continue // Пропустити ігри, які неможливо знайти
		}
		for _, genre := range game.Genre {
			genreCounts[genre]++
		}
	}

	// Розрахунок ваги кожного жанру.
	genreWeights := make(map[string]float64)
	for genre, count := range genreCounts {
		genreWeights[genre] = float64(count) / float64(totalGames)
	}

	return genreWeights, nil
}

func calculateGameAgePercentages(userID string) (map[string]float64, error) {
	var library Library
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	totalGames := len(library.Games)
	if totalGames == 0 {
		return nil, errors.New("no games found for the user")
	}

	gameAges := make(map[string]int)
	for _, gameID := range library.Games {
		var game Game
		objID, err := primitive.ObjectIDFromHex(gameID)
		if err != nil {
			fmt.Printf("Error converting gameID to ObjectID: %v\n", err)
			continue
		}
		err = gameCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&game)
		if err != nil {
			fmt.Printf("Error fetching game details: %v\n", err)
			continue
		}
		ageCategory, err := calculateGameAgeCategory(game.ReleaseDate)
		if err != nil {
			fmt.Printf("Error calculating game age category: %v\n", err)
			continue
		}
		gameAges[ageCategory]++
	}

	agePercentages := make(map[string]float64)
	for category, count := range gameAges {
		agePercentages[category] = float64(count) / float64(totalGames) * 100.0
	}

	return agePercentages, nil
}

func calculateGameAgeCategory(releaseDateStr string) (string, error) {
	// Split the date string into day, month, and year
	parts := strings.Split(releaseDateStr, " ")
	if len(parts) != 3 {
		return "", errors.New("invalid date format")
	}

	day, err := strconv.Atoi(parts[0])
	if err != nil {
		return "", errors.New("invalid day format")
	}

	month := parts[1]
	year, err := strconv.Atoi(parts[2])
	if err != nil {
		return "", errors.New("invalid year format")
	}

	// Create a time.Time object from the parsed date
	releaseDate := time.Date(year, time.Month(getMonthIndex(month)), day, 0, 0, 0, 0, time.UTC)

	// Calculate the age of the game
	currentYear := time.Now().Year()
	age := currentYear - releaseDate.Year()

	if age < 0 {
		return "", errors.New("invalid release date")
	}

	return fmt.Sprintf("%d years", age), nil
}

func getMonthIndex(month string) int {
	switch month {
	case "January":
		return 1
	case "February":
		return 2
	case "March":
		return 3
	case "April":
		return 4
	case "May":
		return 5
	case "June":
		return 6
	case "July":
		return 7
	case "August":
		return 8
	case "September":
		return 9
	case "October":
		return 10
	case "November":
		return 11
	case "December":
		return 12
	default:
		return 0
	}
}

// getGamesPurchasedPerYear підраховує кількість ігор, придбаних користувачем за рік.
func getGamesPurchasedPerYear(userID string) (map[int]int, error) {
	pipeline := mongo.Pipeline{
		{
			{"$match", bson.D{{"transaction.user.id", userID}}},
		},
		{
			{"$addFields", bson.D{
				{"transaction.date", bson.D{
					{"$dateFromString", bson.D{
						{"dateString", "$transaction.time"},
					}},
				}},
			}},
		},
		{
			{"$group", bson.D{
				{"_id", bson.D{{"$year", "$transaction.date"}}},
				{"count", bson.D{{"$sum", 1}}},
			}},
		},
	}

	cursor, err := paymentCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	gamesPerYear := make(map[int]int)
	for cursor.Next(context.Background()) {
		var result struct {
			Year  int `bson:"_id"`
			Count int `bson:"count"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		gamesPerYear[result.Year] = result.Count
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return gamesPerYear, nil
}

// getTotalAccountPrice обчислює загальну вартість усіх ігор у бібліотеці користувача.
func getTotalAccountPrice(userID string) (float64, error) {
	var library Library
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		return 0, err
	}

	var totalPrice float64
	for _, gameID := range library.Games {
		var game Game
		objectID, err := primitive.ObjectIDFromHex(gameID)
		if err != nil {
			return 0, err
		}

		err = gameCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&game)
		if err != nil {
			return 0, err
		}

		price, err := strconv.ParseFloat(game.Price, 64)
		if err != nil {
			return 0, err
		}

		totalPrice += price
	}

	return totalPrice, nil
}

// getFavoriteFranchises визначає улюблені франшизи користувача на основі кількості придбаних ігор.
func getFavoriteFranchises(userID string) ([]string, error) {
	library := Library{}
	err := libraryCollection.FindOne(context.Background(), bson.M{"user": userID}).Decode(&library)
	if err != nil {
		return nil, err
	}

	// Підрахунок ігор у кожній франшизі в бібліотеці користувача.
	franchiseCounts := make(map[string]int)
	for _, gameID := range library.Games {
		game := Game{}
		objID, err := primitive.ObjectIDFromHex(gameID)
		if err != nil {
			continue // Пропустити ігри, які неможливо знайти
		}
		err = gameCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&game)
		if err != nil {
			continue // Пропустити ігри, які неможливо знайти
		}
		if game.Franchise != "" {
			franchiseCounts[game.Franchise]++
		}
	}

	// Знаходження загальної кількості ігор у кожній франшизі.
	franchiseTotalCounts := make(map[string]int)
	cursor, err := gameCollection.Aggregate(context.Background(), mongo.Pipeline{
		{{"$group", bson.D{
			{"_id", "$franchise"},
			{"count", bson.D{{"$sum", 1}}},
		}}},
		{{"$match", bson.D{
			{"count", bson.D{{"$gte", 3}}},
		}}},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var result struct {
			Franchise string `bson:"_id"`
			Count     int    `bson:"count"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		franchiseTotalCounts[result.Franchise] = result.Count
	}

	// Визначення улюблених франшиз.
	var favoriteFranchises []string
	for franchise, count := range franchiseCounts {
		total, ok := franchiseTotalCounts[franchise]
		if ok && float64(count)/float64(total) >= 0.7 {
			favoriteFranchises = append(favoriteFranchises, franchise)
		}
	}

	return favoriteFranchises, nil
}

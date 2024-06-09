package main

import (

)

func main() {


	// Створення об'єкту cors для налаштування CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Використання cors для обробки запитів
	handler := c.Handler(http.DefaultServeMux)
	
	fmt.Println("Сервер запущено на порті 8030...")
	http.ListenAndServe(":8030", handler)
}
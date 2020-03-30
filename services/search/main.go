package main

import (
	"fmt"
	"github.com/go-pg/pg/v9"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

//go:generate go run queries/embed_query_files.go

var db *pg.DB

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func search(w http.ResponseWriter, r *http.Request) {
	var json string
	var params = r.URL.Query()
	_, err := db.Query(
		pg.Scan(&json),
		search_query,
		params["lon"][0],
		params["lat"][0],
		params["distance"][0],
		params["query"][0],
		params["tags"][0],
		params["limit"][0],
	)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	if json == "" {
		json = "[]"
	}
	fmt.Fprintf(w, json)
}

func top_dishes(w http.ResponseWriter, r *http.Request) {
	var json string
	var params = r.URL.Query()
	_, err := db.Query(
		pg.Scan(&json),
		top_dishes_query,
		params["lon"][0],
		params["lat"][0],
		params["distance"][0],
	)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	if json == "" {
		json = "[]"
	}
	fmt.Fprintf(w, json)
}

func handleRequests() {
	port := getEnv("PORT", "10000")
	mux := http.NewServeMux()
	mux.HandleFunc("/search", search)
	mux.HandleFunc("/top_dishes", top_dishes)
	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func main() {
	pg_port := ":" + getEnv("PGPORT", "5432")
	db = pg.Connect(&pg.Options{
		User:     "postgres",
		Password: getEnv("POSTGRES_PASSWORD", "postgres"),
		Addr:     getEnv("POSTGRES_HOST", "localhost") + pg_port,
		Database: "dish",
	})
	defer db.Close()
	handleRequests()
}

package main

import (
	"fmt"
	"github.com/go-pg/pg/v9"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"strconv"
)

//go:generate go run queries/embed_query_files.go

var db *pg.DB

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getParam(key string, r *http.Request) string {
	var param string
	keys, ok := r.URL.Query()[key]
	if !ok || len(keys[0]) < 1 {
		param = ""
	} else {
		param = keys[0]
	}
	return param
}

func floatToStr(f float64) string {
	return fmt.Sprintf("%.9f", f)
}

func hasEmpty(s []string) bool {
	for _, a := range s {
		if a == "" {
			return true
		}
	}
	return false
}

func getBoundingBox(r *http.Request) (string, string, string, string) {
	x, _ := strconv.ParseFloat(getParam("lon", r), 64)
	y, _ := strconv.ParseFloat(getParam("lat", r), 64)
	xd, _ := strconv.ParseFloat(getParam("span_lon", r), 64)
	yd, _ := strconv.ParseFloat(getParam("span_lat", r), 64)
	x1 := floatToStr(x - (xd / 2))
	y1 := floatToStr(y - (yd / 2))
	x2 := floatToStr(x + (xd / 2))
	y2 := floatToStr(y + (yd / 2))
	return x1, y1, x2, y2
}

func search(w http.ResponseWriter, r *http.Request) {
	var json string
	ignore_bounding_box := ""
	distance := "0"
	x1, y1, x2, y2 := getBoundingBox(r)
	missing_bb_values := hasEmpty([]string{
		getParam("lon", r),
		getParam("lat", r),
		getParam("span_lon", r),
		getParam("span_lat", r),
	})
	if missing_bb_values {
		ignore_bounding_box = "IGNORE BB"
	}
	if getParam("distance", r) != "" {
		distance = getParam("distance", r)
	}
	_, err := db.Query(
		pg.Scan(&json),
		search_query,
		getParam("lon", r),
		getParam("lat", r),
		distance,
		getParam("query", r),
		getParam("tags", r),
		getParam("limit", r),
		x1, y1, x2, y2,
		ignore_bounding_box,
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

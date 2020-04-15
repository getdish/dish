package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/go-pg/pg/v9"
	"github.com/rs/cors"
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
	tags := getParam("tags", r)
	ignore_bounding_box := ""
	filter_by_unique := ""
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
	if tagsHas("unique", r) {
		filter_by_unique = "FILTER BY UNIQUE"
		tags = removeTag(tags, "unique")
	}
	_, err := db.Query(
		pg.Scan(&json),
		search_query,
		getParam("lon", r),
		getParam("lat", r),
		distance,
		getParam("query", r),
		tags,
		getParam("limit", r),
		x1, y1, x2, y2,
		ignore_bounding_box,
		filter_by_unique,
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

func tagsHas(target_tag string, r *http.Request) bool {
	tags := strings.Split(getParam("tags", r), ",")
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		tag = strings.ToLower(tag)
		if tag == target_tag {
			return true
		}
	}
	return false
}

func removeTag(tags_param string, tag_to_remove string) string {
	tags := strings.Split(tags_param, ",")
	for i, tag := range tags {
		if tag == tag_to_remove {
			tags = append(tags[:i], tags[i+1:]...)
			break
		}
	}
	return strings.Join(tags, ",")
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

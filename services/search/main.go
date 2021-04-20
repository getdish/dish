package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-pg/pg/v9"
	"github.com/patrickmn/go-cache"
	"github.com/rs/cors"
)

//go:generate go run queries/embed_query_files.go

var db *pg.DB
var c = cache.New(360*time.Minute, 360*time.Minute)

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
	start := time.Now()
	filter_by := make(map[string]string)
	tags := getParam("tags", r)
	var limit = getParam("limit", r)
	if limit == "" {
		limit = "10"
	}
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
	prices := getPrices(r)
	deliveries := getDeliveries(r)
	filter_by, tags = handleSpecialTags(tags, r)
	fmt.Println("search", search_query)
	_, err := db.Query(
		pg.Scan(&json),
		search_query,
		getParam("lon", r),
		getParam("lat", r),
		distance,
		getParam("query", r),
		tags,
		limit,
		x1, y1, x2, y2,
		ignore_bounding_box,
		filter_by["delivery"],
		deliveries,
		filter_by["open"],
		filter_by["price"],
		prices,
		getParam("main_tag", r),
	)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	if json == "" {
		json = "[]"
	}
	duration := time.Since(start)
	fmt.Println("response", duration)
	fmt.Fprintf(w, json)
}

func handleSpecialTags(tags string, r *http.Request) (map[string]string, string) {
	filter_by := make(map[string]string)
	special_tags := [...]string{
		"delivery",
		"open",
		"price",
	}
	for _, tag := range special_tags {
		if tagsHas(tag, r) {
			filter_by[tag] = "FILTER BY " + strings.ToUpper(tag)
			tags = removeTag(tags, tag)
		} else {
			filter_by[tag] = ""
		}
	}
	tags = removeDeliveryTags(tags)
	return filter_by, tags
}

func top_cuisines(w http.ResponseWriter, r *http.Request) {
	var json string
	var params = r.URL.Query()
	var lon = params["lon"][0]
	var lat = params["lat"][0]
	var distance = params["distance"][0]
	var cache_key = "top_cuisines-" + lat + "-" + lon + "-" + distance
	if _json, found := c.Get(cache_key); found {
		json = _json.(string)
	} else {
		_, err := db.Query(
			pg.Scan(&json),
			top_cuisines_query,
			lon,
			lat,
			distance,
		)
		if err != nil {
			fmt.Println(err)
		}
		if json == "" {
			json = "[]"
		}
	}
	c.Set(cache_key, json, cache.DefaultExpiration)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, json)
}

func tags(w http.ResponseWriter, r *http.Request) {
	var json string
	var limit = getParam("limit", r)
	if limit == "" {
		limit = "10"
	}
	_, err := db.Query(
		pg.Scan(&json),
		tags_query,
		getParam("query", r),
		getParam("parent", r),
		getParam("type", r),
		limit,
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

func feed(w http.ResponseWriter, r *http.Request) {
	var json string
	var limit = getParam("limit", r)
	if limit == "" {
		limit = "10"
	}
	_, err := db.Query(
		pg.Scan(&json),
		feed_query,
		getParam("region", r),
		getParam("tags", r),
		limit,
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

func regions(w http.ResponseWriter, r *http.Request) {
	var json string
	_, err := db.Query(
		pg.Scan(&json),
		regions_query,
		getParam("slug", r),
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
		if target_tag == "price" && strings.HasPrefix(tag, "price-") {
			return true
		}
		if target_tag == "delivery" && isDeliveryTag(tag) {
			return true
		}
		if tag == target_tag {
			return true
		}
	}
	return false
}

func getPrices(r *http.Request) string {
	prices := ""
	tags := strings.Split(getParam("tags", r), ",")
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		tag = strings.ToLower(tag)
		if strings.HasPrefix(tag, "price-") {
			prices = prices + tag + ","
		}
	}
	return prices
}

func getDeliveries(r *http.Request) string {
	deliveries := ""
	tags := strings.Split(getParam("tags", r), ",")
	is_delivery_tag_found := false
	for _, tag := range tags {
		if tag == "delivery" {
			is_delivery_tag_found = true
		}
		tag = strings.TrimSpace(tag)
		tag = strings.ToLower(tag)
		if isDeliveryTag(tag) {
			deliveries = deliveries + tag + ","
		}
	}
	if is_delivery_tag_found && deliveries == "" {
		deliveries = "ubereats,grubhub,doordash"
	}
	return deliveries
}

func removeDeliveryTags(tags_string string) string {
	tags := strings.Split(tags_string, ",")
	for _, tag := range tags {
		if isDeliveryTag(tag) {
			tags_string = removeTag(tags_string, tag)
		}
	}
	return tags_string
}

func removeTag(tags_param string, tag_to_remove string) string {
	tags := strings.Split(tags_param, ",")
	var updated_tags []string
	for _, tag := range tags {
		is_matched_tag := tag == tag_to_remove
		is_price_tag := tag_to_remove == "price" && strings.Contains(tag, "price-")
		if !(is_matched_tag || is_price_tag || isDeliveryTag(tag)) {
			updated_tags = append(updated_tags, tag)
		}
	}
	return strings.Join(updated_tags, ",")
}

func isDeliveryTag(tag string) bool {
	return tag == "ubereats" || tag == "grubhub" || tag == "doordash"
}

func handleRequests() {
	port := getEnv("PORT", "9999")
	mux := http.NewServeMux()
	mux.HandleFunc("/search", search)
	mux.HandleFunc("/top_cuisines", top_cuisines)
	mux.HandleFunc("/tags", tags)
	mux.HandleFunc("/feed", feed)
	mux.HandleFunc("/regions", regions)
	handler := cors.Default().Handler(mux)
	addr := "0.0.0.0:" + port
	log.Fatal(http.ListenAndServe(addr, handler))
	fmt.Println("Start server on", addr)
}

func main() {
	pg_port := getEnv("POSTGRES_PORT", "5432")
	addr := getEnv("POSTGRES_HOST", "localhost") + ":" + pg_port
	user := getEnv("POSTGRES_USER", "postgres")
	password := getEnv("POSTGRES_PASSWORD", "postgres")
	database := getEnv("POSTGRES_DB", "dish")
	fmt.Println("postgres", addr, user, database)
	db = pg.Connect(&pg.Options{
		User:     user,
		Password: password,
		Addr:     addr,
		Database: database,
	})

	// check if working
	var n int
	_, err := db.QueryOne(pg.Scan(&n), "SELECT 1")
	if err != nil {
		fmt.Println("error connecting")
	} else {
		fmt.Println("connected to pg")
	}

	defer db.Close()
	handleRequests()
}

package main

import (
	"fmt"
	"github.com/go-pg/pg/v9"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

var db *pg.DB

var query = `
	SELECT jsonb_agg(
		json_build_object(
			'id', data.id,
			'name', data.name,
			'slug', data.slug,
			'rating', data.rating,
			'address', data.address,
			'location', ST_AsGeoJSON(data.location)::json,
			'image', data.image,
			'telephone', data.telephone,
			'website', data.website,
			'sources', data.sources,
			'is_open_now', is_restaurant_open(data),
			'hours', data.hours,
			'price_range', data.price_range,
			'tag_rankings', data.tag_rankings,
			'tags', ARRAY(
				SELECT json_build_object(
					'taxonomy', json_build_object(
						'name', name,
						'icon', icon,
						'type', type
					)
				) FROM taxonomy
					WHERE id IN (
						SELECT rt.taxonomy_id FROM restaurant_taxonomy rt
						WHERE rt.restaurant_id = data.id
					)
				)
			)
	) FROM (
		SELECT *
		FROM restaurant
		WHERE ST_DWithin(location, ST_MakePoint(?0, ?1), ?2)
		AND (
			(name ILIKE '%' || ?3 || '%' AND ?3 != '')
			OR
			(
				tag_names @> to_json(string_to_array(?4, ','))::jsonb
				AND
				?4 != ''
			)
		)
		ORDER BY rating DESC NULLS LAST
		LIMIT ?5
	) data
	`

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
		query,
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

func handleRequests() {
	port := getEnv("PORT", "10000")
	mux := http.NewServeMux()
	mux.HandleFunc("/", search)
	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func main() {
	db = pg.Connect(&pg.Options{
		User:     "postgres",
		Password: getEnv("POSTGRES_PASSWORD", "postgres"),
		Addr:     getEnv("POSTGRES_HOST", "localhost") + ":5432",
		Database: "dish",
	})
	defer db.Close()
	handleRequests()
}

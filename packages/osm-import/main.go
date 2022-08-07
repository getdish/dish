package main

import (
	"context"
	"fmt"
	"os"

	"github.com/paulmach/osm/osmpbf"
)

func main() {
	f, err := os.Open("./hawaii-amenities.pbf")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	scanner := osmpbf.New(context.Background(), f, 3)
	defer scanner.Close()

	for scanner.Scan() {
		o := scanner.Object()
		fmt.Printf("o: %v\n", o)
		// do something
	}

	scanErr := scanner.Err()
	if scanErr != nil {
		panic(scanErr)
	}
}

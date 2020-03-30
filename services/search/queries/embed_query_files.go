package main

import (
	"io"
	"io/ioutil"
	"os"
	"strings"
)

// Reads all .sql files and encodes them as strings literals in queries.go
func main() {
	folder := "./queries/"
	extenstion := ".sql"
	fs, _ := ioutil.ReadDir(folder)
	out, _ := os.Create("embedded.go")
	out.Write([]byte("package main \n\nconst (\n"))
	for _, f := range fs {
		if strings.HasSuffix(f.Name(), extenstion) {
			out.Write([]byte(strings.TrimSuffix(f.Name(), extenstion) + "_query = `"))
			f, _ := os.Open(folder + f.Name())
			io.Copy(out, f)
			out.Write([]byte("`\n"))
		}
	}
	out.Write([]byte(")\n"))
}

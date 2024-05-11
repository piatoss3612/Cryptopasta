package main

import (
	"fmt"
	"path/filepath"
	"strings"
)

func main() {
	extensions := []string{".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}
	ext := strings.ToLower(filepath.Ext("hello.jpg"))

	fmt.Println(ext)
	for _, e := range extensions {
		if e == ext {
			fmt.Println("true")
		}
	}
}

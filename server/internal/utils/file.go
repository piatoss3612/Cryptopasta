package utils

import (
	"path/filepath"
	"strings"
)

func IsImageFile(filename string) bool {
	extensions := []string{".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}
	ext := strings.ToLower(filepath.Ext(filename))
	for _, e := range extensions {
		if e == ext {
			return true
		}
	}
	return false
}

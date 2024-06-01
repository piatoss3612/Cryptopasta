package sse

import (
	"errors"
	"net/http"
)

type StreamWriter struct {
	w http.ResponseWriter
	f http.Flusher
}

func NewStreamWriter(w http.ResponseWriter, headers ...http.Header) (*StreamWriter, error) {
	f, ok := w.(http.Flusher)
	if !ok {
		return nil, errors.New("streaming unsupported")
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(http.StatusOK)

	for _, header := range headers {
		for k, v := range header {
			w.Header()[k] = v
		}
	}

	return &StreamWriter{w: w, f: f}, nil
}

func (sw *StreamWriter) Write(p []byte) (int, error) {
	defer sw.f.Flush()
	n, err := sw.w.Write(p)
	return n, err
}

func (sw *StreamWriter) Header() http.Header {
	return sw.w.Header()
}

func (sw *StreamWriter) WriteHeader(statusCode int) {
	sw.w.WriteHeader(statusCode)
}

func (sw *StreamWriter) WriteEvent(event *Event) error {
	b, err := event.MarshalBinary()
	if err != nil {
		return err
	}

	_, err = sw.Write(b)
	return err
}

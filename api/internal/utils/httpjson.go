package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

var (
	ErrNotSingleJSONValue = errors.New("request body must contain a single JSON value")
)

const MaxBodyBytes = 1024 * 1024 // 1MB

func ReadJSON(w http.ResponseWriter, r *http.Request, data interface{}) error {
	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	// attempt to decode the data
	err := dec.Decode(data)
	if err != nil {
		return err
	}

	// make sure only one JSON value in payload
	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return ErrNotSingleJSONValue
	}

	return nil
}

func WriteJSON(w http.ResponseWriter, status int, data interface{}, wrap ...string) error {
	// out will hold the final version of the json to send to the client
	var out []byte

	// decide if we wrap the json payload in an overall json tag
	if len(wrap) > 0 {
		// wrapper
		wrapper := make(map[string]interface{})
		wrapper[wrap[0]] = data
		jsonBytes, err := json.Marshal(wrapper)
		if err != nil {
			return err
		}
		out = jsonBytes
	} else {
		// wrapper
		jsonBytes, err := json.Marshal(data)
		if err != nil {
			return err
		}
		out = jsonBytes
	}

	// set the content type & status
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	// write the json out
	_, err := w.Write(out)
	if err != nil {
		return err
	}
	return nil
}

func WriteError(w http.ResponseWriter, status int, errMsg string) {
	// write the error out
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write([]byte(`{"error":"` + errMsg + `"}`))
}

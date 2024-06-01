package sse

import "encoding/json"

type Event struct {
	Type string `json:"type"`
	ID   string `json:"id"`
	Data any    `json:"data"`
}

func (e *Event) MarshalBinary() ([]byte, error) {
	return json.Marshal(e)
}

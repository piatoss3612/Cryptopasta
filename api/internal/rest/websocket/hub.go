package websocket

import (
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var (
	allowOriginFunc = func(r *http.Request) bool {
		return true
	}

	upgrader = websocket.Upgrader{
		HandshakeTimeout: 5 * time.Second,
		ReadBufferSize:   1024,
		WriteBufferSize:  1024,
		CheckOrigin:      allowOriginFunc,
	}

	hub = &Hub{
		register:   make(chan registerRequest),
		unregister: make(chan ID),
		clients:    make(map[ID]*client),
		send:       make(chan Message, 256),
		mu:         &sync.RWMutex{},
	}
)

func init() {
	go hub.run()
}

type Hub struct {
	clients    map[ID]*client
	register   chan registerRequest
	unregister chan ID
	send       chan Message

	mu *sync.RWMutex
}

type registerRequest struct {
	id     ID
	client *client
}

func (h *Hub) run() {
	for {
		select {
		case req := <-h.register:
			h.mu.Lock()
			h.clients[req.id] = req.client
			h.mu.Unlock()
		case id := <-h.unregister:
			h.mu.Lock()
			if client, ok := h.clients[id]; ok {
				close(client.send)
				delete(h.clients, id)
			}
			h.mu.Unlock()
		case msg := <-h.send:
			h.mu.RLock()
			client, ok := h.clients[msg.ID]
			h.mu.RUnlock()
			if ok {
				select {
				case client.send <- msg:
				default:
					h.mu.Lock()
					close(client.send)
					delete(h.clients, msg.ID)
					h.mu.Unlock()
				}
			}

		}
	}
}

func (h *Hub) hasClient(id ID) bool {
	h.mu.RLock()
	defer h.mu.RUnlock()
	_, ok := h.clients[id]
	return ok
}

func Send(msg Message) {
	hub.send <- msg
}

func Unregister(id ID) {
	hub.unregister <- id
}

func ErrorEvent(id ID, eventName, msg string) {
	hub.send <- Message{
		Type: EventMessage,
		ID:   id,
		Event: Event{
			Name:   eventName,
			Status: Error,
			Data:   msg,
		},
	}
}

// Serve godoc
//
//	@Summary		Serve websocket
//	@Description	returns websocket connection
//	@Tags			websocket
//	@Router			/ws [get]
func Serve() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
			return
		}

		id := uuid.New().String()

		client := &client{
			hub:  hub,
			id:   ID(id),
			conn: conn,
			send: make(chan Message, 256),
			mu:   &sync.Mutex{},
		}

		hub.register <- registerRequest{
			id:     ID(id),
			client: client,
		}

		go client.writePump()
		go client.readPump()

		msg := Message{
			Type: IdMessage,
			ID:   ID(id),
		}

		client.send <- msg
	}
}

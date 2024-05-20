package mission

type Message struct {
	Content string `json:"content" bson:"content"`
	IsUser  bool   `json:"isUser" bson:"isUser"`
	Image   string `json:"image,omitempty" bson:"image,omitempty"`
}

type Entry struct {
	ID        string    `json:"id" bson:"_id,omitempty"`
	MissionID string    `json:"missionID" bson:"missionID"`
	Messages  []Message `json:"messages" bson:"messages"`
	CreatedAt int64     `json:"createdAt" bson:"createdAt"`
}

type Mission struct {
	ID        string `json:"id" bson:"_id,omitempty"`
	Title     string `json:"title" bson:"title"`
	AgentID   string `json:"agentID" bson:"agentID"`
	ReportID  string `json:"reportID" bson:"reportID"`
	CreatedAt int64  `json:"createdAt" bson:"createdAt"`
}

type Metadata struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

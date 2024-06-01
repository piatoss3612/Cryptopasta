package agent

type Agent struct {
	ID             string `json:"id" bson:"_id,omitempty"`
	UserID         string `json:"userID" bson:"userID"`
	AgentAddress   string `json:"agentAddress" bson:"agentAddress"`
	AccountAddress string `json:"accountAddress" bson:"accountAddress"`
}

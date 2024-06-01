package agent

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type Store struct {
	client *mongo.Client
	dbname string
}

func NewStore(client *mongo.Client, dbname string) *Store {
	return &Store{client: client, dbname: dbname}
}

func (s *Store) CreateAgent(ctx context.Context, userID, agentAddress, accountAddress string) (*Agent, error) {
	collection := s.client.Database(s.dbname).Collection("agents")

	agent := Agent{
		UserID:         userID,
		AgentAddress:   agentAddress,
		AccountAddress: accountAddress,
	}

	_, err := collection.InsertOne(ctx, agent)
	if err != nil {
		return nil, err
	}

	return &agent, nil
}

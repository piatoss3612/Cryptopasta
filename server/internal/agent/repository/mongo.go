package repository

import (
	"context"
	"cryptopasta/internal/agent"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// mongoRepository is the mongo implementation of agent repository.
type mongoRepository struct {
	agent.Querier
	agent.Commander
}

// NewMongoRepository creates a new agent mongo repository.
func NewMongoRepository(client *mongo.Client, dbname string) *mongoRepository {
	return &mongoRepository{
		Querier:   NewMongoQuery(client, dbname),
		Commander: NewMongoCommand(client, dbname),
	}
}

// mongoQuery is the mongo implementation of agent querier.
type mongoQuery struct {
	client *mongo.Client
	dbname string
}

func NewMongoQuery(client *mongo.Client, dbname string) *mongoQuery {
	return &mongoQuery{client: client, dbname: dbname}
}

func (q *mongoQuery) FindAgentByID(ctx context.Context, id string) (*agent.Agent, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var agent agent.Agent

	filter := bson.M{"_id": objID}

	err = collection.FindOne(ctx, filter).Decode(&agent)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &agent, nil
}

func (q *mongoQuery) FindAgentByUserID(ctx context.Context, userID string) (*agent.Agent, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	var agent agent.Agent

	filter := bson.M{"userID": userID}

	err := collection.FindOne(ctx, filter).Decode(&agent)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &agent, nil
}

func (q *mongoQuery) AgentExists(ctx context.Context, userID string) (bool, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	filter := bson.M{"userID": userID}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// mongoCommand is the mongo implementation of agent commander.
type mongoCommand struct {
	client *mongo.Client
	dbname string
}

func NewMongoCommand(client *mongo.Client, dbname string) *mongoCommand {
	return &mongoCommand{client: client, dbname: dbname}
}

func (c *mongoCommand) CreateAgent(ctx context.Context, userID, agentAddress, accountAddress string) (*agent.Agent, error) {
	collection := c.client.Database(c.dbname).Collection("agents")

	agent := agent.Agent{
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

var (
	_ agent.Repository = (*mongoRepository)(nil)
	_ agent.Querier    = (*mongoQuery)(nil)
	_ agent.Commander  = (*mongoCommand)(nil)
)

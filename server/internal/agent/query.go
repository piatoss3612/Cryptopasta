package agent

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Query struct {
	client *mongo.Client
	dbname string
}

func NewQuery(client *mongo.Client, dbname string) *Query {
	return &Query{client: client, dbname: dbname}
}

func (q *Query) FindAgentByID(ctx context.Context, id string) (*Agent, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var agent Agent

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

func (q *Query) FindAgentByUserID(ctx context.Context, userID string) (*Agent, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	var agent Agent

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

func (q *Query) AgentExists(ctx context.Context, userID string) (bool, error) {
	collection := q.client.Database(q.dbname).Collection("agents")

	filter := bson.M{"userID": userID}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

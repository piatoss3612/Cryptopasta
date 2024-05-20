package mission

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DefaultPage  = 1
	DefaultLimit = 10
)

type MissionQuery struct {
	client *mongo.Client
	dbname string
}

func NewMissionQuery(client *mongo.Client, dbname string) *MissionQuery {
	return &MissionQuery{client: client, dbname: dbname}
}

func (q *MissionQuery) FindMissionByID(ctx context.Context, id string) (*Mission, error) {
	collection := q.client.Database(q.dbname).Collection("missions")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var mission Mission

	filter := bson.M{"_id": objID}

	err = collection.FindOne(ctx, filter).Decode(&mission)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &mission, nil
}

func (q *MissionQuery) FindMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error) {
	collection := q.client.Database(q.dbname).Collection("missions")

	filter := bson.M{"agentID": agentID}

	if lastMissionID != "" {
		objID, err := primitive.ObjectIDFromHex(lastMissionID)
		if err != nil {
			return nil, err
		}

		filter["_id"] = bson.M{"$lt": objID}
	}

	if limit <= 0 {
		limit = DefaultLimit
	}

	opts := options.Find()
	opts.SetSort(bson.M{"_id": -1}) // Sort by _id in descending order
	opts.SetLimit(int64(limit))

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var missions []Mission
	err = cursor.All(ctx, &missions)
	if err != nil {
		return nil, err
	}

	return missions, nil
}

func (q *MissionQuery) FindEntriesByMissionID(ctx context.Context, missionID string, isSummary ...bool) ([]Entry, error) {
	collection := q.client.Database(q.dbname).Collection("entries")

	filter := bson.M{"missionID": missionID}

	opts := options.Find()
	opts.SetSort(bson.M{"createdAt": 1}) // Sort by createdAt in ascending order

	if len(isSummary) > 0 && isSummary[0] {
		opts.SetProjection(bson.M{"content": 1})
		opts.SetLimit(5)
	}

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var entries []Entry
	err = cursor.All(ctx, &entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func (q *MissionQuery) FindEntryByID(ctx context.Context, id string) (*Entry, error) {
	collection := q.client.Database(q.dbname).Collection("entries")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var entry Entry

	filter := bson.M{"_id": objID}

	err = collection.FindOne(ctx, filter).Decode(&entry)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &entry, nil
}

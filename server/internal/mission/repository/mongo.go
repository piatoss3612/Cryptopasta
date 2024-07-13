package repository

import (
	"context"
	"cryptopasta/internal/mission"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const DefaultLimit = 10

var (
	ErrNoMessages          = errors.New("no messages provided")
	ErrEntryNotFound       = errors.New("entry not found")
	ErrInvalidUpdateFields = errors.New("no update fields provided")
)

// mongoRepository is the mongo implementation of agent repository.
type mongoRepository struct {
	mission.Querier
	mission.Commander
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

func (q *mongoQuery) FindMissionByID(ctx context.Context, id string) (*mission.Mission, error) {
	collection := q.client.Database(q.dbname).Collection("missions")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var mission mission.Mission

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

func (q *mongoQuery) FindMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]mission.Mission, error) {
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

	var missions []mission.Mission
	err = cursor.All(ctx, &missions)
	if err != nil {
		return nil, err
	}

	return missions, nil
}

func (q *mongoQuery) MissionExists(ctx context.Context, id string) (bool, error) {
	collection := q.client.Database(q.dbname).Collection("missions")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, err
	}

	filter := bson.M{"_id": objID}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (q *mongoQuery) FindEntryByID(ctx context.Context, id string) (*mission.Entry, error) {
	collection := q.client.Database(q.dbname).Collection("entries")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var entry mission.Entry

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

func (q *mongoQuery) FindEntriesByMissionID(ctx context.Context, missionID string, isSummary ...bool) ([]mission.Entry, error) {
	collection := q.client.Database(q.dbname).Collection("entries")

	filter := bson.M{"missionID": missionID}

	opts := options.Find()
	opts.SetSort(bson.M{"createdAt": 1}) // Sort by createdAt in ascending order

	if len(isSummary) > 0 && isSummary[0] {
		opts.SetSort(bson.M{"createdAt": -1}) // Sort by createdAt in descending order (latest first)
		opts.SetLimit(5)
	}

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var entries []mission.Entry
	err = cursor.All(ctx, &entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func (q *mongoQuery) EntityExists(ctx context.Context, id string) (bool, error) {
	collection := q.client.Database(q.dbname).Collection("entries")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, err
	}

	filter := bson.M{"_id": objID}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

type mongoCommand struct {
	client *mongo.Client
	dbname string
}

func NewMongoCommand(client *mongo.Client, dbname string) *mongoCommand {
	return &mongoCommand{client: client, dbname: dbname}
}

func (c *mongoCommand) CreateMission(ctx context.Context, title, agentID, reportID string) (*mission.Mission, error) {
	collection := c.client.Database(c.dbname).Collection("missions")

	mission := mission.Mission{
		Title:     title,
		AgentID:   agentID,
		ReportID:  reportID,
		CreatedAt: time.Now().Unix(),
	}

	result, err := collection.InsertOne(ctx, mission)
	if err != nil {
		return nil, err
	}

	objID := result.InsertedID.(primitive.ObjectID)

	mission.ID = objID.Hex()

	return &mission, nil
}

func (c *mongoCommand) CreateEntry(ctx context.Context, missionID string, messages []mission.Message) (string, error) {
	collection := c.client.Database(c.dbname).Collection("entries")

	if len(messages) == 0 {
		return "", ErrNoMessages
	}

	entry := mission.Entry{
		MissionID: missionID,
		Messages:  messages,
		CreatedAt: time.Now().Unix(),
		UpdateAt:  time.Now().Unix(),
	}

	result, err := collection.InsertOne(ctx, entry)
	if err != nil {
		return "", err
	}

	objID := result.InsertedID.(primitive.ObjectID)

	return objID.Hex(), nil
}

func (c *mongoCommand) UpdateEntry(ctx context.Context, id string, messages []mission.Message) error {
	collection := c.client.Database(c.dbname).Collection("entries")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": objID}

	update := bson.M{}

	set := bson.M{}

	if len(messages) > 0 {
		set["messages"] = messages
	}

	if len(set) == 0 {
		return ErrInvalidUpdateFields
	}

	set["updateAt"] = time.Now().Unix()

	update["$set"] = set

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return ErrEntryNotFound
	}

	return nil
}

var (
	_ mission.Repository = (*mongoRepository)(nil)
	_ mission.Querier    = (*mongoQuery)(nil)
	_ mission.Commander  = (*mongoCommand)(nil)
)

package mission

import (
	"context"
	"errors"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MissionStore struct {
	client *mongo.Client
	dbname string
}

func NewMissionStore(client *mongo.Client, dbname string) *MissionStore {
	return &MissionStore{client: client, dbname: dbname}
}

func (s *MissionStore) CreateMission(ctx context.Context, title, agentID, reportID string) (*Mission, error) {
	collection := s.client.Database(s.dbname).Collection("missions")

	mission := Mission{
		Title:     title,
		AgentID:   strings.ToLower(agentID),
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

func (s *MissionStore) CreateEntry(ctx context.Context, missionID string, messages []Message) (string, error) {
	collection := s.client.Database(s.dbname).Collection("entries")

	if len(messages) == 0 {
		return "", errors.New("no messages provided")
	}

	entry := Entry{
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

func (s *MissionStore) UpdateEntry(ctx context.Context, id string, messages []Message) error {
	collection := s.client.Database(s.dbname).Collection("entries")

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
		return errors.New("no update fields provided")
	}

	set["updateAt"] = time.Now().Unix()

	update["$set"] = set

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return errors.New("entry not found")
	}

	return nil
}

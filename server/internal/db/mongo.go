package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongoClient(ctx context.Context, uri string) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI("mongodb://root:example@localhost:27017")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	return client, nil
}

type MongoTx struct {
	Client *mongo.Client
	DBName string
}

func NewMongoTx(client *mongo.Client, dbname string) *MongoTx {
	return &MongoTx{Client: client, DBName: dbname}
}

func (tx *MongoTx) Execute(ctx context.Context, callback func(ctx context.Context) (interface{}, error)) (interface{}, error) {
	session, err := tx.Client.StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(ctx)

	return session.WithTransaction(ctx, func(ctx mongo.SessionContext) (interface{}, error) {
		return callback(ctx)
	})
}

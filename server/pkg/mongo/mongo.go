package mongo

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func MustNewClient(ctx context.Context, uri string) *mongo.Client {
	client, err := NewClient(ctx, uri)
	if err != nil {
		log.Fatal("failed to create mongo client", "err", err)
	}

	return client
}

func NewClient(ctx context.Context, uri string) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(uri)
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

type Tx struct {
	Client *mongo.Client
	DBName string
}

func NewTx(client *mongo.Client, dbname string) *Tx {
	return &Tx{Client: client, DBName: dbname}
}

func (tx *Tx) Execute(ctx context.Context, callback func(ctx context.Context) (interface{}, error)) (interface{}, error) {
	session, err := tx.Client.StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(ctx)

	return session.WithTransaction(ctx, func(ctx mongo.SessionContext) (interface{}, error) {
		return callback(ctx)
	})
}

package mongo

import (
	"context"
	"cryptopasta/pkg/db"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// NewClient creates a new mongo client.
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

// MustNewClient creates a new mongo client and fatal if it fails.
func MustNewClient(ctx context.Context, uri string) *mongo.Client {
	client, err := NewClient(ctx, uri)
	if err != nil {
		log.Fatal("failed to create mongo client", "err", err)
	}

	return client
}

// mongoTx is a transaction adapter for mongo.
type mongoTx struct {
	client  *mongo.Client
	dbname  string
	options *options.TransactionOptions
}

// NewTx creates a new mongo transaction.
func NewTx(client *mongo.Client, dbname string, options ...*options.TransactionOptions) *mongoTx {
	tx := &mongoTx{client: client, dbname: dbname, options: nil}
	if len(options) > 0 && options[0] != nil {
		tx.options = options[0]
	}

	return tx
}

// Execute executes the given function in a transaction.
func (tx *mongoTx) Execute(ctx context.Context, fn db.TxFunc) (interface{}, error) {
	// Start a session
	session, err := tx.client.StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(ctx) // End the session when the function returns

	// Start a transaction
	return session.WithTransaction(ctx, func(ctx mongo.SessionContext) (interface{}, error) {
		return fn(ctx)
	}, tx.options)
}

func (tx *mongoTx) Client() interface{} {
	return tx.client
}

package db

import "context"

type TxFunc func(ctx context.Context) (interface{}, error)

type Tx interface {
	Execute(ctx context.Context, fn TxFunc) (interface{}, error)
	Client() interface{}
}

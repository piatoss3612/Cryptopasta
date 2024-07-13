package pinata

import (
	"context"
	"io"
)

// Service is the interface that provides pinata operations.
type Service interface {
	// PinFileToIpfs pins a file to IPFS.
	PinFileToIpfs(ctx context.Context, file io.Reader, filename string) (*PinResponse, error)
	// PinJsonToIpfs pins a JSON to IPFS.
	PinJsonToIpfs(ctx context.Context, data *PinJsonToIpfsRequest) (*PinResponse, error)
}

// PinataMetadata represents the metadata of the file to be pinned.
type PinataMetadata struct {
	Name      string            `json:"name"`
	Keyvalues map[string]string `json:"keyvalues"`
}

// PinJsonToIpfsRequest represents the request to pin a JSON to IPFS.
type PinJsonToIpfsRequest struct {
	PinataContent  interface{}    `json:"pinataContent"`
	PinataMetadata PinataMetadata `json:"pinataMetadata"`
}

// PinResponse represents the response of the pin operation.
type PinResponse struct {
	IpfsHash  string `json:"IpfsHash"`
	PinSize   int    `json:"PinSize"`
	Timestamp string `json:"Timestamp"`
}

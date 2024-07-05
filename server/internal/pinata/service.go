package pinata

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

const (
	PinFileToIpfsUrl  = "https://api.pinata.cloud/pinning/pinFileToIPFS"
	PinJsonToIpfsUrl  = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
	PinListUrl        = "https://api.pinata.cloud/data/pinList"
	FormFieldNameFile = "file"
)

// Implicit interface implementation.
var _ Service = (*service)(nil)

// service is the concrete implementation of the pinata service.
type service struct {
	apiKey string
	secret string
	client *http.Client
}

// Factory function to create a new pinata service.
func NewService(apiKey, secret string, client ...*http.Client) *service {
	svc := &service{
		apiKey: apiKey,
		secret: secret,
		client: http.DefaultClient,
	}

	// If a custom client is provided, use it instead of the default one.
	if len(client) > 0 && client[0] != nil {
		svc.client = client[0]
	}

	return svc
}

func (s *service) PinFileToIpfs(ctx context.Context, file io.Reader, filename string) (*PinResponse, error) {
	body := &bytes.Buffer{} // Create a buffer to store the multipart form data.

	m := multipart.NewWriter(body) // Create a new multipart writer.

	part, err := m.CreateFormFile(FormFieldNameFile, filename) // Create a new form file part.
	if err != nil {
		return nil, err
	}

	// Copy the file content to the part.
	if _, err := io.Copy(part, file); err != nil {
		return nil, err
	}

	m.Close() // Close the multipart writer to write the ending boundary.

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, PinFileToIpfsUrl, body) // Create a new request.
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req) // Perform the request.
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	return readPinResponse(resp) // Read the response.
}

func (s *service) PinJsonToIpfs(ctx context.Context, data *PinJsonToIpfsRequest) (*PinResponse, error) {
	body := &bytes.Buffer{} // Create a buffer to store the JSON data.

	// Encode the JSON data to the buffer.
	if err := json.NewEncoder(body).Encode(data); err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, PinJsonToIpfsUrl, body) // Create a new request.
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req) // Perform the request.
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	return readPinResponse(resp) // Read the response.
}

func (s *service) doRequest(req *http.Request) (*http.Response, error) {
	// Set the required headers.
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("pinata_api_key", s.apiKey)
	req.Header.Set("pinata_secret_api_key", s.secret)

	return s.client.Do(req) // Perform the request.
}

func readPinResponse(resp *http.Response) (*PinResponse, error) {
	var pinResp PinResponse // Create a new pin response.

	defer resp.Body.Close()

	// Decode the response body to the pin response.
	if err := json.NewDecoder(resp.Body).Decode(&pinResp); err != nil {
		return nil, err
	}

	return &pinResp, nil
}

func errorFromResponse(resp *http.Response) error {
	var data map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return err
	}

	if msg, ok := data["error"].(string); ok {
		return fmt.Errorf("pinata error: %s", msg)
	}

	if m, ok := data["error"].(map[string]interface{}); ok {
		if msg, ok := m["details"].(string); ok {
			return fmt.Errorf("pinata error: %s", msg)
		}
	}

	return fmt.Errorf("pinata error: %v", data)
}

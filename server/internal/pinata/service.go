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
	HeaderContentType = "Content-Type"
	ContentTypeJson   = "application/json"
	FormFieldNameFile = "file"
)

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
	body, contentType, err := createFormFile(FormFieldNameFile, filename, file) // Create the form file.
	if err != nil {
		return nil, err
	}

	headers := s.authorizationHeaders()         // Get the authorization headers.
	headers.Set(HeaderContentType, contentType) // Set the content type header.

	resp, err := doRequest(ctx, s.client, http.MethodPost, PinFileToIpfsUrl, body, headers) // Perform the request.
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	return readPinResponse(resp) // Read the response.
}

func (s *service) PinJsonToIpfs(ctx context.Context, data *PinJsonToIpfsRequest) (*PinResponse, error) {
	body, err := encodeJson(data) // Encode the JSON data.
	if err != nil {
		return nil, err
	}

	headers := s.authorizationHeaders()             // Get the authorization headers.
	headers.Set(HeaderContentType, ContentTypeJson) // Set the content type header.

	resp, err := doRequest(ctx, s.client, http.MethodPost, PinJsonToIpfsUrl, body, headers) // Perform the request.
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	return readPinResponse(resp) // Read the response.
}

func (s *service) authorizationHeaders() http.Header {
	headers := http.Header{} // Create a new header.

	headers.Set("pinata_api_key", s.apiKey)
	headers.Set("pinata_secret_api_key", s.secret)

	return headers
}

func doRequest(ctx context.Context, client *http.Client, method, url string, body io.Reader, headers ...http.Header) (*http.Response, error) {
	// Use the default client if none is provided.
	if client == nil {
		client = http.DefaultClient
	}

	// Create a new request with the provided context.
	req, err := http.NewRequestWithContext(ctx, method, url, body) // Create a new request.
	if err != nil {
		return nil, err
	}

	// Set the headers.
	for _, header := range headers {
		for key, values := range header {
			for _, value := range values {
				req.Header.Add(key, value)
			}
		}
	}

	return client.Do(req) // Perform the request.
}

func createFormFile(fieldname, filename string, file io.Reader) (io.Reader, string, error) {
	body := &bytes.Buffer{} // Create a buffer to store the multipart form data.

	m := multipart.NewWriter(body) // Create a new multipart writer.

	part, err := m.CreateFormFile(fieldname, filename) // Create a new form file part.
	if err != nil {
		return nil, "", err
	}

	// Copy the file content to the part.
	if _, err := io.Copy(part, file); err != nil {
		return nil, "", err
	}

	m.Close() // Close the multipart writer to write the ending boundary.

	return body, m.FormDataContentType(), nil
}

func encodeJson(data interface{}) (io.Reader, error) {
	body := &bytes.Buffer{} // Create a buffer to store the JSON data.

	// Encode the JSON data to the buffer.
	if err := json.NewEncoder(body).Encode(data); err != nil {
		return nil, err
	}

	return body, nil
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

// Implicit interface implementation.
var _ Service = (*service)(nil)

package pinata

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"
)

type RoundTripperFunc func(req *http.Request) (*http.Response, error)

func (f RoundTripperFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

func NewTestClient(fn RoundTripperFunc) *http.Client {
	return &http.Client{Transport: fn}
}

func Test_NewService(t *testing.T) {
	// Create a new service with the API key and secret.
	apiKey := "api_key"
	secret := "secret_key"
	client := &http.Client{}

	svc := NewService(apiKey, secret, client)

	// Verify the service.
	if svc.apiKey != apiKey {
		t.Errorf("expected API key %s, got %s", apiKey, svc.apiKey)
	}

	if svc.secret != secret {
		t.Errorf("expected secret key %s, got %s", secret, svc.secret)
	}

	if svc.client != client {
		t.Errorf("expected client %v, got %v", client, svc.client)
	}
}

func TestService_PinFileToIpfs(t *testing.T) {
	apiKey := "api_key"
	secret := "secret_key"
	filename := "test.txt"
	file := strings.NewReader("test file")
	respData := PinResponse{
		IpfsHash:  "QmXtPb1a6v7f7ZQ5",
		PinSize:   123456,
		Timestamp: time.Now().String(),
	}

	roundTrip := func(req *http.Request) (*http.Response, error) {
		// Verify the request.
		if req.Method != http.MethodPost {
			return nil, fmt.Errorf("expected method %s, got %s", http.MethodPost, req.Method)
		}

		if req.URL.String() != PinFileToIpfsUrl {
			return nil, fmt.Errorf("expected URL %s, got %s", PinFileToIpfsUrl, req.URL.String())
		}

		headers := req.Header

		if headers.Get("pinata_api_key") != apiKey {
			return nil, fmt.Errorf("expected API key %s, got %s", apiKey, headers.Get("pinata_api_key"))
		}

		if headers.Get("pinata_secret_api_key") != secret {
			return nil, fmt.Errorf("expected secret key %s, got %s", secret, headers.Get("pinata_secret_api_key"))
		}

		if !strings.Contains(headers.Get("Content-Type"), "multipart/form-data") {
			return nil, fmt.Errorf("expected content type multipart/form-data, got %s", headers.Get("Content-Type"))
		}

		// Get the boundary from the content type.
		boundary := strings.Split(headers.Get("Content-Type"), "boundary=")[1]

		// Read the form file from the request.
		reader := multipart.NewReader(req.Body, boundary)

		form, err := reader.ReadForm(1 << 20)
		if err != nil {
			return nil, fmt.Errorf("failed to read form: %v", err)
		}

		// Verify the form file.
		actualFile := form.File["file"][0]
		if !strings.EqualFold(actualFile.Filename, filename) {
			return nil, fmt.Errorf("expected filename %s, got %s", filename, actualFile.Filename)
		}

		if actualFile.Header.Get("Content-Type") != "application/octet-stream" {
			return nil, fmt.Errorf("expected content type application/octet-stream, got %s", actualFile.Header.Get("Content-Type"))
		}

		// Encode the response data to JSON.

		body := &bytes.Buffer{}
		if err := json.NewEncoder(body).Encode(respData); err != nil {
			return nil, fmt.Errorf("failed to encode JSON: %v", err)
		}

		// Create a new response with the JSON data.
		resp := &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(body),
		}

		return resp, nil
	}

	testClient := NewTestClient(roundTrip)

	svc := NewService(apiKey, secret, testClient)

	// Perform the request.
	actualResp, err := svc.PinFileToIpfs(context.Background(), file, filename)
	if err != nil {
		t.Errorf("failed to pin file to IPFS: %v", err)
	}

	// Verify the response.
	if actualResp.IpfsHash != respData.IpfsHash {
		t.Errorf("expected IPFS hash %s, got %s", respData.IpfsHash, actualResp.IpfsHash)
	}

	if actualResp.PinSize != respData.PinSize {
		t.Errorf("expected pin size %d, got %d", respData.PinSize, actualResp.PinSize)
	}

	if actualResp.Timestamp != respData.Timestamp {
		t.Errorf("expected timestamp %s, got %s", respData.Timestamp, actualResp.Timestamp)
	}
}

func TestService_PinJsonToIpfs(t *testing.T) {
	apiKey := "api_key"
	secret := "secret_key"
	respData := PinResponse{
		IpfsHash:  "QmXtPb1a6v7f7ZQ5",
		PinSize:   123456,
		Timestamp: time.Now().String(),
	}

	roundTrip := func(req *http.Request) (*http.Response, error) {
		// Verify the request.
		if req.Method != http.MethodPost {
			return nil, fmt.Errorf("expected method %s, got %s", http.MethodPost, req.Method)
		}

		if req.URL.String() != PinJsonToIpfsUrl {
			return nil, fmt.Errorf("expected URL %s, got %s", PinJsonToIpfsUrl, req.URL.String())
		}

		headers := req.Header

		if headers.Get("pinata_api_key") != apiKey {
			return nil, fmt.Errorf("expected API key %s, got %s", apiKey, headers.Get("pinata_api_key"))
		}

		if headers.Get("pinata_secret_api_key") != secret {
			return nil, fmt.Errorf("expected secret key %s, got %s", secret, headers.Get("pinata_secret_api_key"))
		}

		if headers.Get("Content-Type") != ContentTypeJson {
			return nil, fmt.Errorf("expected content type %s, got %s", ContentTypeJson, headers.Get("Content-Type"))
		}

		// Encode the response data to JSON.
		body := &bytes.Buffer{}
		if err := json.NewEncoder(body).Encode(respData); err != nil {
			return nil, fmt.Errorf("failed to encode JSON: %v", err)
		}

		// Create a new response with the JSON data.
		resp := &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(body),
		}

		return resp, nil
	}

	testClient := NewTestClient(roundTrip)

	svc := NewService(apiKey, secret, testClient)

	// Perform the request.
	actualResp, err := svc.PinJsonToIpfs(context.Background(), &PinJsonToIpfsRequest{})
	if err != nil {
		t.Errorf("failed to pin JSON to IPFS: %v", err)
	}

	// Verify the response.
	if actualResp.IpfsHash != respData.IpfsHash {
		t.Errorf("expected IPFS hash %s, got %s", respData.IpfsHash, actualResp.IpfsHash)
	}

	if actualResp.PinSize != respData.PinSize {
		t.Errorf("expected pin size %d, got %d", respData.PinSize, actualResp.PinSize)
	}

	if actualResp.Timestamp != respData.Timestamp {
		t.Errorf("expected timestamp %s, got %s", respData.Timestamp, actualResp.Timestamp)
	}
}

func TestService_authorizationHeaders(t *testing.T) {
	svc := &service{
		apiKey: "api_key",
		secret: "secret_key",
	}

	// Get the authorization headers.
	headers := svc.authorizationHeaders()

	// Verify the authorization headers.
	if headers.Get("pinata_api_key") != svc.apiKey {
		t.Errorf("expected API key %s, got %s", svc.apiKey, headers.Get("pinata_api_key"))
	}

	if headers.Get("pinata_secret_api_key") != svc.secret {
		t.Errorf("expected secret key %s, got %s", svc.secret, headers.Get("pinata_secret_api_key"))
	}
}

func Test_createFormFile(t *testing.T) {
	// Create a temporary file to test the function.
	f, err := os.CreateTemp("", "test.txt")
	if err != nil {
		t.Errorf("failed to create test file: %v", err)
	}
	defer f.Close()

	fieldname := "file"
	filename := f.Name()

	// Create a form file using the function.
	body, contentType, err := createFormFile(fieldname, filename, f)
	if err != nil {
		t.Errorf("failed to create form file: %v", err)
	}

	if body == nil {
		t.Error("body is nil")
	}

	// Get the boundary from the content type.
	boundary := strings.Split(contentType, "boundary=")[1]

	// Create a new multipart reader to read the form.
	reader := multipart.NewReader(body, boundary)

	// Read the form to get the form file.
	form, err := reader.ReadForm(1 << 20)
	if err != nil {
		t.Errorf("failed to read form: %v", err)
	}

	// Verify the form file.
	actual := form.File["file"][0]
	if strings.Contains(actual.Filename, filename) {
		t.Errorf("expected filename %s, got %s", filename, actual.Filename)
	}

	if actual.Header.Get("Content-Type") != "application/octet-stream" {
		t.Errorf("expected content type application/octet-stream, got %s", actual.Header.Get("Content-Type"))
	}
}

func Test_encodeJson(t *testing.T) {
	// Create a test object.
	type Greeting struct {
		Greeter string `json:"greeter"`
		Words   string `json:"greeting"`
	}

	obj := Greeting{Greeter: "Alice", Words: "Hello, World!"}

	// Encode the object to JSON.
	body, err := encodeJson(obj)
	if err != nil {
		t.Errorf("failed to encode JSON: %v", err)
	}

	if body == nil {
		t.Error("body is nil")
	}

	// Verify the JSON encoding.
	expected := `{"greeter":"Alice","greeting":"Hello, World!"}`
	actual, err := io.ReadAll(body)
	if err != nil {
		t.Errorf("failed to read body: %v", err)
	}

	if !strings.Contains(string(actual), expected) {
		t.Errorf("expected %s, got %s", expected, string(actual))
	}
}

func Test_errorFromResponse(t *testing.T) {
	tests := []struct {
		name     string
		data     any
		expected string
	}{
		{
			name:     "error message",
			data:     map[string]interface{}{"error": "bad request"},
			expected: "pinata error: bad request",
		},
		{
			name:     "error message with details",
			data:     map[string]interface{}{"error": map[string]interface{}{"details": "this is a bad request"}},
			expected: "pinata error: this is a bad request",
		},
		{
			name:     "error message with unknown data",
			data:     map[string]interface{}{"not_error": "this is not an error"},
			expected: "pinata error: map[not_error:this is not an error]",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Encode the data to JSON.
			body := &bytes.Buffer{}
			if err := json.NewEncoder(body).Encode(tt.data); err != nil {
				t.Errorf("failed to encode JSON: %v", err)
			}

			// Create a new response with the JSON data.
			resp := &http.Response{Body: io.NopCloser(body)}

			// Get the error from the response.
			err := errorFromResponse(resp)
			if err == nil {
				t.Error("expected an error, got nil")
			}

			// Verify the error message.
			if err.Error() != tt.expected {
				t.Errorf("expected %s, got %s", tt.expected, err.Error())
			}
		})
	}
}

func Test_readPinResponse(t *testing.T) {
	data := PinResponse{
		IpfsHash:  "QmXtPb1a6v7f7ZQ5",
		PinSize:   123456,
		Timestamp: time.Now().String(),
	}

	// Encode the data to JSON.
	body := &bytes.Buffer{}
	if err := json.NewEncoder(body).Encode(data); err != nil {
		t.Errorf("failed to encode JSON: %v", err)
	}

	// Create a new response with the JSON data.
	resp := &http.Response{Body: io.NopCloser(body)}

	// Read the pin response from the response.
	pinResp, err := readPinResponse(resp)
	if err != nil {
		t.Errorf("failed to read pin response: %v", err)
	}

	// Verify the pin response.
	if pinResp.IpfsHash != data.IpfsHash {
		t.Errorf("expected IPFS hash %s, got %s", data.IpfsHash, pinResp.IpfsHash)
	}

	if pinResp.PinSize != data.PinSize {
		t.Errorf("expected pin size %d, got %d", data.PinSize, pinResp.PinSize)
	}

	if pinResp.Timestamp != data.Timestamp {
		t.Errorf("expected timestamp %s, got %s", data.Timestamp, pinResp.Timestamp)
	}
}

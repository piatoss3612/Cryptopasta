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

const PinFileToIpfsUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS"
const PinJsonToIpfsUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
const PinListUrl = "https://api.pinata.cloud/data/pinList"
const FormFieldNameFile = "file"

type PinataMetadata struct {
	Name      string            `json:"name"`
	Keyvalues map[string]string `json:"keyvalues"`
}

type PinJsonToIpfsRequest struct {
	PinataContent  interface{}    `json:"pinataContent"`
	PinataMetadata PinataMetadata `json:"pinataMetadata"`
}

type PinResponse struct {
	IpfsHash  string `json:"IpfsHash"`
	PinSize   int    `json:"PinSize"`
	Timestamp string `json:"Timestamp"`
}

type PinataService struct {
	apiKey string
	secret string
	client *http.Client
}

func NewPinataService(apiKey, secret string, client ...*http.Client) *PinataService {
	svc := &PinataService{
		apiKey: apiKey,
		secret: secret,
		client: http.DefaultClient,
	}

	if len(client) > 0 && client[0] != nil {
		svc.client = client[0]
	}

	return svc
}

func (p *PinataService) PinFileToIpfs(ctx context.Context, file io.Reader, filename string) (*PinResponse, error) {
	body := &bytes.Buffer{}

	m := multipart.NewWriter(body)

	part, err := m.CreateFormFile(FormFieldNameFile, filename)
	if err != nil {
		return nil, err
	}

	if _, err := io.Copy(part, file); err != nil {
		return nil, err
	}

	m.Close()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, PinFileToIpfsUrl, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", m.FormDataContentType())
	req.Header.Set("pinata_api_key", p.apiKey)
	req.Header.Set("pinata_secret_api_key", p.secret)

	resp, err := p.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	var pinResp PinResponse

	if err := json.NewDecoder(resp.Body).Decode(&pinResp); err != nil {
		return nil, err
	}

	return &pinResp, nil
}

func (p *PinataService) PinJsonToIpfs(ctx context.Context, data *PinJsonToIpfsRequest) (*PinResponse, error) {
	body := &bytes.Buffer{}

	if err := json.NewEncoder(body).Encode(data); err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, PinJsonToIpfsUrl, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("pinata_api_key", p.apiKey)
	req.Header.Set("pinata_secret_api_key", p.secret)

	resp, err := p.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errorFromResponse(resp)
	}

	var pinResp PinResponse

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

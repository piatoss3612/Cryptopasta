package route

import (
	"cryptopasta-api/internal/service/jwt"
	"cryptopasta-api/internal/service/pinata"
	"cryptopasta-api/internal/utils"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type PinataRoute struct {
	j *jwt.JwtService
	p *pinata.PinataService
}

func NewPinataRoute(j *jwt.JwtService, p *pinata.PinataService) *PinataRoute {
	return &PinataRoute{j: j, p: p}
}

func (p *PinataRoute) Pattern() string {
	return "/pinata"
}

func (p *PinataRoute) Handler() http.Handler {
	r := chi.NewRouter()
	// r.Use(middleware.JwtTokenRequired(p.j))
	r.Post("/pinFile", p.pinFile)
	r.Post("/pinJson", p.pinJson)
	return r
}

// Pin File godoc
//
//	@Tags			ipfs
//	@Summary		Pin File
//	@Description	Pin file to IPFS
//	@Produce		json
//	@Param			file	formData	file	true	"File to pin"
//	@Success		200		{object}	pinata.PinResponse
//	@Failure		400		{string}	string	"Bad Request"
//	@Failure		401		{string}	string	"Unauthorized"
//	@Failure		500		{string}	string	"Internal Server Error"
//	@Router			/pinata/pinFile [post]
//	@Security		BearerAuth
func (p *PinataRoute) pinFile(w http.ResponseWriter, r *http.Request) {
	// 1. get file from form data
	file, info, err := r.FormFile("file")
	if err != nil {
		slog.Error("error getting file", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "file not found")
		return
	}

	defer file.Close()

	// 2. check file extension to be image
	if !utils.IsImageFile(info.Filename) {
		utils.WriteError(w, http.StatusBadRequest, "file is not an image")
		return
	}

	// 3. check the file name to be less than 50 characters
	if len(info.Filename) > 50 {
		utils.WriteError(w, http.StatusBadRequest, "file name is too long")
		return
	}

	// 4. check the file size to be less than 5MB
	if info.Size > 5*1024*1024 {
		utils.WriteError(w, http.StatusBadRequest, "file size is too large")
		return
	}

	// 5. pin the file to IPFS
	resp, err := p.p.PinFileToIpfs(r.Context(), file, info.Filename)
	if err != nil {
		slog.Error("error pinning file", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error pinning file")
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// Pin Json godoc
//
//	@Tags			ipfs
//	@Summary		Pin Json
//	@Description	Pin json to IPFS
//	@Accept			json
//	@Produce		json
//	@Param			request	body		Metadata	true	"Metadata to pin"
//	@Success		200		{object}	pinata.PinResponse
//	@Failure		400		{string}	string	"Bad Request"
//	@Failure		401		{string}	string	"Unauthorized"
//	@Failure		500		{string}	string	"Internal Server Error"
//	@Router			/pinata/pinJson [post]
//	@Security		BearerAuth
func (p *PinataRoute) pinJson(w http.ResponseWriter, r *http.Request) {
	// 1. decode request body
	var req Metadata

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		slog.Error("error while decoding request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// 2. pin the json to IPFS
	resp, err := p.p.PinJsonToIpfs(r.Context(), &pinata.PinJsonToIpfsRequest{
		PinataContent: req,
		PinataMetadata: pinata.PinataMetadata{
			Name: req.Name,
		},
	})
	if err != nil {
		slog.Error("error pinning json", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error pinning json")
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

type Metadata struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

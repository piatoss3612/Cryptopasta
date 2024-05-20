package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// url := "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmfV25HHSLsAetzGEzTQmwXA141AmhpWzfj3tMMDs4EuSL"

	// httpClient := http.DefaultClient

	// resp, err := httpClient.Get(url)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// defer resp.Body.Close()

	// b, err := io.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	clientOptions := options.Client().ApplyURI("mongodb://root:example@localhost:27017")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	log.Println("Connected to MongoDB!")

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Ping to MongoDB successful!")

	bucket, err := gridfs.NewBucket(client.Database("test"))
	if err != nil {
		log.Fatal(err)
	}

	// uploadStream, err := bucket.OpenUploadStream("test.jpg")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer uploadStream.Close()

	// fileSize, err := uploadStream.Write(b)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// log.Printf("Image uploaded successfully with size: %d\n", fileSize)

	downloadStream, err := bucket.OpenDownloadStreamByName("test.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer downloadStream.Close()

	fileBuffer, err := io.ReadAll(downloadStream)
	if err != nil {
		log.Fatal(err)
	}

	// 파일로 저장
	err = os.WriteFile("./downloaded_test_image.jpg", fileBuffer, 0644)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("File downloaded and saved!")

}

#!/bin/bash
sleep 5

mongosh --username root --password example --host mongo1:27017 <<EOF
  rs.initiate({
    "_id": "rs0",
    "version": 1,
    "members": [
        { _id: 0, host: "mongo1:27017" },
        { _id: 1, host: "mongo2:27018" },
    ]
  });
EOF
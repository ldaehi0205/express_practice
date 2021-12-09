const http = require("http");
const express = require("express");
const { sendPosts, endPointMessage } = require("./functions");
const cors = require("cors");
const app = express();
const MongoClient = require("mongodb").MongoClient;

// app.get("/", endPointMessage);
let db;
MongoClient.connect(
  "mongodb+srv://daehee:ldh642@cluster0.gvc4d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  function (error, client) {
    if (error) return console.log(error);

    db = client.db("myFirstDatabase");

    app.listen(8000, function () {
      console.log("listening on 8000");
    });
  }
);

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  db.collection("users")
    .find()
    .toArray(function (error, result) {
      res.status(200).json(result);
    });
});

app.post("/add", function (req, res) {
  db.collection("userCount")
    .find()
    .toArray((err, res) => {
      db.collection("users").insertOne(
        { _id: res.length, name: req.body.name },
        () => {
          console.log("저장완료");
        }
      );
      db.collection("userCount").insertOne({ name: "postNumber" }, () => {
        console.log("저장완료");
      });
    });
});

app.get("/product", sendPosts);

const http = require("http");
const express = require("express");
const { sendPosts, endPointMessage } = require("./functions");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors());
app.get("/", endPointMessage);

app.get("/product", sendPosts);

app.post("/add", function (req, res) {
  console.log(req.body);
  res.send("완료");
});

app.listen(8000, function () {
  console.log("listening on 8080");
});

const http = require("http");
const express = require("express");
const { sendPosts, endPointMessage } = require("./functions");

const app = express();

app.get("/", endPointMessage);

app.get("/product", sendPosts);

const server = http.createServer(app);
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`${PORT} on!`);
});

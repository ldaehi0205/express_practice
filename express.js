const http = require("http");
const express = require("express");
const { sendPosts, endPointMessage } = require("./functions");
const cors = require("cors");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
// const dotenv = require("dotenv");
// dotenv.config();
require("dotenv").config();
app.use(
  session({
    secret: "secret1111",
    resave: false,
    httpOnly: true, //자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    secure: true,
    saveUninitialized: true,
    cookie: {
      // cookie가 사라지는 시간
      maxAge: 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

let db;
MongoClient.connect(process.env.MONGODB_STORE, function (error, client) {
  if (error) return console.log(error);

  db = client.db("myFirstDatabase");

  app.listen(8000, function () {
    console.log("listening on 8000");
  });
});

app.use(express.json());
app.use(
  cors({
    // To allow requests from client
    origin: ["http://localhost:3000"],
    credentials: true,
    // exposedHeaders: ["Set-Cookie"],
    // withCredentials: true,
  })
);

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

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  function (req, res) {
    res.status(200).json(req.session);
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);

          if (!결과) {
            return done(null, false, { message: "존재하지않는 아이디요" });
          }
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  done(null, {});
});

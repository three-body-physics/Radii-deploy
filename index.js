var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000
var passport = require("passport");
var cookieParser = require('cookie-parser');
var secretKey = require("./backend/controller/secret.js");
var DB = require("./backend/controller/controllers");

DB.connectDB();

app.use(require('express-session')({
    secret: secretKey.sessionKey,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(cookieParser());

app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "ejs");

app.use(express.static("./static"));

var routes = require("./backend/routes/router");
app.use("/", routes);
app.listen(port);
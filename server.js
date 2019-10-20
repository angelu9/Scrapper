var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var exphbs = require("express-handlebars");
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine("handlebars", exphbs({ defaultLayout: "main"}));

app.set("view engine", "handlebars");

require("./routes/apiRoutes")(app, db);
require("./routes/htmlRoutes")(app, db);

app.listen(PORT, function() {
    console.log("Listening on port " + PORT);
});
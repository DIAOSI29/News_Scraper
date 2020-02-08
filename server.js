require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 8080;
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
mongoose.set("useCreateIndex", true);

// app.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("hehfhd");
//   client.close();
// });

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.get("/scrape", function(req, res) {
  axios.get("https://www.reuters.com/news/technology").then(function(response) {
    var $cheerio = cheerio.load(response.data);

    $cheerio("article.story").each(function(i, element) {
      var result = {};
      result.Topic = $cheerio(element)
        .children("div.story-content")
        .find("a")
        .find("h3")
        .text()
        .trim();
      result.Url = $cheerio(element)
        .children("div.story-content")
        .find("a")
        .attr("href");
      result.Content = $cheerio(element)
        .children("div.story-content")
        .find("p")
        .text();
      result.ImageUrl = $cheerio(element)
        .children("div.story-photo")
        .find("a>img")
        .attr("org-src");
      console.log(result.Url);
      db.News.create(result)
        .then(function(news) {
          res.json(news);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

app.get("/unsavedNews", function(req, res) {
  db.News.find({ saved: false })
    .then(function(news) {
      res.json(news);
      console.log(news);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/saveNews/:id", function(req, res) {
  db.News.find({ _id: req.param.id })
    .then(function(news) {
      return db.News.findOneAndUpdate(
        { _id: req.params.id },
        { saved: true },
        { new: true }
      );
    })
    .then(function(news) {
      return res.json(news);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

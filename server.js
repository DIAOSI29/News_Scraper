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

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});
app.get("/savedpage", function(req, res) {
  res.sendfile(path.join(__dirname + "./pulic/savedpage.html"));
});

async function AddUniqueNewsItem(newsItem) {
  try {
    let duplicateItem = await db.News.findOne({ Url: newsItem.Url });
    if (duplicateItem == null) {
      return await db.News.create(newsItem);
    } else {
      return duplicateItem;
    }
  } catch (e) {
    console.log(e);
  }
}

app.get("/scrape", async function(req, res) {
  axios
    .get("https://www.reuters.com/news/technology")
    .then(async function(response) {
      var $cheerio = cheerio.load(response.data);
      var results = [];
      $cheerio("article.story").each(async function(i, element) {
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
        let item = await AddUniqueNewsItem(result);
        results.push(item);
      });
      res.json(results);
    });
});

app.get("/unsavedNews", async function(req, res) {
  let data = [];
  let iterations = 0;
  while (data.length === 0 && iterations < 3) {
    iterations++;
    data = await db.News.find({ Saved: false });
  }
  console.log(data);
  res.json(data);
});

app.put("/saveNews/:id", function(req, res) {
  db.News.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { Saved: true } },
    { new: true }
  )
    .then(function(data) {
      res.json(data);
      // console.log(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.get("/savedNews", async function(req, res) {
  let data = [];
  let iterations = 0;
  while (data.length === 0 && iterations < 3) {
    iterations++;
    data = await db.News.find({ Saved: true });
  }

  res.json(data);
});

app.get("/clear", function(res, req) {
  db.News.deleteMany({}, { new: true }).then(function() {});
});

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

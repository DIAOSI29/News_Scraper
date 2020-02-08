$(document).ready(function() {
  var newsContainer = $("#newsContainer");

  function init() {
    console.log("lets do it");
    $.get("/unsavedNews").then(function(data) {
      newsContainer.empty();
      console.log(data);
      if (data && data.length) {
        renderNews(data);
      } else {
        renderEmpty();
      }
    });
  }
  init();

  function renderNews(news) {
    var newsList = [];
    for (var i = 0; i < news.length; i++) {
      newsList.push(createNewsCard(news[i]));
    }
    newsContainer.append(newsList);
  }

  function createNewsCard(news) {
    var cardDiv = $("<div class='card'>");
    var cardHeading = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='news' target='_blank'>")
          .attr("href", news.Url)
          .text(news.Topic),
        $("<a class='btn btn-success save'>Save news</a>")
      )
    );
    var cardBody = $("<div class='card-body'>").text(news.Content);
    var cardImage = $(`<img class='card-image' src=${news.ImageUrl}`);
    cardDiv.append(cardHeading, cardBody, cardImage);

    cardDiv.data("_id", news._id);

    return cardDiv;
  }

  function renderEmpty() {
    var emptyAlert = $("<div class='emptyAlert'");
    emptyAlert.append("<h3 class='alert'>Click Get News To Start!</h3>");
    newsContainer.append(emptyAlert);
  }

  $("#posts").click(function() {
    $.get("/scrape", function(data) {
      init();
    });
  });
  $(".btn btn-success save").click(function() {});
});

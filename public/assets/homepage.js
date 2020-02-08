$(document).ready(function() {
  var newsContainer = $("#newsContainer");

  function init() {
    $.get("/unsavedNews").then(function(data) {
      newsContainer.empty();

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
    newsContainer.append(newsCards);
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
    cardDiv.append(cardHeading, cardBody);

    cardDiv.data("_id", article._id);

    return cardDiv;
  }

  function renderEmpty() {
    var emptyAlert = $("<div class='emptyAlert'");
    emptyAlert.append("<h3 class='alert'>Click Get News To Start!</h3>");
    newsContainer.append(emptyAlert);
  }
});

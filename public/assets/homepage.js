window.onload = function() {
  var newsContainer = $("#newsContainer");
  $(document).on("click", ".btn.save", handleNewsSave);
  $(document).on("click", "#news-scrape", handleNewsScrape);
  $("#clear").on("click", handleNewsClear);

  function initPage() {
    $.get("/unsavedNews").then(function(data) {
      newsContainer.empty();
      // console.log("arrive here?");
      console.log(data);
      if (data && data.length) {
        // console.log("what about here");
        renderNews(data);
      } else {
        // console.log("empty?");
        renderEmpty();
      }
    });
  }
  initPage();

  function renderNews(news) {
    var newsList = [];
    for (var i = 0; i < news.length; i++) {
      newsList.push(createNewsCard(news[i]));
    }
    newsContainer.append(newsList);
  }

  function createNewsCard(news) {
    var newsUrl = "https://www.reuters.com/news/technology" + news.Url;
    var cardDiv = $("<div class=' cardDiv row'>").css(
      "border",
      "2px solid black"
    );
    var col1 = $("<div class='col-4'>");
    var col2 = $("<div class='col-8'>");
    var row1 = $("<div class='row1 row'>");
    var row2 = $("<div class='row2 row'>");

    var cardHeading = $("<div class='col-lg-12'>").append(
      $("<h3>").append(
        $("<a class='news' target='_blank'>")
          .attr("href", newsUrl)
          .text(news.Topic),
        $("<a class='btn btn-success save col-6'>Save news</a>")
      )
    );
    var cardBody = $("<div class=''>").text(news.Content);
    var cardImage = $("<img class='imageDiv'>")
      .attr("src", news.ImageUrl)
      .css("height", "250px");

    col1.append(cardImage);
    row1.append(cardHeading);
    row2.append(cardBody);
    col2.append(row1, row2);
    cardDiv.append(col1, col2);
    cardDiv.data("_id", news._id);
    return cardDiv;
  }

  function renderEmpty() {
    var emptyAlert = $("<h3>")
      .append(
        `。。。。。 There are no news found at the moment.\nClick Get News To Start 。。。。。`
      )
      .addClass("empty-container-info");
    newsContainer.append(emptyAlert);
  }

  function handleNewsScrape() {
    $.get("/scrape").then(function() {
      // console.log("post");
      initPage();
    });
  }

  function handleNewsSave(event) {
    event.stopPropagation();
    var newsToSave = $(this)
      .parents(".cardDiv")
      .data("_id");

    $(this)
      .parents(".cardDiv")
      .remove();

    $.ajax({
      method: "PUT",
      url: "/saveNews/" + newsToSave
    }).then(function(data) {
      // console.log(data.Saved);
      if (data.Saved) {
        initPage();
      }
    });
  }

  function handleNewsClear() {
    $.get("/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }
};

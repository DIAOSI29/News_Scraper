function createSavedNewsCard(news) {
  var newNewsBox = $("<div>");
  newNewsBox.css("display", "inline-block !important");
  newNewsBox.addClass("news-box col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3");
  var newNewsCard = $("<div>");
  newNewsCard.addClass("card");
  var newNewsCardHeader = $("<div>");
  newNewsCardHeader.addClass("card-header");
  newNewsCardHeader.text(news.Topic);
  var newNewsCardImage = $("<img>");
  newNewsCardImage.addClass("card-img");
  newNewsCardImage.attr("src", news.ImageUrl);
  var newNewsCardDescription = $("<div>");
  newNewsCardDescription.addClass("card-body");
  var descriptionText = $("<p>");
  descriptionText.addClass("card-text");
  descriptionText.text(news.Content);

  var newNewsCardButtons = $("<div>");
  newNewsCardButtons.addClass("card-body");
  var commentButton = $("<button>");
  commentButton.addClass("btn btn-primary btn-lg").text("COMMENT");
  var deleteSavedNewsButton = $("<button>");
  deleteSavedNewsButton.addClass("btn btn-warning btn-lg").text("DELETE");
  newNewsBox.append(newNewsCard);
  newNewsCard
    .append(newNewsCardHeader)
    .append(newNewsCardImage)
    .append(newNewsCardDescription);
  newNewsCardDescription.append(descriptionText);

  newNewsCard.append(newNewsCardButtons);
  newNewsCardButtons.append(commentButton).append(deleteSavedNewsButton);
  newNewsBox.data("newsId", news.id);
  commentButton.data("news", news._id);
  deleteSavedNewsButton.data("mews", news._id);
  return newNewsBox;
}

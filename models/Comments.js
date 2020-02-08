var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  PostId: {
    type: String,
    required: true
  }
});

var Comments = mongoose.model("Comments", CommentSchema);

module.exports = Comments;

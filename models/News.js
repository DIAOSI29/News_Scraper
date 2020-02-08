var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PostsSchema = new Schema({
  Topic: {
    type: String,
    unique: true,
    required: true
  },
  Content: {
    type: String,
    unique: true,
    required: true
  },
  ImageUrl: {
    type: String,
    required: true
  },
  Url: {
    type: String,
    required: true
  },
  Comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments"
    }
  ],
  Saved: {
    type: Boolean,
    default: false
  }
});

var Post = mongoose.model("Post", PostsSchema);
module.exports = Post;

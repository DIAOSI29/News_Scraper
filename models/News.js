var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NewsSchema = new Schema({
  Topic: {
    type: String,
    unique: true,
    required: true
  },
  Content: {
    type: String,

    required: true
  },
  ImageUrl: {
    type: String
  },
  Url: {
    type: String
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

var News = mongoose.model("News", NewsSchema);
module.exports = News;

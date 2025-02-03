const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  author: {
    _id: mongoose.Schema.Types.ObjectId,
    username: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);

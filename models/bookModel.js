var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title : String,
  comments : [String]
});

module.exports = mongoose.model('book',bookSchema);

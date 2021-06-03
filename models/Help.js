const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  typology: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = Help = mongoose.model('help', HelpSchema);

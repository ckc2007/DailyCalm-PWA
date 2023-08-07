const { Schema } = require("mongoose");

const cardSchema = new Schema({
  date: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = cardSchema;

const mongoose = require("mongoose");
const Joi = require("joi");

const booksSchema = new mongoose.Schema(
  {
    book: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: true,
      min: 30,
      max: 500,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model("booksSchema", booksSchema);

const pushBookSchema = (obj) => {
  const Schema = Joi.object({
    book: Joi.string().trim().min(2).max(50).required(),
    price: Joi.number().min(30).max(500).required(),
    author: Joi.string().trim().min(2).max(50).required(),
  });
  return Schema.validate(obj);
};
const putBookSchema = (obj) => {
  const Schema = Joi.object({
    book: Joi.string().trim().min(2).max(50),
    price: Joi.number().min(30).max(500),
    author: Joi.string().trim().min(2).max(50),
  });
  return Schema.validate(obj);
};

module.exports = {
  bookModel,
  pushBookSchema,
  putBookSchema,
};

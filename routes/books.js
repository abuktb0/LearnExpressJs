const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { bookModel, pushBookSchema, putBookSchema } = require("../models/Books");

/**
 * @desc // ! Get all books
 * @route /api/books
 * @method GET
 * @access Public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const Books = await bookModel.find();
    res.status(200).json(Books);
  })
);

/**
 * @desc // ! Get By Id
 * @route /api/books/:id
 * @method GET
 * @access Public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await bookModel.findById(req.params.id);
    book
      ? res.status(200).json(book)
      : res.status(404).json({ message: "error 404: Book Not Found" });
  })
);

/**
 * @desc // ! Post Book
 * @route /api/books
 * @method POST
 * @access Public
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { book, price, author } = req.body;
    const { error } = pushBookSchema(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const newBook = new bookModel({ book, price, author });
    const result = await newBook.save();

    res.status(200).json(result);
  })
);

/**
 * @desc // ! Get all books
 * @route /api/books
 * @method PUT
 * @access Public
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { book, price, author } = req.body;
    const { error } = putBookSchema(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const updatedBook = await bookModel.findByIdAndUpdate(
      req.params.id,
      { $set: { book, price, author } },
      { new: true }
    );

    res.status(201).json({message: "Book has been changed", updatedBook})
  })
);

/**
 * @desc // ! delete Book By Id
 * @route /api/books/:id
 * @method DELETE
 * @access Public
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deletedBook = await bookModel.findByIdAndDelete(req.params.id);
    deletedBook
      ? res
          .status(200)
          .json({ message: `Book id (${req.params.id}) has been deleted` })
      : res
          .status(404)
          .json({ message: `Error 404: Book id (${req.params.id}) not Found` });
  })
);

module.exports = router;

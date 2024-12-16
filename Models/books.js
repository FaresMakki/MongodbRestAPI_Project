const mongoose = require("mongoose");

// Define the schema
const bookSchema = new mongoose.Schema({
    bookID: { type: Number, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    average_rating: { type: Number },
    isbn: { type: Number },
    isbn13: { type: String },
    language_code: { type: String },
    num_pages: { type: Number },
    ratings_count: { type: Number },
    text_reviews_count: { type: Number },
    publication_date: { type: String },
    publisher: { type: String }
});

// Create the model
const Book = mongoose.model("book", bookSchema);

module.exports = Book;
const Book = require("../Models/books"); // Import your model



exports.DeleteBookById=async (req,res)=> {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.UpdateBookById=async (req,res)=> {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.InsertNewBook=async (req,res)=> {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.SelectAllBooks=async (req,res)=> {
    try {

        const books = await Book.find();
        console.log(books);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.SelectBookById=async (req,res)=> {
    try {

        const books = await Book.find({ _id: req.params.id });
        console.log(books);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.SelectBookByName=async (req,res)=> {
    try {
        const titleRegex = new RegExp(req.params.name, "i");
        const books = await Book.find({ title: titleRegex });
        console.log(books);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.SelectBooksByAuthor=async (req,res)=> {
    try {
        const authorRegex = new RegExp(req.params.author, "i"); // Case-insensitive regex
        const books = await Book.find({ authors: authorRegex });
        if (books.length > 0) {
            res.json(books);
        } else {
            res.json({ message: "No books found for author" });
        }
    } catch (error) {
        console.error("Error fetching books by author:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


exports.AverageRatingForSpesificBookLanguge=async (req,res)=> {
    try {
        const averageRatingByLanguage = await Book.aggregate([
            {
                $group: {
                    _id: "$language_code", // Group by language_code
                    averageRating: { $avg: "$average_rating" }, // Calculate average rating
                    totalBooks: { $sum: 1 }, // Count books per language
                },
            },
            { $sort: { averageRating: -1 } }, // Sort by averageRating descending
            {
                $project: {
                    language: "$_id",
                    averageRating: { $round: ["$averageRating", 2] }, // Round to 2 decimals
                    totalBooks: 1,
                    _id: 0,
                },
            },
        ]);

        res.json(averageRatingByLanguage);
    } catch (error) {
        console.error("Error fetching average rating by language:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.Top5Books=async (req,res)=> {
    try {
        const topBooks = await Book.aggregate([
            { $match: { language_code: "eng" } }, // Only English books
            { $sort: { average_rating: -1 } }, // Sort by average_rating descending
            { $limit: 5 }, // Get top 5 books
            {
                $project: {
                    title: 1,
                    authors: 1,
                    average_rating: 1,
                    _id: 0,
                },
            },
        ]);

        res.json(topBooks);
    } catch (error) {
        console.error("Error fetching top books:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.BooksByPublishers=async (req,res)=> {
    try {
        const booksByPublisher = await Book.aggregate([
            { $group: { _id: "$publisher", totalBooks: { $sum: 1 } } }, // Group by publisher
            { $sort: { totalBooks: -1 } }, // Sort by totalBooks descending
        ]);

        res.json(booksByPublisher);
    } catch (error) {
        console.error("Error fetching books by publisher:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.AverageRatingTotalReviewsbyAuthor=async (req,res)=> {
    try {
        const ratingsByAuthors = await Book.aggregate([
            {
                $group: {
                    _id: "$authors", // Group by author name
                    averageRating: { $avg: "$average_rating" }, // Calculate average rating
                    totalReviews: { $sum: "$text_reviews_count" }, // Sum total reviews
                },
            },
            { $sort: { averageRating: -1 } }, // Sort by averageRating descending
        ]);

        res.json(ratingsByAuthors);
    } catch (error) {
        console.error("Error calculating ratings by authors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.BooksInLast5Year = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const fiveYearsAgo = currentYear - 5;

        const recentBooks = await Book.aggregate([
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $year: { $toDate: "$publication_date" } },
                            fiveYearsAgo,
                        ],
                    },
                },
            },
            {
                $project: {
                    title: 1,
                    authors: 1,
                    publication_date: 1,
                    _id: 0,
                },
            },
            { $sort: { publication_date: -1 } }, // Sort by recent publication date
        ]);

        res.json(recentBooks);
    } catch (error) {
        console.error("Error fetching recent books:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.AverageRatingsperYear = async (req, res) => {
    try {
        const statsByYear = await Book.aggregate([
            {
                $project: {
                    // Convert publication_date to a Date object and extract the year
                    year: { $year: { $toDate: "$publication_date" } },
                    average_rating: 1,
                },
            },
            {
                $group: {
                    _id: "$year", // Group by year
                    averageRating: { $avg: "$average_rating" },
                },
            },
            { $sort: { _id: 1 } }, // Sort by year ascending
        ]);

        res.json(statsByYear);
    } catch (error) {
        console.error("Error fetching stats by year:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





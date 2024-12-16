const express=require('express')
const router=express.Router();
const books=require("../Controller/books")


router.get("/getall",books.SelectAllBooks)
router.get("/getbook/:id",books.SelectBookById)
router.get("/getbookbyname/:name",books.SelectBookByName)
router.delete("/delete/:id",books.DeleteBookById)
router.put("/update/:id",books.UpdateBookById)
router.post("/insert",books.InsertNewBook)





router.get("/booksbypubliser",books.BooksByPublishers)
router.get("/bookslast5",books.BooksInLast5Year)
router.get("/ratingbylang",books.AverageRatingForSpesificBookLanguge)
router.get("/ratingbyauth",books.AverageRatingTotalReviewsbyAuthor)
router.get("/ratingperyear",books.AverageRatingsperYear)
router.get("/selectbyauther",books.SelectBooksByAuthor)
router.get("/top5",books.Top5Books)




// router.post("/addbooks",books.login)
// router.put("/updatebooks/:id",books.logout)

module.exports=router
require('./Connection')
const express = require('express')
const app = express()
const port = 3005
const book_router=require("./Routes/books")

app.use(express.json());
app.use("/books",book_router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




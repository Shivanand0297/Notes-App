require("dotenv").config()
const cors = require("cors")
const express = require("express")
require("./config/db").connectToDb()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

app.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`)
})
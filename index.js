
require("dotenv").config()

const express = require("express")
const app = express()
app.use(express.urlencoded({
    //POSTリクエストの中身を解析するために必要なコードです。
    extended:true
}))

/* Connecting to MongoDB Atlas . */
const mongoose = require("mongoose")

const session = require("express-session")
const routers = require("./routes")

/* ejs ファイルが使える様にする */
app.set("view engine", "ejs")
/* 画像やCSSを扱うための設定 */
app.use("/public",express.static("public"))

/* sessionの設定 */
app.use(session({
    secret: process.env.SESSION_SECRET || (() => { throw new Error("SESSION_SECRET is not set") })(),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600000}, /* 1時間（セッションの有効期限：ミリ秒単位） */
}))

/* Connecting to MongoDB */
const mongoUri = process.env.MONGODB_URI
if (!mongoUri) throw new Error("MONGODB_URI is not set")

mongoose.connect(mongoUri).then(() => {
    console.log("Success: Connected to MongoDB")
}).catch((error) => {
    console.log("Failure connected MongoDB : "+ error)
})

app.use(routers)

/* Page NotFound . */
app.get("",(req,res)=>{
    res.render("error",{message:"404 Page NotFound"})
})

//Connecting to port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
} )

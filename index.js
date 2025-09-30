
const express = require("express")
const app = express()
app.use(express.urlencoded({
    //POSTリクエストの中身を解析するために必要なコードです。
    extended:true
}))

/* Connecting to MongoDB Atlas . */
const mongoose = require("mongoose")

const session = require("express-session")

/* ejs ファイルが使える様にする */
app.set("view engine", "ejs")
/* 画像やCSSを扱うための設定 */
app.use("/public",express.static("public"))

/* sessionの設定 */
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600000}, /* 1時間（セッションの有効期限：ミリ秒単位） */
}))

mongoose.connect("mongodb+srv://ryuichi114:TahwqnnQottl3Yad@cluster0.tbmzds2.mongodb.net/blogUserDatabase?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Success: Connected to MongoDB")
}).catch((error) => {
    console.log("Failure connected MongoDB : "+ error)
})

/* Schema：データの型:種類を指定 */
const Schema = mongoose.Schema

const BlogSchema = new Schema({
title: String,
summary: String,
image: String,
textBody: String
})

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,//このデータの入力は必須項目であるという意味
    },
    email: {
        type: String,
        required: true,
        unique: true //一意の値となる
    },
    password: {
        type: String,
        required: true,
    },
})

/* Model */
const BlogModel = mongoose.model("Blog", BlogSchema)
const UserModel = mongoose.model("User",UserSchema)

/* Blog create page .*/
app.get("/blog/create", (req, res) => {
    if(req.session.userId){
        //res.sendFile(__dirname + "/views/blogCreate.html")
        res.render("blogCreate")
    } else {
        res.redirect("/user/login")
    }
    
})

app.post("/blog/create", (req, res) => {
    BlogModel.create(req.body).then(() => {
        // res.send("ブログデータの投稿に成功しました：(投稿内容は⇨)"+JSON.stringify(req.body))
        res.redirect("/")
    }).catch((error)=>{//エラーハンドリング
        console.log("データの書き込みに失敗しました:", error)
        //res.send("ブログデータの投稿に失敗しました：(投稿内容は⇨)"+JSON.stringify(req.body))
        res.render("error", {message: "/blog/create のエラー"})
    })

})

/*　Blog read all data page . */
app.get("/", async(req, res) => {
    /* DBからデータを取得する際に処理を待つためasync await を付与 */
    const allBlogs = await BlogModel.find()
    res.render("index",{
        // index.ejs にDBから取得したデータを連携する
        allBlogs:allBlogs,
        session:req.session.userId
    })
})
/*　Blog read single data page . */
app.get("/blog/:id", async(req, res) => {
    /* 
    MongoDBの_idは自動で採番される
    採番されたIDを取得する方法はreq.params.id
    */
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogRead",{
        singleBlog:singleBlog,
        session:req.session.userId
    })
} )

/* Blog update page.  */
app.get("/blog/update/:id", async(req, res) =>{
    const singleBlog = await BlogModel.findById(req.params.id)
    //res.send("個別の記事編集ページを表示します(singleBlog):",singleBlog)
    res.render("blogUpdate", {singleBlog})
    
})
app.post("/blog/update/:id", async(req, res) => {
    await BlogModel.updateOne({_id: req.params.id}, req.body).then(() => {
        res.redirect("/")
    }).catch((error) =>{
        res.render("error", {message: "/blog/updateのエラー:"+ error})
    })
})

/* Blog delete page . */ 
app.get("/blog/delete/:id", async(req, res) => {
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogDelete", {singleBlog})
})
app.post("/blog/delete/:id", async(req,res)=>{
    await BlogModel.deleteOne({_id:req.params.id}).then(()=>{
        res.render("/")
    }).catch((error)=>{
        res.render("error", {message: "/blog/deleteのエラー:" + error})
    })
})

/* User create Page */
app.get("/user/create/", async(req, res)=>{
    res.render("userCreate")
})
app.post("/user/create/", async(req, res)=>{
    UserModel.create(req.body).then(()=>{
        res.render("/user/login")
    }).catch((error) => {
        console.log("❌ User create default !", error)
        res.send("User create default !")
        res.render("error",{message:"/user/createのエラー:"+error})
    })
})

/* User login page . */
app.get("/user/login",(req,res)=>{
    res.render("login")
})

app.post("/user/login", (req, res) =>{
    /*
    クライアント（ブラウザ）から、サーバーにユーザーデータを送る必要がある
    1. ユーザー情報がDBにあるのかを確認する
    2. mail は一意の情報がDBに存在するので、mailが存在するかどうかをまずチェック
    3. passwordが一致する場合、req.session.userIdにMongoDBの_idを挿入する
    4. 
    */
   UserModel.findOne({email:req.body.email}).then((savedData) =>{
    if(savedData){
        if(req.body.password === savedData.password){
            // MongoDB の_id を挿入
            req.session.userId = savedData._id.toString()
            res.redirect("/")
        }else{
            res.render("error", {message:"/user/loginのエラー：パスワードが間違っています"})
        }
    }else {
        res.render("error", {message:"/user/loginのエラー：ユーザーが存在していません"})
    }
   }).catch((error) => {
        /* 例えばWifi OFFなどにする発生する */
        res.render("error", {message:"/user/loginのエラー：エラーが発生しました:"+error})
   })
})


//Connecting to port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
} )


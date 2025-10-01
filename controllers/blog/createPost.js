const BlogModel = require("../../models/blog")

module.exports = async(req, res) => { 
   await BlogModel.create(req.body).then(() => {
        // res.send("ブログデータの投稿に成功しました：(投稿内容は⇨)"+JSON.stringify(req.body))
        res.redirect("/")
    }).catch((error)=>{//エラーハンドリング
        console.log("データの書き込みに失敗しました:", error)
        //res.send("ブログデータの投稿に失敗しました：(投稿内容は⇨)"+JSON.stringify(req.body))
        res.render("error", {message: "/blog/create のエラー"})
    })

}
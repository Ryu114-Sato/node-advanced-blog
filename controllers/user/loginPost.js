
const UserModel = require("../../models/user")

module.exports = async(req, res) => { 
    /*
    クライアント（ブラウザ）から、サーバーにユーザーデータを送る必要がある
    1. ユーザー情報がDBにあるのかを確認する
    2. mail は一意の情報がDBに存在するので、mailが存在するかどうかをまずチェック
    3. passwordが一致する場合、req.session.userIdにMongoDBの_idを挿入する
    4. 
    */
 await UserModel.findOne({email:req.body.email}).then((savedData) =>{
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
}
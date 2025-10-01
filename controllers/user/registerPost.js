const UserModel = require("../../models/user")

module.exports = async(req, res) => { 
    await UserModel.create(req.body).then(()=>{
        res.render("/user/login")
    }).catch((error) => {
        console.log("❌ User create default !", error)
        res.send("User create default !")
        res.render("error",{message:"/user/createのエラー:"+error})
    })
}
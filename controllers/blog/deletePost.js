
const BlogModel = require("../../models/blog")

module.exports = async(req, res) => { 
    await BlogModel.deleteOne({_id:req.params.id}).then(()=>{
        res.render("/")
    }).catch((error)=>{
        res.render("error", {message: "/blog/deleteのエラー:" + error})
    })
}
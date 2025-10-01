const BlogModel = require("../../models/blog")

module.exports = async(req, res) => { 
    await BlogModel.updateOne({_id: req.params.id}, req.body).then(() => {
        res.redirect("/")
    }).catch((error) =>{
        res.render("error", {message: "/blog/updateのエラー:"+ error})
    })
}

const BlogModel = require("../../models/blog")

/*　Blog read single data page . */
module.exports = async(req, res) => { 
    /* 
    MongoDBの_idは自動で採番される
    採番されたIDを取得する方法はreq.params.id
    */
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogRead",{
        singleBlog:singleBlog,
        session:req.session.userId
    })
}
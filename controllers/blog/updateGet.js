const BlogModel = require("../../models/blog")

/* Blog update page.  */
module.exports = async(req, res) => { 
    const singleBlog = await BlogModel.findById(req.params.id)
    //res.send("個別の記事編集ページを表示します(singleBlog):",singleBlog)
    res.render("blogUpdate", {singleBlog})
    
}
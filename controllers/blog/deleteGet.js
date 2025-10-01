/* Connecting to MongoDB Atlas . */
const BlogModel = require("../../models/blog")

/* Blog delete page . */ 
module.exports = async(req, res) => { 
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogDelete", {singleBlog})
}
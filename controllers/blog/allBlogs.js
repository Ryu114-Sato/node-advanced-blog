
const BlogModel = require("../../models/blog")

/*　Blog read all data page . */
module.exports = async(req,res) => {
    /* DBからデータを取得する際に処理を待つためasync await を付与 */
    const allBlogs = await BlogModel.find()
    res.render("index",{
        // index.ejs にDBから取得したデータを連携する
        allBlogs:allBlogs,
        session:req.session.userId
    })
}
/* Connecting to MongoDB Atlas . */
const mongoose = require("mongoose")

/* Schema：データの型:種類を指定 */
const Schema = mongoose.Schema

const BlogSchema = new Schema({
title: String,
summary: String,
image: String,
textBody: String
})

/* Model */
const BlogModel = mongoose.model("Blog", BlogSchema)

module.exports = BlogModel

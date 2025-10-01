/* Connecting to MongoDB Atlas . */
const mongoose = require("mongoose")

/* Schema：データの型:種類を指定 */
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,//このデータの入力は必須項目であるという意味
    },
    email: {
        type: String,
        required: true,
        unique: true //一意の値となる
    },
    password: {
        type: String,
        required: true,
    },
})

/* Model */
const UserModel = mongoose.model("User",UserSchema)

module.exports = UserModel

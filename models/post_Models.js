const mongoose = require("mongoose");

const post_Schema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },

    writing: String,

    img_post: String,

    video_post: String,

    likes :[{
            type : mongoose.Schema.ObjectId,
            ref : "user"
    }],

    comments : [{
        comment : String,
        user_comment : {
            type : mongoose.Schema.ObjectId,
            ref : "user"
        }
    }],

    type: {
        type: String,
        default: "post",
        required: true
    },

},{timestamps: true})


const post_model = mongoose.model("post", post_Schema)

module.exports = post_model
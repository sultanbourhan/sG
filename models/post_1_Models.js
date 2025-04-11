const mongoose = require("mongoose");

const post_1_Schema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },

    box1 : {
        postImage_1 : String,
        word_1 : String
    },
    box2 : {
        postImage_2 : String,
        word_2 : String
    },
    box3 : {
        postImage_3 : String,
        word_3 : String
    },
    box4 : {
        postImage_4 : String,
        word_4 : String
    },
    box5 : {
        postImage_5 : String,
        word_5 : String
    },

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
        default: "post_1",
        required: true
    },

},{timestamps: true})


const post_1_model = mongoose.model("post_1", post_1_Schema)

module.exports = post_1_model
const mongoose = require("mongoose");

const post_2_Schema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },

    question_1 : {
        question : String,
        Answer_1 : String,
        Answer_2 : String,
        Answer_3 : String,
        Answer_4 : String,
    },

    question_2 : {
        question : String,
        Answer_1 : String,
        Answer_2 : String,
        Answer_3 : String,
        Answer_4 : String,
    },

    question_3 : {
        question : String,
        Answer_1 : String,
        Answer_2 : String,
        Answer_3 : String,
        Answer_4 : String,
    },

    question_4 : {
        question : String,
        Answer_1 : String,
        Answer_2 : String,
        Answer_3 : String,
        Answer_4 : String,
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
        default: "post_2",
        required: true
    },

    

},{timestamps: true})


const post_2_model = mongoose.model("post_2", post_2_Schema)

module.exports = post_2_model
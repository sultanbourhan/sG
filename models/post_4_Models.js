const mongoose = require("mongoose");

const post_4_Schema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },

    question_1_img : String,
    question_1_word_1 : String,
    question_1_word_2 : String,
    question_1_word_3 : String,
    question_1_word_4 : String,

    question_2_img : String,
    question_2_word_1 : String,
    question_2_word_2 : String,
    question_2_word_3 : String,
    question_2_word_4 : String,

    question_3_img : String,
    question_3_word_1 : String,
    question_3_word_2 : String,
    question_3_word_3 : String,
    question_3_word_4 : String,

    question_4_img : String,
    question_4_word_1 : String,
    question_4_word_2 : String,
    question_4_word_3 : String,
    question_4_word_4 : String,



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
        default: "post_4",
        required: true
    },

},{timestamps: true})


const post_4_model = mongoose.model("post_4", post_4_Schema)

module.exports = post_4_model
const { check, body } = require("express-validator");
const validationMiddiel = require("./validationResulte");
const Post = require("../models/post_1_Models");


// =================================================================


exports.createPost_1_V =[

  check("postImage_1")
  .notEmpty().withMessage("Add a photo"),

  check("word_1")
  .notEmpty().withMessage("Add a word"),

  check("postImage_2")
  .notEmpty().withMessage("Add a photo"),

  check("word_2")
  .notEmpty().withMessage("Add a word"),

  check("postImage_3")
  .notEmpty().withMessage("Add a photo"),

  check("word_3")
  .notEmpty().withMessage("Add a word"),

  check("postImage_4")
  .notEmpty().withMessage("Add a photo"),

  check("word_4")
  .notEmpty().withMessage("Add a word"),

  check("postImage_5")
  .notEmpty().withMessage("Add a photo"),

  check("word_5")
  .notEmpty().withMessage("Add a word"),

  validationMiddiel,

]

exports.createPost_2_V = [
  check("question_1.question")
  .notEmpty().withMessage("Add a question"),
  check("question_1.Answer_1")
  .notEmpty().withMessage("Add a Answer 1"),
  check("question_1.Answer_2")
  .notEmpty().withMessage("Add a Answer 2"),
  check("question_1.Answer_3")
  .notEmpty().withMessage("Add a Answer 3"),
  check("question_1.Answer_4")
  .notEmpty().withMessage("Add a Answer 4"),

  check("question_2.question")
  .notEmpty().withMessage("Add a question"),
  check("question_2.Answer_1")
  .notEmpty().withMessage("Add a Answer 1"),
  check("question_2.Answer_2")
  .notEmpty().withMessage("Add a Answer 2"),
  check("question_2.Answer_3")
  .notEmpty().withMessage("Add a Answer 3"),
  check("question_2.Answer_4")
  .notEmpty().withMessage("Add a Answer 4"),

  check("question_3.question")
  .notEmpty().withMessage("Add a question"),
  check("question_3.Answer_1")
  .notEmpty().withMessage("Add a Answer 1"),
  check("question_3.Answer_2")
  .notEmpty().withMessage("Add a Answer 2"),
  check("question_3.Answer_3")
  .notEmpty().withMessage("Add a Answer 3"),
  check("question_3.Answer_4")
  .notEmpty().withMessage("Add a Answer 4"),

  check("question_4.question")
  .notEmpty().withMessage("Add a question"),
  check("question_4.Answer_1")
  .notEmpty().withMessage("Add a Answer 1"),
  check("question_4.Answer_2")
  .notEmpty().withMessage("Add a Answer 2"),
  check("question_4.Answer_3")
  .notEmpty().withMessage("Add a Answer 3"),
  check("question_4.Answer_4")
  .notEmpty().withMessage("Add a Answer 4"),

  validationMiddiel,
]

exports.createPost_3_V = [
  check("question_1.question")
  .notEmpty().withMessage("Add a question 1"),
  check("question_1.condition")
  .notEmpty().withMessage("Add a condition 1"),
  
  check("question_2.question")
  .notEmpty().withMessage("Add a question 2"),
  check("question_1.condition")
  .notEmpty().withMessage("Add a condition 2"),

  check("question_3.question")
  .notEmpty().withMessage("Add a question 3"),
  check("question_3.condition")
  .notEmpty().withMessage("Add a condition 3"),

  check("question_4.question")
  .notEmpty().withMessage("Add a question 4"),
  check("question_4.condition")
  .notEmpty().withMessage("Add a condition 4"),

  check("question_5.question")
  .notEmpty().withMessage("Add a question 5"),
  check("question_5.condition")
  .notEmpty().withMessage("Add a condition 5"),

  validationMiddiel,
]

exports.createPost_4_V = [
  check("question_1_img")
  .notEmpty().withMessage("Add a photo"),
  check("question_1_word_1")
  .notEmpty().withMessage("Add a word"),
  check("question_1_word_2")
  .notEmpty().withMessage("Add a word"),
  check("question_1_word_3")
  .notEmpty().withMessage("Add a word"),
  check("question_1_word_4")
  .notEmpty().withMessage("Add a word"),

  check("question_2_img")
  .notEmpty().withMessage("Add a photo"),
  check("question_2_word_1")
  .notEmpty().withMessage("Add a word"),
  check("question_2_word_2")
  .notEmpty().withMessage("Add a word"),
  check("question_2_word_3")
  .notEmpty().withMessage("Add a word"),
  check("question_2_word_4")
  .notEmpty().withMessage("Add a word"),

  check("question_3_img")
  .notEmpty().withMessage("Add a photo"),
  check("question_3_word_1")
  .notEmpty().withMessage("Add a word"),
  check("question_3_word_2")
  .notEmpty().withMessage("Add a word"),
  check("question_3_word_3")
  .notEmpty().withMessage("Add a word"),
  check("question_3_word_4")
  .notEmpty().withMessage("Add a word"),

  check("question_4_img")
  .notEmpty().withMessage("Add a photo"),
  check("question_4_word_1")
  .notEmpty().withMessage("Add a word"),
  check("question_4_word_2")
  .notEmpty().withMessage("Add a word"),
  check("question_4_word_3")
  .notEmpty().withMessage("Add a word"),
  check("question_4_word_4")
  .notEmpty().withMessage("Add a word"),


  validationMiddiel,
]

exports.createPost_V = [
  body().custom((body) => {
    if (!body.writing && !body.img_post && !body.video_post) {
      throw new Error("The entry must contain at least one text, image, or video.");
    }
    return true;
  }),
  validationMiddiel,
];

exports.create_post_comments_V = [
  check("comment")
  .notEmpty().whitelist("A comment must be added.")
  ,
  validationMiddiel,
]
























exports.deletePost_1_V = [
  check("id")
    .isMongoId()
    .withMessage("Post not found")
    .custom((val) =>
      Post.findById(val).then((post) => {
        if (!post) {
          throw new Error(`Post not found id: ${val}`);
        }
      })
    ),
  validationMiddiel,
];

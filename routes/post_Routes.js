const express = require("express");

const {
  uploadImages,
  resizeImg_postImage_1,
  resizeImg_postImage_2,
  resizeImg_postImage_3,
  resizeImg_postImage_4,
  resizeImg_postImage_5,
  resizeImg_question_1_img,
  resizeImg_question_2_img,
  resizeImg_question_3_img,
  resizeImg_question_4_img,
  resizeImg_post_img,
  resizeVideo_video_post,
  createPost,
  createPost_1,
  createPost_2,
  createPost_3,
  createPost_4,
  getAllPosts,
  getUserPosts,
  get_my_Posts,
  deletePost,
  create_post_comments,
  toggle_post_like
} = require("../services/post_Servicrs");

const {createPost_1_V ,createPost_2_V, createPost_3_V,createPost_4_V,create_post_comments_V, createPost_V} = require("../validationResulterror/v_post_1")


const { check_login, check_user_role } = require("../services/authServicrs");

const post_routes = express.Router();

post_routes.route("/post")
.post(check_login,check_user_role("employee","admin"),uploadImages,resizeImg_post_img,resizeVideo_video_post ,createPost_V,createPost)

post_routes.route("/post_1")
.post(check_login,check_user_role("employee","admin"),uploadImages,resizeImg_postImage_1,resizeImg_postImage_2,resizeImg_postImage_3,resizeImg_postImage_4,resizeImg_postImage_5,createPost_1_V,createPost_1)

post_routes.route("/post_2")
.post(check_login,check_user_role("employee","admin"),createPost_2_V,createPost_2)

post_routes.route("/post_3")
.post(check_login,check_user_role("employee","admin"),createPost_3_V,createPost_3)

post_routes.route("/post_4")
.post(check_login,check_user_role("employee","admin"),uploadImages,resizeImg_question_1_img,resizeImg_question_2_img,resizeImg_question_3_img,resizeImg_question_4_img,createPost_4_V,createPost_4)

post_routes.route("")
.get(check_login,getAllPosts)

post_routes.route("/get_my_Posts")
.get(check_login,get_my_Posts)

post_routes.route("/getUserPosts/:userId")
.get(check_login,getUserPosts)

post_routes.route("/:id")
.delete(check_login,check_user_role("employee","admin"),deletePost)

post_routes.route("/create_post_comments/:id")
.post(check_login,create_post_comments_V,create_post_comments)

post_routes.route("/toggle_post_like/:id")
.post(check_login,toggle_post_like)


module.exports = post_routes;

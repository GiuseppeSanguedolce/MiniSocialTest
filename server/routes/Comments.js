const express = require("express");
const router = express.Router();
const { Comments } = require("../models");

const {validateToken} = require("../middlewares/AuthMIddleware");
const { where } = require("sequelize");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const { commentBody, PostId } = req.body;

  // Usa le informazioni estratte dal token JWT
  const username = req.user.username;

  const newComment = await Comments.create({
    commentBody,
    PostId,
    username,
  });

  res.json(newComment);
});

router.delete("/:commentId",validateToken,async (req,res) => {
  const commentId = req.params.commentId;

  Comments.destroy({where: {
    id: commentId,
  },

  });
  res.json("comment deleted");
});

module.exports = router;
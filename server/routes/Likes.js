const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("/Users/giuseppesanguedolce/Desktop/sviluppo/progetti personali/MiniSocialTestFullStack/server/middlewares/AuthMIddleware.js");






router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  // Cerca se esiste già un Like
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (!found) {
    // ❌ Non esiste → lo creiamo (like)
    await Likes.create({ PostId: PostId, UserId: UserId });
    return res.json("Liked the Post");
  }

  // ✅ Esiste già → lo cancelliamo (dislike)
  await Likes.destroy({
    where: { PostId: PostId, UserId: UserId },
  });
  res.json("unliked the post");
});

module.exports = router;
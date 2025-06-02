const express = require("express");
const router = express.Router();
const { Posts,Users,Likes } = require("../models");
const { validateToken } = require("/Users/giuseppesanguedolce/Desktop/sviluppo/progetti personali/MiniSocialTestFullStack/server/middlewares/AuthMIddleware.js");

// 📥 Prendi tutti i post
router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Users, Likes] });
  res.json(listOfPosts);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id, {
    include: [Users], // ✅ IMPORTANTE
  });
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes, Users]
  })
  res.json(listOfPosts);
});

// 📝 Crea un nuovo post - solo se loggato
router.post("/", validateToken, async (req, res) => {
  const post = req.body;

  // ✅ Assegna l'utente autenticato
  post.UserId = req.user.id;

  await Posts.create(post);
  res.json(post);
});

router.delete("/:id", validateToken, async (req, res) => {
  const postId = req.params.id;

  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json({ message: "Post deleted successfully" });
});

// ✅ PUT per aggiornare un post
router.put("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const { title, postText } = req.body;

  // Optional: puoi aggiungere controllo sull’autore
  const post = await Posts.findByPk(id);
  if (post.UserId !== req.user.id) {
    return res.status(403).json({ error: "Non sei autorizzato a modificare questo post" });
  }

  await Posts.update({ title, postText }, { where: { id } });
  res.json({ message: "Post aggiornato con successo" });
});
module.exports = router;
// 📦 Importa il modulo Express per creare il router
const express = require("express");

// 🧭 Crea un nuovo router di Express per definire le rotte
const router = express.Router();

// 📦 Importa il modello "Users" dal file dei modelli (models/index.js)
const { Users } = require("../models");

// 🔐 Importa bcrypt per criptare le password
const bcrypt = require("bcrypt");

// 🔑 Importa la funzione `sign` da jsonwebtoken per generare il token JWT
const { sign } = require("jsonwebtoken");
const {validateToken} = require("../middlewares/AuthMIddleware");

// 📤 Rotta POST per registrazione utente
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Cripta la password
  bcrypt.hash(password, 10).then((hash) => {
    // Crea l'utente con la password criptata
    Users.create({
      username: username,
      password: hash,
    }).then(() => {
      res.json("Utente creato con successo");
    });
  }).catch((err) => {
    console.error("❌ Errore durante l'hashing della password:", err);
    res.status(500).json({ error: "Errore durante la creazione dell'utente" });
  });
});


// 🔐 Rotta POST per login utente
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Cerca l'utente nel DB
  const user = await Users.findOne({ where: { username: username } });

  // Se non trovato, restituisci errore
  if (!user) return res.json({ error: "User Doesn't Exist" });

  // Confronta la password inserita con l'hash salvato
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) return res.json({ error: "Wrong Username And Password Combination" });

    // ✅ Se la password combacia, crea un token JWT
    const accessToken = sign(
      { username: user.username, id: user.id }, // payload
      "importantsecret" // chiave segreta
    );

    // Invia il token al client
    res.json({ token: accessToken, username: user.username, id: user.id });
  });
});



router.get('/auth',validateToken,(req,res) => {
  res.json(req.user);
})

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] }
  });

  res.json(basicInfo);
});



router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ where: { username: req.user.username } });

  if (!user) return res.json({ error: "Utente non trovato" });

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.json({ error: "Password attuale errata" });

  const hash = await bcrypt.hash(newPassword, 10);
  await Users.update({ password: hash }, { where: { username: req.user.username } });

  res.json({ message: "Password aggiornata" });
});


// 🚀 Esporta il router per poterlo usare nel file principale (index.js)
module.exports = router;
const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.headers["accesstoken"]; // 👈 tutto minuscolo

  if (!accessToken) {
    return res.json({ error: "Utente non autenticato!" });
  }

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    next();
  } catch (err) {
    return res.json({ error: "Token non valido!" });
  }
};

module.exports = { validateToken };
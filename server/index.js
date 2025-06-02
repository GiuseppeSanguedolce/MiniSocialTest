const express = require("express"); // Importa Express
const app = express(); // Crea l'applicazione Express
const cors = require('cors');


app.use(cors());


const db = require("./models"); // Importa i modelli (inclusa la connessione DB)
const postRouter = require("./routes/Post"); // Importa le rotte per i post

app.use(express.json()); // Permette di leggere JSON nel body delle richieste
app.use("/posts", postRouter); // Tutte le rotte inizieranno con /posts


const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// Sincronizza i modelli col database e poi avvia il server
db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});



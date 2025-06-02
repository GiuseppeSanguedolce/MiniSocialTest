// models/Likes.js
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {}, {}); // nessun campo definito manualmente

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });

    Likes.belongsTo(models.Posts, {
      foreignKey: "PostId",
      onDelete: "CASCADE",
    });
  };

  return Likes;
};
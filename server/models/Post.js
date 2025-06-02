// 📁 models/Posts.js
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, { foreignKey: "UserId", onDelete: "cascade" });
    Posts.hasMany(models.Comments, { onDelete: "cascade" });
    Posts.hasMany(models.Likes, { onDelete: "cascade" });
  };

  return Posts;
};

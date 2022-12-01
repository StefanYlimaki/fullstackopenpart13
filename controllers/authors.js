const router = require("express").Router();

const { User, Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
  // find all authors and return fields:
  // author: authors name
  // likes: SUM of all likes of the authors blogs
  // blogs: AMOUNT of all blogs of the author
  // order by likes, Descending
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("SUM", sequelize.col("likes")), 'likes'],
      [sequelize.fn("COUNT", sequelize.col("id")), 'blogs'],
    ],
    group: "author",
    order: [
        ['likes', 'DESC']
    ]
  });
  res.json(authors);
});

module.exports = router;

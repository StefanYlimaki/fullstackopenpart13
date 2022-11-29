const router = require("express").Router();

const { User, Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
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
  console.log(JSON.stringify(authors, null, 2));
  res.json(authors);
});

module.exports = router;

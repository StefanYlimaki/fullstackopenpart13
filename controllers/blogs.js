const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

// Helper function to finding blogs by primary key
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

/*** GET-REQUESTS ****/
router.get("/", async (req, res) => {
  let search = req.query.search;
  // If search-variable is not given, set it to empty string
  if (search === undefined) {
    search = "";
  }

  // Find all blogs which title or author contains the search word
  // Order by likes, Descending
  const blogs = await Blog.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ],
    },
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

// Find the single blog based on given id
router.get("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** PUT-REQUESTS ****/
router.put("/:id", blogFinder, async (req, res, next) => {
  // blog based on id, got from helper function blogFinder
  const blog = req.blog;

  // If blog exists, set likes to be what was spesified in req.body.likes
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** POST-REQUESTS ****/
router.post("/", tokenExtractor, async (req, res) => {
  // authorizating the request
  const user = await User.findByPk(req.decodedToken.id);
  // creating blog based on req.body + adding userId to be authorized user 
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

/*** DELETE-REQUESTS ****/
router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  // authorizating the request
  const user = await User.findByPk(req.decodedToken.id);

  // if blog with that id was found and authorized user owns created the blog
  // delete the blog
  if (req.blog && req.blog.userId === user.id) {
    await req.blog.destroy();
  } else {
    res.status(404).json("Can not delete someone else's blogposts");
  }
});

module.exports = router;

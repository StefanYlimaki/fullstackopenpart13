const router = require("express").Router();
const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

/*** GET-REQUESTS ****/
router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});
router.get("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** PUT-REQUESTS ****/
router.put("/:id", blogFinder, async (req, res, next) => {
  const blog = req.blog;
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** POST-REQUESTS ****/
router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

/*** DELETE-REQUESTS ****/
router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

module.exports = router;

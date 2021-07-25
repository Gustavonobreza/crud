const express = require("express");
const PostsService = require("../services/posts");

const route = express.Router();

const postsService = new PostsService();

// Get all posts
route.get("/", async (req, res, next) => {
  try {
    const posts = await postsService.getAll();
    return res.json(posts);
  } catch (e) {
    next(e);
  }
});

// Create post
route.post("/", async (req, res, next) => {
  const body = req.body || {};

  try {
    const post = await postsService.create(body);
    return res.json(post);
  } catch (e) {
    next(e);
  }
});

// Get one by id
route.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const posts = await postsService.getById(+id);
    return res.json(posts);
  } catch (e) {
    next(e);
  }
});

// Update some post
route.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body || {};

  try {
    const posts = await postsService.update(+id, body);
    return res.json(posts);
  } catch (e) {
    next(e);
  }
});

// Remove some post
route.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await postsService.destroy(+id);

    return res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = route;

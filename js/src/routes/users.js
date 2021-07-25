const express = require("express");
const UsersService = require("../services/users");

const route = express.Router();

const usersService = new UsersService();

// Get all users
route.get("/", async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    return res.json(users);
  } catch (e) {
    next(e);
  }
});

// Create user
route.post("/", async (req, res, next) => {
  const body = req.body || {};

  try {
    const user = await usersService.create(body);
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

// Get one by id
route.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const users = await usersService.getById(+id);
    return res.json(users);
  } catch (e) {
    next(e);
  }
});

// Update some user
route.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body || {};

  try {
    const users = await usersService.update(+id, body);
    return res.json(users);
  } catch (e) {
    next(e);
  }
});

// Remove some user
route.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await usersService.destroy(+id);

    return res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = route;

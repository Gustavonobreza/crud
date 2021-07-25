const { PrismaClient } = require("@prisma/client");
const { scryptSync } = require("crypto");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

const SALT = process.env.SALT || "a secret";

module.exports = class {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        Post: { take: 10 },
      },
    });

    return users;
  }

  async getById(id) {
    if (!id || typeof id !== "number") {
      throw new BadRequestError("Invalid id");
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        Post: { take: 10 },
      },
    });

    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  async getByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        Post: { take: 10 },
      },
    });
  }

  async create(user) {
    const { name, email, password } = user;

    if (!name || !email || !password) {
      throw new BadRequestError(
        "The fields: name, email and password is required"
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      throw new BadRequestError("Invalid parameters");
    }

    const userAlredyExists = await this.getByEmail(email);
    if (userAlredyExists) throw new BadRequestError("This user alredy exists");

    const hashedPassword = scryptSync(password, SALT, 64).toString("hex");

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    });
  }

  async update(id, user) {
    if (!id || !user) throw new BadRequestError("Invalid id or body");

    const { name, password, email } = user;

    let fieldsToUpdate = [];

    name && fieldsToUpdate.push(["name", name]);
    password && fieldsToUpdate.push(["password", password]);
    email && fieldsToUpdate.push(["email", email]);

    if (!fieldsToUpdate.length) {
      throw new BadRequestError("Nothing to change");
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...Object.fromEntries(fieldsToUpdate),
      },
      select: {
        id: true,
        name: true,
        email: true,
        Post: {
          take: 10,
        },
      },
    });
  }

  async destroy(id) {
    const userExists = await this.getById(id);

    if (!userExists) throw new NotFoundError("User not found");

    await this.prisma.user.delete({ where: { id } });
  }
};

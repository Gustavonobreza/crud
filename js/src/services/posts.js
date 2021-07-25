const { PrismaClient } = require("@prisma/client");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

module.exports = class {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll() {
    const posts = await this.prisma.post.findMany({
      where: {
        published: { equals: true },
      },
      select: {
        id: true,
        title: true,
        content: true,
        User: { select: { id: true, name: true } },
      },
    });

    return posts;
  }

  async getById(id) {
    if (!id || typeof id !== "number") {
      throw new BadRequestError("Invalid id");
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        User: { select: { id: true, name: true } },
      },
    });

    if (!post) throw new NotFoundError("Post not found");

    return post;
  }

  async create(post) {
    const { title, content, userId, published } = post;

    if (!title || !content || !userId) {
      throw new BadRequestError(
        "The fields: title, content and userId is required"
      );
    }

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof userId !== "number" ||
      (published !== undefined ? typeof published !== "boolean" : true)
    ) {
      throw new BadRequestError("Invalid parameters");
    }

    return await this.prisma.post.create({
      data: {
        title,
        content,
        published,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        User: { select: { id: true, name: true } },
      },
    });
  }

  async update(id, post) {
    if (!id || !post) throw new BadRequestError("Invalid parameters");

    const { title, content, published, userId } = post;

    let fieldsToUpdate = [];

    title && fieldsToUpdate.push(["title", title]);
    content && fieldsToUpdate.push(["content", content]);
    published && fieldsToUpdate.push(["published", published]);
    userId && fieldsToUpdate.push(["userId", userId]);

    if (!fieldsToUpdate.length) {
      throw new BadRequestError("Nothing to change");
    }

    return await this.prisma.post.update({
      where: { id },
      data: {
        ...Object.fromEntries(fieldsToUpdate),
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        User: { select: { id: true, name: true } },
      },
    });
  }

  async destroy(id) {
    const postExists = await this.getById(id);

    if (!postExists) throw new NotFoundError("post not found");

    await this.prisma.post.delete({ where: { id } });
  }
};

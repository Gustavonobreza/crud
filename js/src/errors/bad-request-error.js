module.exports = class BadRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.statusCode = 400;
  }
};

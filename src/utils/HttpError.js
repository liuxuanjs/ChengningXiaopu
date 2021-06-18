function HttpError(message, stack) {
  this.name = 'HttpError';
  this.message = message;
  this.stack = stack || new Error().stack;
}

HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;

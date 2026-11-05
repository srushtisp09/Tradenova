// An error with an HTTP status code, e.g. throw new HttpError(404, 'Not found')
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Lets route functions use async/await: any error is passed to our error handler.
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

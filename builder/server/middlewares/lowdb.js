export default function(db) {
  return function(req, res, next) {
    req.db = db;
    return next();
  }
};
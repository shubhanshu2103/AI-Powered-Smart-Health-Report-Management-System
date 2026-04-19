const { error } = require('../utils/response');

const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return error(res, 'Forbidden: insufficient role.', 403);
  }
  next();
};

module.exports = { allow };

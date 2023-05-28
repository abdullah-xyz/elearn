// provide user data to templates
module.exports = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

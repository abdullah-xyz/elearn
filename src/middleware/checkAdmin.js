const auth = (req, res, next) => {
  if (req.session.user.type == "admin") {
    next();
    return;
  }
  res.redirect("/login");
};

module.exports = auth;

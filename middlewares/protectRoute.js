const protectRoute = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    if (process.env.ENVIRONMENT === "dev") {
      return res.redirect(process.env.FRONTEND_URL_DEV);
    }
    return res.redirect(process.env.FRONTEND_URL);
  }
};

module.exports = protectRoute;

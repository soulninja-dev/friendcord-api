const protectRoute = async (req, res, next) => {
    if(req.user) {
        next();
    } else {
        return res.redirect(process.env.FRONTEND_URL);
    }
}

module.exports = protectRoute;
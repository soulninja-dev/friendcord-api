const protectRoute = async (req, res, next) => {
    if(req.user) {
        next();
    } else {
        // ondeploy: change to proper url
        return res.redirect("http://localhost:3000/");
    }
}

module.exports = protectRoute;
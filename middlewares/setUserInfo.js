const fetch = require("node-fetch");
const getJWTAccessToken = require("../utils/getJWTAccessToken");

const setUserInfo = async (req, res, next) => {
    console.log("called setUserInfo");
    const userinfoUrl = "https://discord.com/api/users/@me";

    console.log(req.headers);
    const allCookies = req.headers.allcookies || "";
    const token = allCookies.substring(4);
    console.log(token);

    // if jwt exists, get accessToken and set user info in req.user
    if (!token) {
        console.log("JWT NOT THERE")
        req.user = null;
        return next();
    }

    const accessToken = await getJWTAccessToken(req, res);
    const result = await fetch(userinfoUrl, {
        headers: {authorization: "Bearer " + accessToken},
    })
        .then((data) => data.json())
        .catch((err) => {
            console.log(err);
            return res.status(402).json({status: "error", error: err});
        });

    console.log(`result for req.user`);
    console.log(result);

    if (result.username) {
        // set res.user to result so that we can access user data in controllers
        req.user = result;
        console.log("setting req.user")
        return next();
    }
    req.user = null;
    next();
};

module.exports = setUserInfo;
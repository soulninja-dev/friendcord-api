const fetch = require("node-fetch");
const getJWTAccessToken = require("../utils/getJWTAccessToken");

const setUserInfo = async (req, res, next) => {
    const userinfoUrl = "https://discord.com/api/users/@me";

    console.log(req.cookies);
    console.log(req.headers);

    const allCookies = req.headers.allcookies;
    console.log(allCookies);

    // todo: jugaad practice, so change it
    const token = allCookies.substring(3);
    console.log(`TOKEN: ${token}`)

    // if jwt exists, get accessToken and set user info in req.user
    if (!token) {
        console.log("JWT HEADER NOT THERE")
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
        return next();
    }
    req.user = null;
    next();
};

module.exports = setUserInfo;
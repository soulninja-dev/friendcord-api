const jwt = require("jsonwebtoken");

// get the access_token stored in the cookie in the request
const getJWTAccessToken = async (req, res) => {
    let accessToken = "";
    const allCookies = req.headers.allcookies || "";
    const token = allCookies.substring(4);
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Report this to SoulNinja#7616",
                error: err,
            });
        }
        accessToken = decodedToken.access_token;
    });
    console.log(`ACCESS TOKEN: ${accessToken}`)
    return accessToken;
};

module.exports = getJWTAccessToken;

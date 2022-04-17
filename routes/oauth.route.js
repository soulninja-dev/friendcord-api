const express = require("express");
const {stringify} = require("query-string");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/asyncHandler");
const router = new express.Router();
const UserModel = require("../models/user.model");

const expireTime = 50 * 24 * 60 * 60;

// generate jwt token stored in cookie with the payload
function generateJWTToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expireTime});
}

router.get("/", asyncHandler(async (req, res) => {
    if (!req.query.code) throw new Error("NoCodeProvided");
    // sending post req to discord to get access token
    const tokenURL = "https://discord.com/api/oauth2/token";

    // settings param when just access_token needs to be requested from discord
    const params = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: `${process.env.REDIRECT_URL}`,
    };

    console.log(params);

    // send POST to discord access_token API with needed info
    const OAuthResult = await fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: stringify(params),
    })
        .then((data) => data.json())
        .catch((err) => {
            console.log(err);
        });

    console.log("OAuthResult");
    console.log(OAuthResult);

    // getting user info
    const userinfoUrl = "https://discord.com/api/users/@me";

    const result = await fetch(userinfoUrl, {
        headers: {authorization: "Bearer " + OAuthResult.access_token},
    })
        .then((data) => data.json())
        .catch((err) => {
            console.log(err);
            return res.status(402).json({status: "error", error: err});
        });

    console.log("result");
    console.log(result);

    // setting cookie
    const jwtToken = generateJWTToken({access_token: OAuthResult.access_token});
    res.cookie(
        "jwt",
        jwtToken,
        {
            httpOnly: true,
            maxAge: expireTime * 1000,
            domain: `${process.env.FRONTEND_URL}`,
            sameSite: "none",
        }
    );

    // checking if user exists, in db and creating
    const user = await UserModel.findOne({discord: result.id});

    console.log("user");
    console.log(user);

    // if user is null
    if (!user) {
        const image = `https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}`
        const newuser = await UserModel.create({
            discord: result.id,
            image,
        });
        console.log("creating user");
        console.log(newuser);

        return res.redirect(`${process.env.FRONTEND_URL}/api/almost_there?token=${jwtToken}`);
    } else if (user.interests.length === 0 || user.gender === null) {
        return res.redirect(`${process.env.FRONTEND_URL}/api/almost_there?token=${jwtToken}`);
    } else {
        return res.redirect(`${process.env.FRONTEND_URL}/@feed`);
    }
}));

router.get("/auth/logout", asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.redirect(`${process.env.FRONTEND_URL}`);
}));

module.exports = router;
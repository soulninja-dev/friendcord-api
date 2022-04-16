const express = require("express");
const router = new express.Router();
const asyncHandler = require("../utils/asyncHandler");
const protectRoute = require("../middlewares/protectRoute");
const UserModel = require("../models/user.model");

router.get("/", protectRoute, asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({discord: req.user.id});

    const likedUsers = user.liked;
    console.log(likedUsers);
    let matches = []
    for (const matchingId of likedUsers) {
        const matchingUser = await UserModel.findOne({discord: matchingId});
        if (matchingUser.liked.includes(req.user.id)) {
            matches.push(matchingUser);
        }
    }

    if(matches.length >= 1) {
        return res.status(200).json({status: "ok", data: matches})
    } else {
        return res.status(200).json({status: "ok", data: "L + ratio + sed noises"})
    }
}));

module.exports = router;

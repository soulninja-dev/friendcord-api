const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protectRoute = require("../middlewares/protectRoute");
const router = new express.Router();
const UserModel = require("../models/user.model");

function generateRandom(min = 5, max = 10) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}
router.get("/", protectRoute, asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({discord: req.user.id});

    // get all docs which are NOT in user.liked
    // select random num of docs

    const feed = await UserModel.find({
        $and: [{
            discord: {
                $nin: user.liked,
            },
            _id: {
                $ne: user._id,
            }
        }],
    }).limit(generateRandom());

    // todo: add commonInterest property to all docs in feed
    return res.status(200).json({status: "ok", data: feed, count: feed.length});
}));

module.exports = router;
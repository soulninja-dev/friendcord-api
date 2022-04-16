/*
feed algorithm:

- send random number of users ( between 5 and 10 )
- user should not be liked before

*/

const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protectRoute = require("../middlewares/protectRoute");
const router = new express.Router();
const UserModel = require("../models/user.model");

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
    }).limit(5);

    // todo: add commonInterest property to all docs in feed
    return res.status(200).json({status: "ok", data: feed, count: feed.length});
}));

module.exports = router;
const express = require("express");
const router = new express.Router();
const asyncHandler = require("../utils/asyncHandler");
const protectRoute = require("../middlewares/protectRoute");
const UserModel = require("../models/user.model");

function generateRandom(min = 4, max = 6) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

router.get("/", protectRoute, asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({discord: req.user.id});

    // OLD FEED
    /*
    const feed = await UserModel.find({
        $and: [{
            discord: { $nin: user.liked,
            },
            _id: {
                $ne: user._id,
            }
        }],
    }).limit(generateRandom());
     */

    const feed = await UserModel.aggregate([
        { $match: { '$and': [
                    {discord : {$nin: user.liked,}},
                    {_id : {$ne: user._id,}},
                ] } },
        { $sample: { size: generateRandom(), } },
    ]);

    const arrfeed = JSON.parse(JSON.stringify(feed));
    arrfeed.forEach(doc => {
        doc.commonInterests = doc.interests.filter(value => user.interests.includes(value));
    })

    console.log(arrfeed);

    return res.status(200).json({status: "ok", data: arrfeed, count: arrfeed.length});
}));

module.exports = router;
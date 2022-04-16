const router = require("express").Router();
const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

router.get("/like/:id", protectRoute, asyncHandler(async (req, res) => {
    const likedUser = await UserModel.findOne({discord: req.params.id});
    if (likedUser) {
        await UserModel.findOneAndUpdate({discord: req.user.id}, {
            $push: {
                liked: likedUser._id,
            }
        })

        return res.status(200).json({status: "ok"});
    } else {
        return res.status(404).json({status: "error", error: "liked user not found"});
    }
}));

router.get("/dislike/:id", protectRoute, asyncHandler(async (req, res) => {
    const dislikedUser = await UserModel.findOne({discord: req.params.id});
    if (dislikedUser) {
        await UserModel.findOneAndUpdate({discord: req.user.id}, {
            $push: {
                liked: dislikedUser._id,
            }
        })

        return res.status(200).json({status: "ok"});
    } else {
        return res.status(404).json({status: "error", error: "liked user not found"});
    }
}));

module.exports = router;
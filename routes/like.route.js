const express = require("express");
const router = new express.Router();
const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const protectRoute = require("../middlewares/protectRoute");

router.put("/:id", protectRoute, asyncHandler(async (req, res) => {
    const likedUser = await UserModel.findOne({discord: req.params.id});
    if (likedUser) {
        await UserModel.findOneAndUpdate({discord: req.user.id}, {
            $push: {
                liked: likedUser.discord,
            }
        })

        return res.status(200).json({status: "ok"});
    } else {
        return res.status(404).json({status: "error", error: "liked user not found"});
    }
}));

module.exports = router;
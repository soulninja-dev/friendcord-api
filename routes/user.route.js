const express = require("express");
const router = new express.Router();
const asyncHandler = require("../utils/asyncHandler");
const UserModel = require("../models/user.model");

/*
GET /api/user/me -> get user data

if user is logged in:
response:
{
    "status": "ok",
    "data": {user data}
}

if user is not logged in:
response:
{
    "status": "error",
    "error": "not logged in"
}
*/

router.get("/me", asyncHandler(async (req, res) => {
    if(req.user) {
        const user = await UserModel.findOne({discord: req.user.id});
        res.status(200).json({status: "ok", data: user});
    } else {
        res.status(404).json({status: "error", error: "not logged in"})
    }
}));

router.post("/", asyncHandler(async (req, res) => {
    const { gender, interests } = req.body;
    console.log(`gender: ${gender}`);
    console.table(interests);
    const updatedUser =  await UserModel.findOneAndUpdate({discord: req.user.id}, {
        gender,
        interests
    });
    return res.status(200).json({ status: "ok", data: updatedUser})
}))

module.exports = router;
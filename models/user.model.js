const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    // discord id
    discord: {
        type: String,
        required: [true, "Discord id is necessary"],
        unique: true,
    },
    username: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "non-binary", "null"],
    },
    image: {
        type: String,
    },
    interests: [
        {
            type: String,
            enum: ["anime", "coding", "music", "chess", "memes", "spamming", "linux", "minecraft"],
            minLength: 3,
        }
    ],
    liked: [
        {
            type: String,
        }
    ],
    disliked: [
        {
            type: String,
        }
    ],
});

module.exports = mongoose.model("User", UserSchema);
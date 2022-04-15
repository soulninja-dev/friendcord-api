const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    // discord id
    discord: {
        type: String,
        required: true,
        unique: true,
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
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],
    disliked: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],
});

module.exports = mongoose.model("User", UserSchema);
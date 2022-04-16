// imports
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {connect} = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// route handlers
const oauthRouter = require("./routes/oauth.route");
const userRouter = require("./routes/user.route");
const likeRouter = require("./routes/like.route");
const dislikeRouter = require("./routes/dislike.route");
const feedRouter = require("./routes/feed.route");
const matchRouter = require("./routes/matches.route")

// middlewares
const setUserInfo = require("./middlewares/setUserInfo");

// db and server start
const PORT = process.env.PORT;
const dbURI = process.env.DB_URI.toString();

connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
    .then(() => {
        app.listen(PORT);
        console.log(`listening on http://localhost:${PORT} \nConnected to DB`);
    })
    .catch((err) => console.log(err));

// middleware & static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access request cookies from req.cookies
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// route handlers for posts and auth
app.use(setUserInfo);
app.use("/api/auth", oauthRouter);
app.use("/api/user", userRouter);
app.use("/api/like", likeRouter);
app.use("/api/dislike", dislikeRouter);
app.use("/api/feed", feedRouter);
app.use("/api/matches", matchRouter);

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'error',
                error: "No code provided",
            });
        default:
            return res.status(500).send({
                status: 'error',
                error: err.message,
            });
    }
});

app.use((req, res) => {
    res.status(404).send("** cricket noises");
});
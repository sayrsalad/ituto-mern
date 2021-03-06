const app = require('./app')
const express = require('express');
const path = require('path');
const connectDatabase = require('./config/database');

const cloudinary = require('cloudinary');

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
});

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config.env' })

connectDatabase();


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname1, "/client/build")));


    app.get("/*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {

}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    socket.on("new message", (newMessageReceived) => {
        newMessageReceived = JSON.parse(newMessageReceived);

        var message = newMessageReceived.message;

        var conversationID = message.conversationID;

        if (!conversationID.users) return console.log("conversationID.users not defined");

        conversationID.users.forEach((user) => {
            if (user == message.sender._id) return;

            console.log(user, message.sender._id);
            socket.to(user).emit("received", message);
        });
    });

    socket.on("session request", (session) => {
        console.log(session);
        socket.to(session.tutor).emit("session notify", session);
    });

    socket.on("session accept", (session) => {
        console.log(session);
        socket.to(session.tutee).emit("session accepted", session);
    });

    socket.on("assessment create", (assessment) => {
        console.log(assessment);
        socket.to(assessment.tutee).emit("assessment notify", assessment);
    });

    socket.on("assessment answer", (assessment) => {
        console.log(assessment.tutor);
        socket.to(assessment.tutor).emit("assessment check", assessment);
    });

    socket.on("call", (call) => {
        console.log(call);

        call.users.forEach((user) => {
            if (user == call.caller) return;
            console.log(user);
            socket.to(user).emit("ring");
        });
    });
});

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});
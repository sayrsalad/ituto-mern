const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const ErrorResponse = require('../utils/errorResponse');

const util = require('util');
const fs = require('fs');
const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, download } = require('../utils/s3')

const allMessages = catchAsyncErrors(async (req, res) => {

    console.log("Messages");
    try {

        const messages = await Message.find({ conversationID: req.params.conversationID })
            .sort({createdAt: -1})
            .populate("sender", "firstname avatar")
            .populate("conversationID");
        res.json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const sendMessage = catchAsyncErrors(async (req, res) => {
    const { content, conversationID } = req.body;

    if (!content || !conversationID) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    
    if (req.files.length > 0) {
        const file = req.files[0];
        // apply filter
        // resize 

        const result = await uploadFile(file, `files/${conversationID}/`);

        result.Key = result.Key.substr(6);
        result.Key = result.Key.replace(/\//g, '%2F');

        console.log(result);
        await unlinkFile(file.path);

        var newMessage = {
            sender: req.user._id,
            content: content,
            conversationID: conversationID,
            attachment: result.Key
        };
    } else {
        var newMessage = {
            sender: req.user._id,
            content: content,
            conversationID: conversationID,
        };
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "firstname lastname avatar");
        message = await message.populate("conversationID");
        message = await User.populate(message, {
            path: "users",
            select: "firstname",
        });

        await Conversation.findByIdAndUpdate(req.body.conversationID, { latestMessage: message });

        res.json({
            success: true,
            message
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

const downloadFile = catchAsyncErrors(async (req, res) => {

    try {
        const filename = req.params.filename
        console.log(filename);
        let x = await download("files/", filename);
        console.log(x);
        res.send(x.Body)
    } catch (error) {
        console.log(error);
    }

});

const accessFile = catchAsyncErrors(async (req, res, next) => {

    try {
        console.log(req.params)
        const key = req.params.key
        const readStream = await getFileStream("files/", key, next);
        readStream.pipe(res)
    } catch (error) {
        next(new ErrorResponse('File not found', 404));
    }

});


module.exports = { allMessages, sendMessage, downloadFile, accessFile };
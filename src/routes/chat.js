const express = require('express');
const { Chat } = require('../models/Chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    // console.log(targetUserId + " " + userId);
    try {
        let chat = await Chat.findOne({
            particpants: { $all: [targetUserId, userId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName imageUrl"
        });

        if (!chat) {
            chat = new Chat({
                particpants: [userId, targetUserId],
                messages: []
            });

            await chat.save();
        }

        return res.json(chat);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = chatRouter;
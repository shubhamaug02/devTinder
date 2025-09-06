const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
    particpants: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "User"
    },
    messages: [messageSchema]
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = { Chat };

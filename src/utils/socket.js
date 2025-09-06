const socket = require('socket.io');
const crypto = require('crypto');
const { Chat } = require('../models/chat');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join('$'))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            // const roomId = [userId, targetUserId].sort().join('_');
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " Joined Room " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text, imageUrl, lastName }) => {
            // const roomId = [userId, targetUserId].sort().join('_');

            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName + " " + text);

                // check if the document exist with the particpants, if exist-just add the message in the document else
                // create the document


                let chat = await Chat.findOne({
                    particpants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        particpants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", { firstName, text, imageUrl, lastName });
            }
            catch (err) {
                console.log(err.message);
            }

        });

        socket.on("disconnect", () => { });
    });
};

module.exports = initializeSocket;


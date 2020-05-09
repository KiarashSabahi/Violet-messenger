// import
import socketio from "socket.io";
import jwt from "jsonwebtoken";
import {server} from "../index.mjs";
import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";

import {cacheIt} from "./cache.mjs"
//

const io = socketio(server);

io.on("connection", async (socket) => {

    socket.on("cookies", async (token, reciever, chatId) => {

        await cacheIt("rooms", chatId, socket.id, true);

    });

    socket.on("sendmessage", async ({message, user, reciever, chatId}) => {

        const templateObject = {
            sender: user,
            message
        };

        const direct = await Direct.findOne({id: chatId});
        direct.messages.push(templateObject);
        await direct.save();


        const socketsArray = await cacheIt("rooms", chatId, null, false);

        socketsArray.forEach((socketId) => {
            io.to(socketId).emit("message", {message, user, reciever});
        });
    });
});

// import
import socketio from "socket.io";
import jwt from "jsonwebtoken"
import {server} from "../index.mjs";
import User from "../models/user.mjs";

import {cacheIt} from "./cache.mjs"
//

const io = socketio(server);

io.on("connection", async (socket) => {



    socket.on("cookies", async (token, reciever) => {

        const decoded = jwt.verify(token, "user");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});

        await cacheIt("onlineUsers", user.userName, {[reciever]: socket.id}, true);
        // console.log( await cacheIt("onlineUsers", user.userName, socket.id, false));

    });

    socket.on("sendmessage", async ({message, user, reciever}) => {
        const socketTarget = await cacheIt("onlineUsers", reciever, null, false);
        console.log(socketTarget);
        io.to(socketTarget[user]).emit("message", {message, user, reciever});
        socket.emit("message", {message, reciever, user})
        // io.sockets.socket( await cacheIt("onlineUsers", reciever, false)).emit({message, user, reciever});
        // io.emit("message", {message, user, reciever});
    });

    socket.on("selectChat", (chat) => {
        // console.log(socket.id);
    })

});

// import
import socketio from "socket.io";
import jwt from "jsonwebtoken"
import {server} from "../index.mjs";
import User from "../models/user.mjs";

import {cacheIt} from "./cache.mjs"
//

const io = socketio(server);

io.on("connection", (socket) => {
    let activeUser;
    let activeChat = {chatId: undefined};

    socket.on("cookies", async (token) => {
        const decoded = jwt.verify(token, "user");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        activeUser = user;
    });

    socket.on("sendmessage", (message) => {
        console.log(activeChat.chatId);
        io.emit("message", activeUser.nickName, message);
    });

    socket.on("selectChat", (chat) => {
        console.log(activeUser);
    })

});

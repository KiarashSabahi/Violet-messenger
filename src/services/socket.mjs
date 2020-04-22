// import
import socketio from "socket.io";
import jwt from "jsonwebtoken"
import {server} from "../index.mjs";
import User from "../models/user.mjs";
//

const io = socketio(server);

io.on("connection", (socket) => {
    console.log("Connected to server");
    let activeUser;
    let activeChat;
    socket.on("cookies", async (token) => {
        const decoded = jwt.verify(token, "user");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        activeUser = user;
    })

    socket.on("sendmessage", (message, callback) => {
        io.emit("message", activeUser.nickName, message);
    });

});

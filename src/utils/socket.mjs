import socketio from "socket.io";
import {server} from "../index.mjs";

const io = socketio(server);

io.on("connection", (socket) => {
    console.log("Connected to server");

    socket.on("sendmessage", (message, callback) => {
        io.emit("message", message + " was sent from io");
    });

});

import socketio from "socket.io";
import {server} from "../index.mjs";

const io = socketio(server);

io.on("connection", () => {
    console.log("New connection");
});

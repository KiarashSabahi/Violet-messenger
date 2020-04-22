import express from "express";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";


import ("./db/mongoose.mjs");
const __dirname = path.resolve();

import userRouter from "./routers/user.mjs";
import chatRouter from "./routers/chat.mjs";
//
const app = express();
export const server = http.createServer(app);
const port = process.env.port || 3000;
const publicDirectoryPath = path.join(__dirname, "/public");
//
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(chatRouter);
app.use(express.static(publicDirectoryPath));
//
server.listen(port, async () => {
    console.log("Server is up and running on port " + port);
    await import("./services/socket.mjs");
});

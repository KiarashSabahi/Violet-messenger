//imports
import express from "express";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";

const __dirname = path.resolve();

import ("./db/mongoose.mjs");
import userRouter from "./routers/user.mjs";
import chatRouter from "./routers/chat.mjs";
//setting up the express server
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

// import
import socketio from "socket.io";
import jwt from "jsonwebtoken";
import {server} from "../index.mjs";
import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";
import Group from "../models/group.mjs";
import Channel from "../models/channel.mjs";

import {cacheIt, clearCache} from "./cache.mjs"
//

const io = socketio(server);

io.on("connection", async (socket) => {

    socket.on("cookies", async (token, reciever, chatId) => {

        await cacheIt("rooms", chatId, socket.id, true);

        socket.chatId = chatId;
    });

    socket.on("sendmessage", async ({message, user, reciever, chatId, kind}) => {
        let messages
        let templateObject = {
            sender: user,
            reciever,
            message
        };

        switch (kind) {
            case "direct": {
                messages = await Direct.findOne({id: chatId});
                messages.messages.push(templateObject);
                break;
            }
            case "group": {
                messages = await Group.findOne({id: chatId});
                delete templateObject.reciever;
                messages.messages.push(templateObject);
                break;
            }
            case "channel": {
                messages = await Channel.findOne({id: chatId});
                delete templateObject.reciever;
                let state = false;
                messages.admins.some((admin) => {
                    if(user == admin.userName) {
                        messages.messages.push(templateObject);
                        state = true;
                    }
                })

                if(!state) {
                    return;
                }

                break;
            }
        }
        // messages.messages.push(templateObject);
        await messages.save();


        const socketsArray = await cacheIt("rooms", chatId, null, false);

        socketsArray.forEach((socketId) => {
            io.to(socketId).emit("message", {message, user, reciever});
        });
    });

    socket.on("disconnect", async () => {
        await clearCache("rooms", socket.chatId, socket.id);
    });
});

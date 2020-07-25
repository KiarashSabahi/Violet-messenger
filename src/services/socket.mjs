// imports
import socketio from "socket.io";
import jwt from "jsonwebtoken";
import {server} from "../index.mjs";
import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";
import Group from "../models/group.mjs";
import Channel from "../models/channel.mjs";
import {cacheIt, clearCache} from "./cache.mjs"
const collections = {
    user: User,
    direct: Direct,
    group: Group,
    channel: Channel
};
//
const io = socketio(server);

io.on("connection", async (socket) => {
    //saving socketID of members of each chat in cache server
    socket.on("addSocketID", async ( reciever, chatId) => {
        await cacheIt("rooms", chatId, socket.id, true);
        socket.chatId = chatId;
    });

    //receiving sent message from user
    socket.on("sendmessage", async ({message, user, reciever, chatId, kind}) => {
        let messages;
        let templateObject = {
            sender: user,
            reciever,
            message
        };
        //kind variable shows what type of chat the message is sent to
        // messages = await collections[kind].findOne({id: chatId});
        // if (kind === "group" || kind === "channel") {
        //     delete templateObject.reciever;
        // } else if (kind === "channel") {
        //     let isAdmin = false;
        //     messages.admins.some((admin) => {
        //         if(user === admin.userName) {
        //             messages.messages.push(templateObject);
        //             isAdmin = true;
        //         }
        //     });

        //     if(!isAdmin) {
        //         return;
        //     }
        // }
        // messages.messages.push(templateObject);
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
                let isAdmin = false;
                messages.admins.some((admin) => {
                    if(user === admin.userName) {
                        messages.messages.push(templateObject);
                        isAdmin = true;
                    }
                })

                if(!isAdmin) {
                    return;
                }

                break;
            }
        }

        await messages.save();
        //receiving socketIDs of members of the chat
        const socketsArray = await cacheIt("rooms", chatId, null, false);
        //sending the message to every active socketID
        socketsArray.forEach((socketId) => {
            io.to(socketId).emit("message", {message, user, reciever});
        });
    });

    socket.on("disconnect", async () => {
        //clearing socketID of user when disconnected
        await clearCache("rooms", socket.chatId, socket.id);
    });
});

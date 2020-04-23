import express from "express";
import cRS from "crypto-random-string";

const chatRouter = new express.Router();

import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";
import userAuth from "../middleware/userauth.mjs";



chatRouter.post("/direct", userAuth, async (req, res) => {

    let chatId = null;
    req.user.chats.some((item) => {
        chatId = item.chatId
        if (item.userName == req.body.userName) {
            console.log("raft to if");
            return chatId === item.chatId
        }
    });

    if (chatId != null) {
      return res.status(200).send({chatId});
    }
    console.log("dare misaze");
    chatId = cRS({length: 12});
    const otherUser = await User.findOne({userName: req.body.userName})
    if(!otherUser) {
        throw {error: "User was not found"};
    }
    await otherUser.chats.push({userName: req.user.userName, chatId: chatId});
    await req.user.chats.push({userName: otherUser.userName, chatId: chatId});
    const direct = new Direct({id: chatId, members: [{userName: req.user.userName}, {userName: otherUser.userName}]})

    await otherUser.save();
    await req.user.save();
    await direct.save();
    res.status(200).send({chatId: chatId});

});

chatRouter.get("/chats", userAuth, async (req, res) => {
    try {
        res.status(200).send(req.user.chats);
    } catch(e) {
        res.status(400).send(e);
    }
});






export default chatRouter;

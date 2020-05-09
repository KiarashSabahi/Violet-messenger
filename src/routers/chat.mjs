import express from "express";
import cRS from "crypto-random-string";

const chatRouter = new express.Router();

import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";
import Group from "../models/group.mjs";
import userAuth from "../middleware/userauth.mjs";



chatRouter.post("/direct", userAuth, async (req, res) => {
    let chatId = null;
    req.user.chats.some((item) => {
        if (item.userName == req.body.userName) {
            chatId = item.chatId
            return chatId === item.chatId
        }
    });

    if (chatId != null) {
      return res.status(200).send({chatId});
    }
    chatId = cRS({length: 12});
    const otherUser = await User.findOne({userName: req.body.userName})
    if(!otherUser) {
        throw {error: "User was not found"};
    }
    await otherUser.chats.push({userName: req.user.userName, chatId: chatId, kind: "direct"});
    await req.user.chats.push({userName: otherUser.userName, chatId: chatId, kind: "direct"});
    const direct = new Direct({id: chatId, members: [{userName: req.user.userName}, {userName: otherUser.userName}]})

    await otherUser.save();
    await req.user.save();
    await direct.save();
    res.status(200).send({chatId: chatId});

});

chatRouter.post("/group", userAuth ,async (req, res) => {
    let chatId = null;
    req.user.chats.some((item) => {
        if (item.userName == req.body.userName) {
            chatId = item.chatId;
            return chatId === item.chatId;
        }
    });

    res.status(200).send({chatId});

});

chatRouter.post("/group/create", userAuth, async (req, res) => {
    const chatId = cRS({length: 12});
    const group = new Group({id: chatId, userName: req.body.userName});
    await group.members.push({userName: req.user.userName});
    await req.user.chats.push({userName: req.body.userName, chatId, kind: "group"});

    await group.save();
    await req.user.save();
    res.status(201).send();
});

chatRouter.post("/group/join", userAuth, async (req, res) => {
    const group = await Group.findOne({id: req.body.group});
    const user = await User.findOne({userName: req.body.user});
    await group.members.push({userName: user.userName});
    await user.chats.push({userName: group.userName, chatId: group.id, kind: "group"});
    await group.save();
    await user.save();
    res.status(201).send();
});
chatRouter.get("/chats", userAuth, async (req, res) => {
    try {
        res.cookie('Sender', req.user.userName, {
            expires: new Date(Date.now() + 3 * 24 * 3600000),
            sameSite: "strict"
        }).status(200).send(req.user.chats);
    } catch(e) {
        res.status(400).send(e);
    }
});

chatRouter.post("/messages", userAuth, async (req, res) => {
    try {
        let messages = []
        switch (req.body.kind) {
            case "direct": {
                messages = await Direct.findOne({id: req.body.chatId});
                break;
            }
            case "group": {
                messages = await Group.findOne({id: req.body.chatId});
                break;
            }
        }
        res.status(200).send(messages.messages)
    } catch (e) {
        res.status(500).send(e);
    }
})








export default chatRouter;

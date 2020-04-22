import express from "express";
import cRS from "crypto-random-string";

const chatRouter = new express.Router();

import User from "../models/user.mjs";
import Direct from "../models/direct.mjs";

import userAuth from "../middleware/userauth.mjs";

chatRouter.post("/direct", userAuth, async (req, res) => {
    try {

        req.user.chats.forEach((chat) => {
            if (item.userName == req.body.userName) {
                return res.status(200).send({chatId: item.chatId});
            }
        });

        const chatId = cRS({length: 12});
        const otherUser = await User.findOne({userName: req.body.userName})

        if(!otherUser) {
            throw {error: "User was not found"};
        }

        await otherUser.chats.push({userName: req.user.userName, chatId: chatId});
        await req.user.chats.push({userName: otherUser.userName, chatId: chatId});
        const direct = new Direct({id: chatId, members: [{userName: req.body.userName}, {userName: otherUser.userName}]})
        const user = new User(req.body);


        await otherUser.save();
        await req.user.save();
        await direct.save();

        return res.status(200).send({chatId: chatId});

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})








export default chatRouter;

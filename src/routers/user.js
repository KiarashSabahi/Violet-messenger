const express = require("express");
const router = new express.Router();

const User = require("../models/user");
const Pv = require("../models/pv");

const userAuth = require("../middleware/userauth");

//
//sign up
router.post("/user/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        const response = {user, token};

        res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
});
//login
router.get("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});
//validating users current token
router.get("/user/isloggedin", userAuth, async (req, res) => {
    try{
        res.status(200).send(req.user);
    } catch(e) {
        res.status(400).send(e)
    }
});
//log out
router.delete("/user/logout", userAuth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((entry) => {
          return entry.token != req.token;
        });

        await req.user.save();
        res.status(200).send();
    }catch(e) {
        res.status(400).send(e);
    }
});
//profile
router.get("/user/me", userAuth, async (req, res) => {
    res.status(200).send(req.user);
});
//user search
router.get("/user/search", userAuth, async (req, res) => {
    try{
        const queries = Object.keys(req.query);
        const queryValues = Object.values(req.query);

        const allowedOptions = ["userName", "phoneNumber"];
        const isValid = queries.every((each) => {
            return allowedOptions.includes(each);
        });

        if(!isValid) {
            return res.status(400).send({error: "invalid search queries"});
        }

        if(req.query.userName) {
            const result = await User.findOne({userName: req.query.userName});
            return res.status(200).send(result);
        }
        else if(req.query.phoneNumber) {
            const result = await User.findOne({phoneNumber: req.query.phoneNumber});
            return res.status(200).send(result);
        } else {
            return res.status(404).send({error: "user not found"});
        }

    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});
//user update
router.patch("/user/me", userAuth, async (req, res) => {
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ["nickName", "userName", "phoneNumber", "bio"];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!isValidOperation) {
            return res.status(404).send({error: "Invalid operation"});
        }

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        res.status(200).send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
})
//User delete account
router.delete("/user/me", userAuth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send("account deleted successfully");
    } catch(e) {
        res.status(400).send();
    }
});
//








module.exports = router

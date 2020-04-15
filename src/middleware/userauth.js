const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "user");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        if(!user) {
            throw ({error: "Please Authorize"});
        }

        req.token = token;
        req.user = user;
        next();
    } catch(e)  {
        res.status(401).send(e);
    }
}

module.exports = userAuth;

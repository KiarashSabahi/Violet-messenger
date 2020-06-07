//imports
import jwt from "jsonwebtoken";
import User from"../models/user.mjs";

//
const userAuth = async (req, res, next) => {
    try{
        let token;
        //getting token from cookies or saved token in postman
        try {
          token = req.header("Authorization").replace("Bearer ", "");
        } catch (e) {
          token = req.cookies.Authorization.replace("Bearer ", "");
        }
        const decoded = jwt.verify(token, "user");
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        if(!user) {
            throw ({error: "Please Authorize"});
        }

        req.token = token;
        //saving user in request body to ease accessing user in request
        req.user = user;
        next();
    } catch(e)  {
        res.status(401).send(e);
    }
}

export default userAuth;

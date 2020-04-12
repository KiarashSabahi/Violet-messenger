const express = require("express");
const path = require("path");


require("./db/mongoose");



const userRouter = require("./routers/user");
//
const app = express();
const port = process.env.port || 3002;
//
app.use(express.json());
app.use(userRouter);
//
app.get("/", (req, res) => {
  res.send({})
})
//



app.listen(port, () => {
    console.log("Server is up and running on port " + port);
});

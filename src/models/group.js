const mongoose = require("mongoose");


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
    },
    members: [{
        type: ObjectId,
        required: true,
    }],
    massages: [{
        massageType: {
            type: String,
            required: true,
            default: "text"
        },
        sender: {
            type: ObjectId
        },
        edited: {
            type: Boolean,
            default: false
        },
        seen: {
            type: Boolean,
            default: false
        },
        timestamps:true
    }]

});


const Group = mongoose.model("group", groupSchema);

module.exports = Group;

import mongoose from "mongoose";


const groupSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    members: [{
        userName: {
            type: String,
            required: true
        }
    }],
    messages: [{
        sender: {
            type: String,
            required: true
        },
        messageType: {
            type: String,
            default: "text"
        },
        message: {
            type: String,
            required: true
        },
        submitTime: {
            type: Date,
            default: new Date()
        }
    }]
});

const Group = mongoose.model("Group", groupSchema);

export default Group;

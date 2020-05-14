import mongoose from "mongoose";


const channelSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    admins: [{
        userName: {
            type: String,
            required: true
        }
    }],
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

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;

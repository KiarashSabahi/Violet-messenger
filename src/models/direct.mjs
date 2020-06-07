//imports
import mongoose from "mongoose";

//creating direct chats schema
const directSchema = new mongoose.Schema({
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
        reciever: {
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
    }],
    info: {
        messageCount: {
            type:Number,
            default: 0
        }
    }
});

//creating direct chats model
const Direct = mongoose.model("Direct", directSchema);

export default Direct;

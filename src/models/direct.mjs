import mongoose from "mongoose";


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

const Direct = mongoose.model("Direct", directSchema);

export default Direct;

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
    massages: [{
        massage: {
            sender: {
                type: String,
                required: true
            },
            massageType: {
                type: String,
                required: true,
                default: "text"
            },
            massage: {
                type: String,
                required: true
            },
            submitTime: {
                type: Date,
                required: true
            },
            massageNumber: {
                type: Number,
                required: true
            }
        }
    }],
    info: {
        massageCount: {
            type:Number,
            required: true,
            default: 0
        }
    }
});

const Direct = mongoose.model("Direct", directSchema);

export default Direct;

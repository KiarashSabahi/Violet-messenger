import mongoose from "mongoose";


const pvSchema = new mongoose.Schema({
    memebers: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    }],
    massages: [{
        massage: {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
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

const Pv = mongoose.model("Pv", pvSchema);

export default Pv;

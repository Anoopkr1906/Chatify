import {model , Schema , models, Types} from "mongoose";

const schema = new Schema({
    attachments:[
        {
            public_id:{
                type: String,
                required: true,
            },
            url:{
                type: String,
                required: true,
            }
        },
    ],
    sender:{
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat:{
        type: Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    content:{
        type: String,
    }
}, 
{
    timestamps: true,
});


export const Message = models.Message || model("Message" , schema);
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const cookieOptions = {
        maxAge: 15*24*60*60*1000,
        sameSite: "none",
        httpOnlt: true,
        secure: true,
}

const connectDB = ( uri ) => {
    mongoose.connect(uri ,{
        dbName: "Chatify",
    }).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        throw err;
    })
}


const sendToken= (res, user , code , message) => {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    return res.status(code).cookie("chatify-token" , token , cookieOptions).json({
        success: true,
        message,
    });
};

const emitEvent = (req , event , users , data) => {
    console.log("Emitting event:", event, "to users:", users);
}


export { connectDB , sendToken , cookieOptions , emitEvent}
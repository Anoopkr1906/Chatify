import { compare } from "bcrypt";
import {User} from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";



// create a new user and login controller and save in cookie

const newUser = async(req, res) => {

    const avatar = {
        public_id: "sample_id",
        url: "https://example.com/sample.jpg"
    }

    const {name , username , password , bio} = req.body;

    const user = await User.create({
        name,
        bio,
        username,
        password,
        avatar,
    });

    // res.status(201).json({message : "User created successfully"});
    sendToken(res , user , 201 , "User created" );
}

const login = TryCatch(async(req , res , next) => {
    const {username , password} = req.body ;

    const user = await User.findOne({username}).select("+password");
        
    if(!user){
        return next(new ErrorHandler("Invalid Username or password" , 404));
    }

    const isPasswordMatched = await compare(password , user.password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password or username" , 404));
    }

    sendToken(res , user , 200 , `Welcome back , ${user.name}`);
});



const getMyProfile = TryCatch(async(req , res) => {

    const user = await User.findById(req.user).select("-password");

    res.status(200).json({
        success: true,
        user, // assuming req.user is set by an authentication middleware
    })
})

const logout = TryCatch(async(req , res) => {
    return res.status(200).cookie("chatify-token" , "" , {...cookieOptions , maxAge: 0}).json({
        success: true, 
        message: "Logged out successfully",
    })
})

const searchUser = TryCatch(async(req , res) => {

    const {name} = req.query;

    return res.status(200).json({
        success: true, 
        message: name,
    })
})

export {newUser, login , getMyProfile , logout , searchUser};
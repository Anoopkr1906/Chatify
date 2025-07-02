import {User} from "../models/user.js";
import { sendToken } from "../utils/features.js";



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

const login = (req , res) => {
    res.send("Login route");
}

export {newUser, login};
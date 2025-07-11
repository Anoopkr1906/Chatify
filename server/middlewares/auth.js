import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import { CHATIFY_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

const isAuthenticated = TryCatch((req , res , next) => {

    // console.log("cookies:",req.cookies);
    const token = req.cookies[CHATIFY_TOKEN];

    if(!token){
        return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    req.user = decodedData._id ;

    next();
})

const isAdminAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies["chatify-admin-token"];

     console.log("Admin auth check - token:", token); // ✅ Debug log

    if (!token) {
        return next(new ErrorHandler("Please login as admin to access this route", 401));
    }

    const adminId = jwt.verify(token, process.env.JWT_SECRET);

    if (!adminId) {
        return next(new ErrorHandler("Invalid admin token", 401));
    }


    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "Anoop@admin123";
    console.log("Admin auth check - verified:", adminId); // ✅ Debug log
    const isMatched = adminId === adminSecretKey;

    if (!isMatched) {
        return next(new ErrorHandler("Invalid Admin key", 401));
    }

    next();
});


const socketAuthenticator = async(err , socket , next) => {
    try {
        if(err){
            return next(err);
        }

        const authToken = socket.request.cookies[CHATIFY_TOKEN] ;
        if(!authToken){
            return next(new ErrorHandler("Please login to access this route" , 401));
        }

        const decodedData = jwt.verify(authToken , process.env.JWT_SECRET) ;

        const user = await User.findById(decodedData._id);

        if(!user){
            return next(new ErrorHandler("Please login to access this route" , 401));
        }

        socket.user = user ;

        return next();

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route" , 401));
    }
}


export { isAuthenticated , isAdminAuthenticated , socketAuthenticator};
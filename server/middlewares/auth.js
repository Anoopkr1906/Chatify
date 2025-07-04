import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";

const isAuthenticated = TryCatch((req , res , next) => {

    // console.log("cookies:",req.cookies);
    const token = req.cookies["chatify-token"];

    if(!token){
        return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    req.user = decodedData._id ;

    next();
})

const isAdminAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies["chatify-admin-token"];

    if (!token) {
        return next(new ErrorHandler("Please login as admin to access this route", 401));
    }

    const adminId = jwt.verify(token, process.env.JWT_SECRET);

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "Anoop@admin123";
    const isMatched = adminId === adminSecretKey;

    if (!isMatched) {
        return next(new ErrorHandler("Invalid Admin key", 401));
    }

    next();
});



export { isAuthenticated , isAdminAuthenticated};
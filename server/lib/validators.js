import { body, check, param, query, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const registerValidator = () => [
    body("name" , "Please enter a valid name").notEmpty(),
    body("username" , "Please enter a valid username").notEmpty(),
    body("password" , "Please enter a valid password").notEmpty(),
    body("bio" , "Please enter a valid bio").notEmpty(),
    check("avatar" , "Please upload a valid avatar").notEmpty()
];

const loginValidator = () => [
    body("username" , "Please enter a valid username").notEmpty(),
    body("password" , "Please enter a valid password").notEmpty(),
];

const newGroupValidator = () => [
    body("name" , "Please enter a valid Name").notEmpty(),
    body("members").notEmpty().withMessage("Please enter members").isArray({min: 2 , max:100}).withMessage("Please enter at least 2 members and maximum 100 members"),
];

const addMemberValidator = () => [
    body("chatId" , "Please enter a valid chat ID").notEmpty(),
    body("members").notEmpty().withMessage("Please enter members").isArray({min: 1 , max:97}).withMessage("Members must be an array with at least 1 member and maximum 97 members"),
];

const removeMemberValidator = () => [
    body("chatId" , "Please enter a valid chat ID").notEmpty(),
    body("userId" , "Please enter a valid user ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
    body("chatId" , "Please enter a valid chat Id").notEmpty(),
    check("files").notEmpty().withMessage( "Please upload attachments").isArray({min: 1 , max:97}).withMessage("Attachments must be between 1 and 5 files"),
];

const chatIdValidator = () => [
    param("id" , "Please enter a valid chat Id").notEmpty(),
];

const renameValidator = () => [
    body("name" , "Please enter a valid new name").notEmpty(),
    param("id" , "Please enter a valid Id").notEmpty(),
];

const sendRequestValidator = () => [
    body("userId" , "Please enter a user ID").notEmpty(),
];

const acceptRequestValidator = () => [
    body("requestId" , "Please enter request ID").notEmpty(),
    body("accept").notEmpty().withMessage("Please add accept").isBoolean().withMessage("Accept must be a boolean"),
];

const adminLoginValidator = () => [
    body("secretKey" , "Please enter a valid secret key").notEmpty(),
];


const validateHandler = (req , res , next) => {
    const errors = validationResult(req);

    const errorMessages = errors.array().map(error => error.msg).join(", ");
    
    if(errors.isEmpty()){
        return next();
    }else{
        console.log("Validation errors:", errorMessages);
        next(new ErrorHandler(errorMessages , 400));
    }
}


export {
    registerValidator ,
    validateHandler ,
    loginValidator ,
    newGroupValidator,
    addMemberValidator,
    removeMemberValidator,
    sendAttachmentsValidator,
    chatIdValidator,
    renameValidator,
    sendRequestValidator,
    acceptRequestValidator,
    adminLoginValidator
}
const errorMiddleware = (err, req, res, next) => {

    err.message ||= "Internal Server error";
    err.statusCode ||= 500 ;

    if(err.code === 11000){
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)[0]} entered`;
    }

    if(err.name === "CastError"){
        err.statusCode = 400;
        err.message = `Invalid ${err.path}`;
    }

    return res.status(err.statusCode).json({
        success: false ,
        message: process.env.NODE_ENV?.trim() === "DEVELOPMENT" ? err.message : err.message ,
    });
};


const TryCatch = (passedFunction) => async(req , res , next) =>{
    try {
        await passedFunction(req ,res , next);
    } catch (error) {
        next(error);    
    }
}


export {errorMiddleware , TryCatch};
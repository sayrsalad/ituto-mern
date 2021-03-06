const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    try {

        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : req.cookies.token;
        // if (req.headers.authorization) {
        //     token = req.headers.authorization.split(" ")[1];
        // } else {
        //     token = req.cookies.token;
        // }
        
        if (!token) {
            return next(new ErrorResponse('You have to login first to access this.', 401));
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse("You are not authorized to access this", 401));
    }

});

// exports.isAuthenticatedAndroidUser = catchAsyncErrors(async (req, res, next) => {

//     const token = req.headers.authorization.split(" ")[1];

//     if (!token) {
//         return next(new ErrorResponse('You have to login first to access this.', 401));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return next(new ErrorResponse("User not found", 404));
//         }

//         req.user = user;

//         next();
//     } catch (error) {
//         return next(new ErrorResponse("You are not authorized to access this", 401));
//     }

// });

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`Role (${req.user.role}) is not allowed to acces this resouce.`, 403));
        }
        next();
    }
};
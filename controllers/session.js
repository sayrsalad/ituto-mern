const Session = require('../models/Session');
const Tutor = require('../models/Tutor');

const ErrorResponse = require('../utils/errorResponse');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


//FOR ANALYTICSSSSSSS //////////////////////////////////

exports.reportstuteeYearLevel = catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,

        })

    } catch (error) {
        next(error);
    }

});


exports.reportsprefferedDays = catchAsyncErrors(async (req, res, next) => {
    try {
        const days = await Session.aggregate([
            {
                $group: {
                    _id: { "$dayOfWeek": "$startDate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            // { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } }
        ]);


        res.status(200).json({
            success: true,
            days
        })


    } catch (error) {
        next(error);
    }

});

exports.reportsMostMonthsRequested = catchAsyncErrors(async (req, res, next) => {
    try {
        const months = await Session.aggregate([
            {
                $group: {
                    _id: { "$month": "$requestDate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            // { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } }
        ]);


        res.status(200).json({
            success: true,
            months
        })


    } catch (error) {
        next(error);
    }

});

exports.reportsPreferredTime = catchAsyncErrors(async (req, res, next) => {
    try {
        const days = await Session.aggregate([
            { $unwind: '$time' },
            {
                $group: {
                    _id: "$time.timeOfDay",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            // { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } }
        ]);


        res.status(200).json({
            success: true,
            days
        })


    } catch (error) {
        next(error);
    }

});

exports.requestSession = catchAsyncErrors(async (req, res, next) => {

    try {

        const tutee = req.user._id;
        const requestDate = convertUTCDateToLocalDate(Date.now());

        const { tutor, subject, description, startDate, time } = req.body;

        const tutorObject = await Tutor.findOne({ userID: tutor });

        const checkSession = await Session.findOne({ tutee, subject, status: "Request" });
        const checkSessionDateTime = await Session.findOne({ tutee, startDate, status: "Request" });

        if (checkSessionDateTime) {
            return next(new ErrorResponse("You have already sent a request with the same date.", 409));
        }

        if (checkSession) {
            return next(new ErrorResponse("You have already sent a request with the same subject.", 409));
        }


        if (!tutorObject.subjects.includes(subject)) {
            return next(new ErrorResponse("Subject not offered by tutor.", 404));
        }

        let session = new Session({
            tutor,
            tutee,
            subject,
            description,
            requestDate,
            startDate,
            time: JSON.parse(time)
        });

        session.save();

        session = await session.populate("tutee");
        session = await session.populate("subject");

        res.status(200).json({
            success: true,
            session
        });

    } catch (error) {
        next(error);
    }
});

exports.declineSession = catchAsyncErrors(async (req, res, next) => {

    try {

        const session = await Session.findById(req.params.id);
        if (!(req.user._id.equals(session.tutor))) {
            return next(new ErrorResponse("Unauthorized Access.", 401));
        }

        session.acceptDeclineDate = convertUTCDateToLocalDate(Date.now());
        session.status = "Declined";

        session.save();

        res.status(200).json({
            success: true,
            session,
            message: "Session Declined!"
        });
    } catch (error) {
        console.log(error);
        next(err);
    }

});

exports.cancelSession = catchAsyncErrors(async (req, res, next) => {

    try {

        const session = await Session.findById(req.params.id);
        if (!(req.user._id.equals(session.tutee))) {
            return next(new ErrorResponse("Unauthorized Access.", 401));
        }

        session.acceptDeclineDate = convertUTCDateToLocalDate(Date.now());
        session.status = "Cancelled";

        session.save();

        res.status(200).json({
            success: true,
            session,
            message: "Session Cancelled!"
        });
    } catch (error) {
        console.log(error);
        next(err);
    }

});

exports.acceptSession = catchAsyncErrors(async (req, res, next) => {

    try {

        let session = await Session.findById(req.params.id);

        if (!(req.user._id.equals(session.tutor))) {
            return next(new ErrorResponse("Unauthorized Access.", 401));
        }

        session.time = JSON.parse(req.body.time);
        session.startDate = req.body.startDate;
        session.acceptDeclineDate = convertUTCDateToLocalDate(Date.now());
        session.status = "Ongoing";

        session.save();

        session = await session.populate("tutor");
        session = await session.populate("subject");

        res.status(200).json({
            success: true,
            session,
            message: "Session Accepted!"
        });
    } catch (error) {
        console.log(error);
        next(err);
    }

});

exports.doneSession = catchAsyncErrors(async (req, res, next) => {

    try {

        const session = await Session.findById(req.params.id)
            .populate("assessments");

        if (!(req.user._id.equals(session.tutor))) {
            return next(new ErrorResponse("Unauthorized Access.", 401));
        }

        session.endDate = convertUTCDateToLocalDate(Date.now());
        session.status = "Done";

        session.save();

        res.status(200).json({
            success: true,
            session,
            message: "Session Done!"
        });
    } catch (error) {
        console.log(error);
        next(err);
    }

});

exports.createSession = catchAsyncErrors(async (req, res, next) => {
    try {

        const { tutee, tutor, subject, description, startDate, endDate } = req.body;

        console.log(req.body)

        let createSession = new Session({
            tutor,
            tutee,
            subject,
            description,
            startDate,
            endDate
        });
        createSession.save().then(result => {
            res.status(200).json({ success: true });
        })
    } catch (error) {
        next(error);
    }
});

exports.findTutorSession = catchAsyncErrors(async (req, res, next) => {
    try {
        const sessions = await Session.find({ tutor: req.user._id, status: req.query.status })
            .sort({ updatedAt: -1 })
            .populate("tutor")
            .populate("tutee")
            .populate("subject");

        res.status(200).json({
            success: true,
            sessions
        })
    } catch (error) {
        next(new ErrorResponse('Session does not exist', 404));
    }
});

exports.findTuteeSession = catchAsyncErrors(async (req, res, next) => {
    try {
        const sessions = await Session.find({ tutee: req.user._id, status: req.query.status })
            .sort({ updatedAt: -1 })
            .populate("tutor")
            .populate("tutee")
            .populate("subject");

        res.status(200).json({
            success: true,
            sessions
        })
    } catch (error) {
        next(new ErrorResponse('Session not found', 404));
    }
});

exports.findAllTutorSession = catchAsyncErrors(async (req, res, next) => {
    try {
        const sessions = await Session.find({ tutor: req.user._id })
            .sort({ updatedAt: -1 })
            .populate("tutor")
            .populate("tutee")
            .populate("subject");

        res.status(200).json({
            success: true,
            sessions
        })
    } catch (error) {
        next(new ErrorResponse('Session does not exist', 404));
    }
});

exports.findAllTuteeSession = catchAsyncErrors(async (req, res, next) => {
    try {
        const sessions = await Session.find({ tutee: req.user._id })
            .sort({ updatedAt: -1 })
            .populate("tutor")
            .populate("tutee")
            .populate("subject");

        res.status(200).json({
            success: true,
            sessions
        })
    } catch (error) {
        next(new ErrorResponse('Session not found', 404));
    }
});

exports.allSession = catchAsyncErrors(async (req, res, next) => {
    try {

        Session.find()
            .then(result => {
                res.status(200).json(result);
            })
    } catch (error) {
        next(new ErrorResponse('Session not found', 404));
    }
});

exports.selectedSession = catchAsyncErrors(async (req, res, next) => {
    try {

        const session = await Session.findOne({ _id: req.params.id })
            .populate({
                path: 'tutee',
                populate: {
                    path: 'course'
                }
            })
            .populate({
                path: 'tutor',
                populate: {
                    path: 'course'
                }
            })
            .populate("subject")
            .populate("assessments", "-answers -questions.answer -questions.choices -subject");

        const tutor = await Tutor.findOne({ userID: session.tutor._id }).select("-subjects -numOfReviews -ratings -reviews");

        res.status(200).json({
            success: true,
            session,
            availability: tutor.availability
        });


    } catch (error) {
        next(new ErrorResponse('Session not found', 404));
    }
});

exports.reviewTutor = catchAsyncErrors(async (req, res, next) => {
    try {
        const tutee = req.user._id;
        const { sessionID, tutorID, subject, rating, comment } = req.body;

        const session = await Session.findById(sessionID);

        if (!tutee.equals(session.tutee)) {
            return next(new ErrorResponse("Unauthorized Access.", 401));
        }

        const tutor = await Tutor.findOne({ userID: tutorID });
        console.log(tutorID);
        const review = {
            tutee,
            subject,
            rating: Number(rating),
            comment,
            reviewDate: convertUTCDateToLocalDate(Date.now())
        }

        const isReviewed = tutor.reviews.find(
            r => r.tutee.toString() === req.user._id.toString() && r.subject.toString() === subject
        );

        if (isReviewed) {
            tutor.reviews.forEach(review => {
                if (review.tutee.toString() === req.user._id.toString() && review.subject.toString() === subject) {
                    review.comment = comment;
                    review.rating = rating;
                    review.reviewDate = convertUTCDateToLocalDate(Date.now());
                }
            });
        } else {
            tutor.reviews.push(review);
            tutor.numOfReviews = tutor.reviews.length;
        }

        tutor.ratings = tutor.reviews.reduce((acc, item) => item.rating + acc, 0) / tutor.reviews.length;

        await tutor.save({ validateBeforeSave: false });

        console.log(tutor);

        res.status(200).json({
            success: true,
            tutor
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

function convertUTCDateToLocalDate(date) {

    date = new Date(date);

    var localOffset = date.getTimezoneOffset() * 60000;

    var localTime = date.getTime();

    date = localTime - localOffset;

    //date = new Date(date);

    return date;

};

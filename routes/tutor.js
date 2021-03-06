const express = require('express');
const router = express.Router();

const { index, signUpTutor, addSubject, getCurrentTutor, findTutor, activateTutor, getTutorReviews, getTutees, reportsTopTutors, reportsTuteeYearLevel, updateAvailability, updateSubjects, updateAboutMe } = require('../controllers/tutor');

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


//ANALYTICS //

router.route("/reports/tutors/toprated").get(isAuthenticatedUser, authorizeRoles('admin'), reportsTopTutors);
router.route("/reports/tutee/yearlevel").get(isAuthenticatedUser, authorizeRoles('admin'), reportsTuteeYearLevel);
router.route("/tutor/signup").post(signUpTutor);
router.route("/tutor/activate").post(activateTutor);

router.route("/tutees").get(isAuthenticatedUser, authorizeRoles('admin'), getTutees);
router.route("/tutors").get(isAuthenticatedUser, index);
router.route("/tutor/subject/add").post(isAuthenticatedUser, addSubject);
router.route("/tutor/reviews/:id").get(isAuthenticatedUser, getTutorReviews);
router.route("/tutor/me").get(isAuthenticatedUser, getCurrentTutor);
router.route("/tutor/:id").get(isAuthenticatedUser, findTutor);
router.route("/tutor/update/availability").put(isAuthenticatedUser, updateAvailability);
router.route("/tutor/update/subjects").put(isAuthenticatedUser, updateSubjects);
router.route("/tutor/update/aboutme").put(isAuthenticatedUser, updateAboutMe);
//Browser


router.route("/web/tutors").get(isAuthenticatedUser, index);

module.exports = router;
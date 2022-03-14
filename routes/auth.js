const express = require('express');
const router = express.Router();

const { register,
    login,
    activate,
    googleLogin,
    logout,
    forgotpassword,
    resetpassword,
    getCurrentUser,
    updatePassword,
    allUsers,
    dashboard
} = require('../controllers/auth');

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/auth/register").post(register);

router.route("/auth/activate").post(activate);

router.route("/auth/login").post(login);

router.route("/auth/google/login").post(googleLogin);

router.route("/auth/logout").get(logout);

router.route("/auth/password/forgot").post(forgotpassword);

router.route("/auth/password/reset").post(resetpassword);

router.route("/profile/me").get(isAuthenticatedUser, getCurrentUser);

router.route("/auth/password/update").put(isAuthenticatedUser, updatePassword);


router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers);

router.route('/admin/data').get(isAuthenticatedUser, authorizeRoles('admin'),dashboard);

module.exports = router;
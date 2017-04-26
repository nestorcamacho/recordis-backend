const express = require("express");
const router = express.Router();

const passport = require("passport");

const authController = require("./controllers/auth.js");
const usersController = require("./controllers/users.js");

const requireAuth = passport.authenticate("jwt", {session: false});
const requireRole = authController.requireRole;

router.post("/auth/signup", authController.signup);
router.post("/auth/validateEmail", authController.validateEmail);
router.post("/auth/login", authController.login);
router.post("/auth/forgotPassword", authController.forgotPassword);
router.post("/auth/resetPassword", authController.resetPassword);

router.get("/users", requireAuth, requireRole(["ADMIN"]), usersController.list);

module.exports = router;

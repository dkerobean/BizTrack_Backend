const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, refreshToken } = require('../controllers/auth/authController');
const { getUserData } = require('../controllers/user/userController');

router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

router.post("/login", loginUser);

router.post('/refresh', refreshToken);

router.get("/profile", getUserData);


module.exports = router;
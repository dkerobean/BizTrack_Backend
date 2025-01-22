const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Helper function to generate tokens
const generateTokens = (userId, userRole) => {
    const accessToken = jwt.sign(
        { id: userId, role: userRole },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: userId, role: userRole },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email.");
    }
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        const newUser = new User({
            name,
            email,
            password,
            verificationCode,
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationCode);

        const { accessToken, refreshToken } = generateTokens(newUser._id, newUser.role);

        res.status(201).json({
            message: "User registered. Verification email sent.",
            accessToken,
            refreshToken,
            email: newUser.email
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.verificationCode !== parseInt(code)) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        user.emailVerified = true;
        user.verificationCode = null;

        await user.save();

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.emailVerified) {
            return res.status(403).json({ message: "Email not verified." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);

        res.status(200).json({
            accessToken,
            refreshToken,
            email: user.email,
            message: "Login successful."
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const tokens = generateTokens(user._id, user.role);

            res.status(200).json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Refresh token expired, please login again',
                    isExpired: true
                });
            }
            throw err;
        }
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ message: 'Server error: Unable to refresh token' });
    }
};
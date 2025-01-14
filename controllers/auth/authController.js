const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Function to send verification email
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

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Generate verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000);

    // Create new user - let the model handle password hashing
    const newUser = new User({
      name,
      email,
      password, // Pass the plain password - model middleware will hash it
      verificationCode,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered. Verification email sent.",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Verify email with the code
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

// User login
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

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};
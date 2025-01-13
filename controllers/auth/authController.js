const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Function to send verification email
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // Ensure it's a boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER, // Use SMTP_USER as the sender
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

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      verificationCode,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Generate JWT token after registration
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered. Verification email sent.",
      token, // Include the JWT token in the response
    });
  } catch (error) {
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

    console.log("Entered password:", password);  // Log the entered password
    console.log("Stored hashed password:", user.password);  // Log the stored hash from the database

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isMatch);  // Log comparison result

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

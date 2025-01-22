const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');


// Fetch User Data Controller
exports.getUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Error in getUserData:", error);
        res.status(500).json({ message: 'Server error: Unable to fetch user data' });
    }
};
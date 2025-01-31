const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const Organization = require('../../models/organizationModel');

exports.getUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                name: user.name,
                email: user.email,
                organization: user.organizationId,
            });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Token expired',
                    isExpired: true
                });
            }
            throw err;
        }
    } catch (error) {
        console.error("Error in getUserData:", error);
        res.status(500).json({ message: 'Server error: Unable to fetch user data' });
    }
};
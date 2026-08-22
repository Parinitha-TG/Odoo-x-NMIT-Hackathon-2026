const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { employeeId, name, email, password, role } = req.body;

    // Check required fields
    if (!employeeId || !name || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });
    }

    // Validate password
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }

    // Validate role
    if (!["employee", "hr"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role"
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    res.status(200).json({
        success: true,
        message: "Registration data validated and password hashed successfully",
       data: {
    employeeId,
    name,
    email,
    role
}
    });
};

module.exports = {
    register
};
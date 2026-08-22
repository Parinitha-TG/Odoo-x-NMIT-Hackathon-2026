const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

const register = async (req, res) => {
    const { employeeId, email, password, role } = req.body;

    // Check required fields
    if (!employeeId || !email || !password || !role) {
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
    const validRoles = ["EMPLOYEE", "HR_ADMIN"];

    if (!validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role. Use EMPLOYEE or HR_ADMIN"
        });
    }

    try {
        // Check whether employee ID or email already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from("users")
            .select("id, employee_id, email")
            .or(`employee_id.eq.${employeeId},email.eq.${email}`);

        if (checkError) {
            console.error("Supabase check error:", checkError);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee ID or email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const { data: user, error: insertError } = await supabase
            .from("users")
            .insert([
                {
                    employee_id: employeeId,
                    email: email,
                    password_hash: hashedPassword,
                    role: role,
                    is_verified: false
                }
            ])
            .select("id, employee_id, email, role, is_verified")
            .single();

        if (insertError) {
            console.error("Supabase insert error:", insertError);

            return res.status(500).json({
                success: false,
                message: "Failed to create user"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    register
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const register = async (req, res) => {
    const { employeeId, email, password, role } = req.body;

    if (!employeeId || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }

    if (!["EMPLOYEE", "HR_ADMIN"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role"
        });
    }

    try {
        const { data: existingUsers, error: checkError } = await supabase
            .from("users")
            .select("id, employee_id, email")
            .or(`employee_id.eq.${employeeId},email.eq.${email}`);

        if (checkError) {
            console.error(checkError);
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: user, error: insertError } = await supabase
            .from("users")
            .insert([{
                employee_id: employeeId,
                email,
                password_hash: hashedPassword,
                role,
                is_verified: false
            }])
            .select("id, employee_id, email, role, is_verified")
            .single();

        if (insertError) {
            console.error(insertError);
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, employee_id, email, password_hash, role, is_verified")
            .eq("email", email)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                employeeId: user.employee_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                employeeId: user.employee_id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    register,
    login
};
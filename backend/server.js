const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const requireRole = require("./middleware/rbacMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Test protected endpoint
app.get("/api/auth/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Test HR-only endpoint
app.get(
    "/api/auth/hr-test",
    authMiddleware,
    requireRole("HR_ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "HR access granted"
        });
    }
);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Dayflow backend is running"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Dayflow backend running on port ${PORT}`);
});
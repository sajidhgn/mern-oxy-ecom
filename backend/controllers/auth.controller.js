const {
    registerUser,
    sendVerificationEmail,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    getProfile
} = require('../services/authService');

const { registerValidation } = require('../validations/registerValidation');
const {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse
} = require('../utils/apiResponses');

// Register
exports.register = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return notFoundResponse(res, error.details[0].message);

    try {
        const { name, email, password, bio, phone, avatar } = req.body;
        if (!name || !email || !password) {
            return notFoundResponse(res, 'Name, email, and password are required.');
        }

        const { user, verificationToken } = await registerUser({
            name, email, password, bio, phone, avatar
        });

        await sendVerificationEmail(user, verificationToken);

        return successResponse(res, {}, "Registration successful. Please check your email to verify your account.");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const result = await verifyEmail(token);
        return successResponse(res, result, "Email verified successfully. Welcome to our platform!");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Resend Verification Email
exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await resendVerificationEmail(email);
        return successResponse(res, {}, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        return successResponse(res, result, "Login successful");
    } catch (err) {
        if (err.message.includes('invalid') || err.message.includes('inactive')) {
            return unauthorizedResponse(res, err.message);
        }
        return errorResponse(res, err.message);
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await forgotPassword(email);
        return successResponse(res, {}, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await resetPassword(token, newPassword);
        return successResponse(res, {}, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const userId = req.user?.id;
        const result = await logoutUser(token, userId);

        if (userId) {
            req.session.destroy((err) => {
                if (err) return errorResponse(res, "Logout failed");
                res.clearCookie("connect.sid");
                return successResponse(res, {}, result);
            });
        } else {
            return successResponse(res, {}, result);
        }
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await getProfile(req.user.id);
        return successResponse(res, user, "Profile fetched successfully");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};
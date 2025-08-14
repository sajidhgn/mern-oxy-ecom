const bcrypt = require("bcryptjs");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const {
  generateAccessToken,
  generateRandomPassword,
  generateHashedPassword,
} = require("../utils/jwtToken");
const { sendEmail } = require("../utils/mailer");

// Register a new user
const registerUser = async (userData) => {
  const { name, email, password, bio, phone, avatar } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email already exists.");

  const hashedPassword = await generateHashedPassword(password);
  const verificationToken = generateRandomPassword(10);

  const user = new User({
    name,
    email,
    bio,
    phone,
    avatar,
    password: hashedPassword,
    role: "USER",
    verificationToken,
    verificationTokenExpires: Date.now() + 3600000,
  });

  await user.save();

  return {
    user,
    verificationToken,
  };
};

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await sendEmail(
    user.email,
    "Verify your email",
    `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  );
};

// Verify user's email
const verifyEmail = async (token) => {
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token.");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  const authToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  return {
    token: authToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Resend verification email
const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found.");
  if (user.isVerified) throw new Error("Email already verified.");

  const newVerificationToken = generateRandomPassword(10);
  const newVerificationTokenExpires = Date.now() + 3600000;

  user.verificationToken = newVerificationToken;
  user.verificationTokenExpires = newVerificationTokenExpires;
  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;

  await sendEmail(
    email,
    "Verify your email",
    `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  );

  return "New verification link sent.";
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  if (!user.isVerified)
    throw new Error("Your account is inactive. Please contact support.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const token = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return {
    token,
    user: userData,
  };
};

// Forgot password
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = generateRandomPassword(10);
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email,
    "Reset your password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  );

  return "Password reset link sent to your email.";
};

// Reset password
const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token.");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return "Password successfully reset.";
};

// Logout user
const logoutUser = async (token, userId) => {
  if (token) {
    await BlacklistedToken.create({ token });
  }

  return "Logout successful";
};

// Get profile
const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found.");
  return user;
};

module.exports = {
  registerUser,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  getProfile,
};

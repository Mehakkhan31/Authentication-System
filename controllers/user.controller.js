import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const user = User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not registered!",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;

    await user.save();

    // send email

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      ports,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: user.email,
      recivers,
      subject: "verify your email",
      text: `Please click on the following link:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
            `,
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered!",
      error,
      success: false,
    });
  }
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "shhhhh", {
      expiresIn: "24h",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
    
  } catch (error) {
    res.status(400).json({
      message: "Login failed!",
      error,
      success: false,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(400).json({
        message: "User not registered!",
        success: false
      });
    }

    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '')

      return res.status(200).json({
        message: "Logged out successfully",
        success: true
      });
  } catch (error) {
    
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required!",
    });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: user.email,
      subject: "Reset Your Password",
      text: `Please click on the following link to reset your password:
            ${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}
            This link will expire in 1 hour.
            `,
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to send reset email!",
      error,
      success: false,
    });
  }
}

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: "Token and password are required!",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token!",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Password reset failed!",
      error,
      success: false,
    });
  }
}
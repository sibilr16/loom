import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.schema.js";
import generateToken from "../utils/generateToken.js";

const adminLoginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const userId = admin._id;
    generateToken(res, userId);

    res.status(200).json({
      success: true,
      user: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default adminLoginHandler;

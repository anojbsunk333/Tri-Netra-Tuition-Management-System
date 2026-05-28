import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Create user
    const newUser = User.create({ name, email, password, role });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: newUser.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!User.verifyPassword(user.password, password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
}

import { randomUUID } from "crypto";
import { getCollection, createItem, updateItem } from "../utils/db.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, verifyPassword } from "../models/User.js";

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

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

    const users = await getCollection("users");
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newUser = {
      id: randomUUID(),
      name,
      email,
      password: hashPassword(password),
      role,
      createdAt: new Date().toISOString(),
    };

    await createItem("users", newUser);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: sanitizeUser(newUser),
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

    const users = await getCollection("users");
    const user = users.find((u) => u.email === email);

    if (!user || !verifyPassword(user.password, password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
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

export async function getMe(req, res) {
  const users = await getCollection("users");
  const user = users.find((item) => String(item.id) === String(req.user?.id));
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user: sanitizeUser(user) });
}

export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Old password and new password are required",
    });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  const users = await getCollection("users");
  const user = users.find((item) => String(item.id) === String(req.user?.id));
  if (!user || !verifyPassword(user.password, oldPassword)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  const updatedUser = await updateItem("users", user.id, {
    password: hashPassword(newPassword),
  });

  res.json({
    success: true,
    message: "Password updated successfully",
    user: sanitizeUser(updatedUser),
  });
}

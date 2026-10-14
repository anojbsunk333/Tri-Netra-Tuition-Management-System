import { randomUUID } from "crypto";
import { getCollection, createItem, updateItem } from "../utils/db.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, verifyPassword } from "../models/User.js";
import { normalizeEmail } from "../utils/emailValidation.js";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../utils/phoneValidation.js";

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function nextStudentId(students) {
  const highest = students.reduce((max, student) => {
    const match = String(student.id || "").match(/^S(\d+)$/i);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `S${String(highest + 1).padStart(3, "0")}`;
}

export async function register(req, res) {
  try {
    const { role } = req.body;

    if (typeof role !== "undefined") {
      return res.status(403).json({
        success: false,
        message:
          "Public registration is disabled. Please contact the administrator.",
      });
    }

    return res.status(403).json({
      success: false,
      message:
        "Public registration is disabled. Please contact the administrator.",
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
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((u) => normalizeEmail(u.email) === normalizedEmail);

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

export async function updateProfile(req, res) {
  const { name, phone } = req.body;
  const changes = {};

  if (Object.prototype.hasOwnProperty.call(req.body, "phone")) {
    const phoneValue = phone == null ? "" : String(phone).trim();
    if (phoneValue && !isValidNepalMobile(phoneValue)) {
      return res
        .status(400)
        .json({ success: false, message: INVALID_NEPAL_MOBILE_MESSAGE });
    }
    changes.phone = phoneValue;
  }

  if (typeof name === "string" && name.trim()) changes.name = name.trim();

  if (Object.keys(changes).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No profile changes provided" });
  }

  const updatedUser = await updateItem("users", req.user.id, changes);
  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Keep the linked student profile in sync with editable account details.
  const studentId = updatedUser.studentId || updatedUser.rollNo;
  if (updatedUser.role === "student" && studentId) {
    const studentChanges = {};
    if (changes.name) studentChanges.name = changes.name;
    if (Object.prototype.hasOwnProperty.call(changes, "phone")) {
      studentChanges.phone = changes.phone;
    }
    if (Object.keys(studentChanges).length) {
      await updateItem("students", studentId, studentChanges);
    }
  }

  res.json({ success: true, user: sanitizeUser(updatedUser) });
}

import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";
import { getStudentForUser } from "../utils/studentAccess.js";
import { getAllowedStudentsForTeacher } from "../utils/teacherAccess.js";
import { hashPassword } from "../models/User.js";
import {
  normalizeEmail,
  validateEmailFormat,
  validateUniqueEmail,
} from "../utils/emailValidation.js";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../utils/phoneValidation.js";

const resource = "students";
const VALID_CLASSES = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const VALID_BATCHES = ["Morning", "Day", "Evening"];
function sanitizeUser(user) {
  if (!user) return null;
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

function validateAuthorizedStudentPayload(payload) {
  const fields = {
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim(),
    password: String(payload.password || ""),
    class: String(payload.class || "").trim(),
    batch: String(payload.batch || "").trim(),
    phone: payload.phone == null ? "" : String(payload.phone).trim(),
    parent: String(payload.parent || "").trim(),
    feeStatus: String(payload.feeStatus || "due")
      .trim()
      .toLowerCase(),
  };

  if (!fields.name) {
    return { ok: false, message: "Student name is required" };
  }

  if (!fields.email) {
    return { ok: false, message: "Email is required" };
  }

  if (fields.phone && !isValidNepalMobile(fields.phone)) {
    return { ok: false, message: INVALID_NEPAL_MOBILE_MESSAGE };
  }

  const emailValidation = validateEmailFormat(fields.email);
  if (!emailValidation.ok) return emailValidation;
  fields.email = emailValidation.normalized;

  if (!fields.password) {
    return { ok: false, message: "Temporary password is required" };
  }

  if (fields.password.length < 6) {
    return {
      ok: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (fields.class && !VALID_CLASSES.includes(fields.class)) {
    return { ok: false, message: "Invalid class selection" };
  }

  if (fields.batch && !VALID_BATCHES.includes(fields.batch)) {
    return { ok: false, message: "Invalid batch selection" };
  }

  const allowedFeeStatuses = ["paid", "due", "partial"];
  if (!allowedFeeStatuses.includes(fields.feeStatus)) {
    return { ok: false, message: "Invalid fee status" };
  }

  return { ok: true, fields };
}

export async function listStudents(req, res) {
  try {
    const students = await getCollection(resource);
    if (req.user?.role === "teacher") {
      const allowedStudents = await getAllowedStudentsForTeacher(req.user);
      if (!allowedStudents) {
        return res.status(403).json({
          success: false,
          message: "Teacher assignment is not configured",
        });
      }
      return res.json(allowedStudents);
    }
    res.json(students);
  } catch (error) {
    console.error("List students error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch students",
    });
  }
}

export async function getMyStudentOverview(req, res) {
  try {
    const student = await getStudentForUser(req.user);

    if (!student) {
      return res.json({ student: null, attendance: [], exams: [], fees: [] });
    }

    const [attendance, exams, fees] = await Promise.all([
      getCollection("attendance"),
      getCollection("exams"),
      getCollection("fees"),
    ]);

    res.json({
      student,
      attendance: attendance.filter(
        (item) => String(item.studentId) === String(student.id),
      ),
      exams: exams.filter(
        (item) => String(item.student) === String(student.id),
      ),
      fees: fees.filter((item) => String(item.student) === String(student.id)),
    });
  } catch (error) {
    console.error("Student overview error:", error);
    res.status(500).json({ message: "Unable to load student overview" });
  }
}

export async function getStudent(req, res) {
  try {
    if (req.user?.role === "student") {
      const linkedStudent = await getStudentForUser(req.user);

      if (!linkedStudent) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      if (String(linkedStudent.id) !== String(req.params.id)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }
    }

    const students = await getCollection(resource);

    const student = students.find(
      (st) => String(st.id) === String(req.params.id),
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    console.error("Get student error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch student",
    });
  }
}

export async function createStudent(req, res) {
  try {
    const payload = req.body || {};
    const validation = validateAuthorizedStudentPayload(payload);

    if (!validation.ok) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      name,
      email,
      password,
      class: className,
      batch,
      phone,
      parent,
      feeStatus,
    } = validation.fields;

    const emailValidation = await validateUniqueEmail(email);
    if (!emailValidation.ok) {
      return res.status(409).json({
        success: false,
        message: emailValidation.message,
      });
    }
    const normalizedEmail = emailValidation.normalized;

    const students = await getCollection(resource);
    const studentId = nextStudentId(students);
    const userId = randomUUID();
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      name,
      email: normalizedEmail,
      password: hashPassword(password),
      role: "student",
      phone,
      studentId,
      rollNo: studentId,
      createdAt: now,
    };

    const newStudent = {
      id: studentId,
      name,
      email: normalizedEmail,
      class: className || "",
      batch: batch || "",
      phone: phone || "",
      parent: parent || "",
      feeStatus,
      attendance: 0,
      gpa: 0,
      joined: now,
    };

    let createdUser = null;
    let createdStudent = null;

    try {
      createdUser = await createItem("users", newUser);
      createdStudent = await createItem(resource, newStudent);
    } catch (error) {
      if (createdUser) {
        await deleteItem("users", createdUser.id);
      }
      throw error;
    }

    const userRecord = sanitizeUser(createdUser);

    return res.status(201).json({
      success: true,
      message: "Student account created successfully.",
      student: createdStudent,
      user: userRecord,
      studentId,
      email: normalizedEmail,
      initialPassword: password,
    });
  } catch (error) {
    console.error("Create student error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create student account",
    });
  }
}

export async function updateStudent(req, res) {
  try {
    const students = await getCollection(resource);
    const student = students.find(
      (item) => String(item.id) === String(req.params.id),
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      name,
      email,
      class: className,
      batch,
      phone,
      parent,
      feeStatus,
    } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name cannot be empty",
      });
    }

    if (
      feeStatus !== undefined &&
      !["paid", "due", "partial"].includes(feeStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee status",
      });
    }

    const normalizedPhone =
      phone === undefined ? undefined : String(phone ?? "").trim();
    if (normalizedPhone && !isValidNepalMobile(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: INVALID_NEPAL_MOBILE_MESSAGE,
      });
    }

    const changes = {};

    const users = await getCollection("users");
    const linkedUser = users.find(
      (user) =>
        String(user.studentId || user.rollNo || "") === String(student.id),
    );

    if (email !== undefined) {
      const normalizedEmail = normalizeEmail(email);
      if (normalizedEmail !== normalizeEmail(student.email)) {
        const emailValidation = await validateUniqueEmail(
          normalizedEmail,
          linkedUser?.id,
        );
        if (!emailValidation.ok) {
          return res.status(emailValidation.status).json({
            success: false,
            message: emailValidation.message,
          });
        }
      }
      changes.email = normalizedEmail;
    }

    if (name !== undefined) changes.name = String(name).trim();
    if (className !== undefined) changes.class = className;
    if (batch !== undefined) changes.batch = batch;
    if (normalizedPhone !== undefined) changes.phone = normalizedPhone;
    if (parent !== undefined) changes.parent = parent;
    if (feeStatus !== undefined) changes.feeStatus = feeStatus;

    const updatedStudent = await updateItem(resource, req.params.id, changes);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (linkedUser) {
      const userChanges = {};
      if (changes.name) userChanges.name = changes.name;
      if (changes.phone !== undefined) userChanges.phone = changes.phone;
      if (changes.email) userChanges.email = changes.email;
      if (Object.keys(userChanges).length > 0) {
        await updateItem("users", linkedUser.id, userChanges);
      }
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Update student error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update student",
    });
  }
}

export async function deleteStudent(req, res) {
  try {
    const students = await getCollection(resource);
    const student = students.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const users = await getCollection("users");
    const linkedUser = users.find(
      (user) =>
        String(user.studentId || user.rollNo || "") === String(student.id),
    );

    const deleted = await deleteItem(resource, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (linkedUser) {
      await deleteItem("users", linkedUser.id);
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete student",
    });
  }
}

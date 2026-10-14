import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";
import { hashPassword } from "../models/User.js";
import {
  normalizeEmail,
  validateUniqueEmail,
} from "../utils/emailValidation.js";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../utils/phoneValidation.js";

const resource = "teachers";

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function normalizeClasses(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeTeacherPayload(payload = {}) {
  const name = String(payload.name || "").trim();
  const subject = String(payload.subject || "").trim();
  const batch = String(payload.batch || "").trim();
  const phone = payload.phone == null ? "" : String(payload.phone).trim();
  const email = String(payload.email || "").trim();
  const password = String(payload.password || "");
  const classes = normalizeClasses(payload.classes);

  return { name, subject, batch, phone, email, password, classes };
}

function nextTeacherCode(teachers) {
  const highest = teachers.reduce((max, teacher) => {
    const source = teacher.teacherCode || teacher.id;
    const match = String(source || "").match(/^T(\d+)$/i);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `T${String(highest + 1).padStart(3, "0")}`;
}

async function getTeachersWithCodes() {
  const teachers = await getCollection(resource);
  let highestCode = teachers.reduce((max, teacher) => {
    const source = teacher.teacherCode || teacher.id;
    const match = String(source || "").match(/^T(\d+)$/i);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  for (const teacher of teachers) {
    if (teacher.teacherCode) continue;
    const legacyCode = String(teacher.id || "").match(/^T\d+$/i)?.[0];
    if (legacyCode) {
      teacher.teacherCode = legacyCode.toUpperCase();
      await updateItem(resource, teacher.id, {
        teacherCode: teacher.teacherCode,
      });
      continue;
    }
    highestCode += 1;
    teacher.teacherCode = `T${String(highestCode).padStart(3, "0")}`;
    await updateItem(resource, teacher.id, {
      teacherCode: teacher.teacherCode,
    });
  }

  return teachers;
}

export async function listTeachers(req, res) {
  const teachers = await getTeachersWithCodes();
  res.json(teachers);
}

export async function getTeacher(req, res) {
  const teachers = await getTeachersWithCodes();
  const teacher = teachers.find((t) => String(t.id) === String(req.params.id));
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  res.json(teacher);
}

export async function createTeacher(req, res) {
  try {
    const payload = normalizeTeacherPayload(req.body);

    if (!payload.name || !payload.subject) {
      return res
        .status(400)
        .json({ message: "Teacher name and subject are required" });
    }

    if (payload.phone && !isValidNepalMobile(payload.phone)) {
      return res
        .status(400)
        .json({ message: INVALID_NEPAL_MOBILE_MESSAGE });
    }

    if (!payload.email) {
      return res.status(400).json({ message: "Teacher email is required" });
    }

    if (!payload.password) {
      return res
        .status(400)
        .json({ message: "Temporary password is required" });
    }

    if (payload.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const duplicateCheck = await validateUniqueEmail(payload.email);
    if (!duplicateCheck.ok) {
      return res
        .status(duplicateCheck.status)
        .json({ message: duplicateCheck.message });
    }

    const teachers = await getCollection(resource);
    const newTeacher = {
      id: randomUUID(),
      teacherCode: nextTeacherCode(teachers),
      name: payload.name,
      subject: payload.subject,
      batch: payload.batch || "",
      phone: payload.phone || "",
      email: duplicateCheck.normalized,
      classes: payload.classes,
      joined: new Date().toISOString(),
    };

    const newUser = {
      id: randomUUID(),
      name: payload.name,
      email: duplicateCheck.normalized,
      password: hashPassword(payload.password),
      role: "teacher",
      phone: payload.phone || "",
      subject: payload.subject,
      batch: payload.batch || "",
      createdAt: new Date().toISOString(),
    };

    let createdUser = null;
    let createdTeacher = null;

    try {
      createdUser = await createItem("users", newUser);
      createdTeacher = await createItem(resource, newTeacher);
    } catch (error) {
      if (createdUser) {
        await deleteItem("users", createdUser.id);
      }
      throw error;
    }

    return res.status(201).json({
      ...createdTeacher,
      user: sanitizeUser(createdUser),
      initialPassword: payload.password,
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    return res.status(500).json({
      message: "Unable to create teacher account",
    });
  }
}

export async function updateTeacher(req, res) {
  try {
    const teachers = await getCollection(resource);
    const teacher = teachers.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const payload = normalizeTeacherPayload(req.body);
    const changes = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
      changes.name = payload.name || teacher.name;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "subject")) {
      changes.subject = payload.subject || teacher.subject;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "batch")) {
      changes.batch = payload.batch || "";
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "phone")) {
      if (payload.phone && !isValidNepalMobile(payload.phone)) {
        return res
          .status(400)
          .json({ message: INVALID_NEPAL_MOBILE_MESSAGE });
      }
      changes.phone = payload.phone || "";
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "email")) {
      const emailValue = normalizeEmail(payload.email);
      if (!emailValue) {
        return res.status(400).json({ message: "Teacher email is required" });
      }
      if (emailValue !== normalizeEmail(teacher.email)) {
        const users = await getCollection("users");
        const linkedUser = users.find(
          (user) =>
            normalizeEmail(user.email) === normalizeEmail(teacher.email),
        );
        const emailCheck = await validateUniqueEmail(
          emailValue,
          linkedUser?.id,
        );
        if (!emailCheck.ok) {
          return res
            .status(emailCheck.status)
            .json({ message: emailCheck.message });
        }
      }
      changes.email = emailValue;
    }
    if (
      Object.prototype.hasOwnProperty.call(req.body, "password") &&
      String(req.body.password || "").trim()
    ) {
      changes.password = payload.password;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, "classes")) {
      changes.classes = normalizeClasses(req.body.classes);
    }

    if (Object.keys(changes).length === 0) {
      return res.json(teacher);
    }

    const previousName = String(teacher.name || "").trim();
    const nextName = String(changes.name || teacher.name || "").trim();
    const updatedTeacher = await updateItem(resource, req.params.id, changes);

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (previousName && previousName !== nextName) {
      const batches = await getCollection("batches");
      for (const batch of batches) {
        if (String(batch.teacher || "").trim() === previousName) {
          await updateItem("batches", batch.id, { teacher: nextName });
        }
      }
    }

    const userUpdates = {};
    if (Object.prototype.hasOwnProperty.call(changes, "name")) {
      userUpdates.name = changes.name;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "phone")) {
      userUpdates.phone = changes.phone;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "email")) {
      userUpdates.email = changes.email;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "subject")) {
      userUpdates.subject = changes.subject;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "batch")) {
      userUpdates.batch = changes.batch;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "password")) {
      userUpdates.password = hashPassword(changes.password);
    }

    const users = await getCollection("users");
    const linkedUser = users.find(
      (user) =>
        String(user.email || "")
          .trim()
          .toLowerCase() ===
          String(teacher.email || "")
            .trim()
            .toLowerCase() ||
        String(user.email || "")
          .trim()
          .toLowerCase() ===
          String(changes.email || teacher.email || "")
            .trim()
            .toLowerCase(),
    );

    if (linkedUser && Object.keys(userUpdates).length > 0) {
      await updateItem("users", linkedUser.id, userUpdates);
    }

    res.json(updatedTeacher);
  } catch (error) {
    console.error("Update teacher error:", error);
    return res.status(500).json({ message: "Unable to update teacher" });
  }
}

export async function deleteTeacher(req, res) {
  try {
    const teachers = await getCollection(resource);
    const teacher = teachers.find(
      (item) => String(item.id) === String(req.params.id),
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const batches = await getCollection("batches");
    const teacherName = String(teacher.name || "")
      .trim()
      .toLowerCase();
    const isAssigned = batches.some((batch) => {
      const assignedTeacher = String(batch.teacher || "")
        .trim()
        .toLowerCase();
      return assignedTeacher === teacherName;
    });

    if (isAssigned) {
      return res.status(409).json({
        message:
          "Teacher is assigned to a batch. Reassign the batch before deleting.",
      });
    }

    const deleted = await deleteItem(resource, req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const users = await getCollection("users");
    const linkedUser = users.find(
      (user) =>
        String(user.email || "")
          .trim()
          .toLowerCase() ===
        String(teacher.email || "")
          .trim()
          .toLowerCase(),
    );

    if (linkedUser) {
      await deleteItem("users", linkedUser.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return res.status(500).json({ message: "Unable to delete teacher" });
  }
}

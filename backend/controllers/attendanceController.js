import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";
import {
  findAllowedStudent,
  getAllowedStudentsForTeacher,
} from "../utils/teacherAccess.js";

const resource = "attendance";
const sessionResource = "attendanceSessions";

const ALLOWED_STATUS = ["present", "absent"];
const ALLOWED_ATTENDANCE_FIELDS = [
  "studentId",
  "name",
  "batch",
  "date",
  "status",
  "source",
  "sessionId",
  "teacherId",
];

// =========================================================
// HELPERS
// =========================================================

function normalizeStatus(status) {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  return ALLOWED_STATUS.includes(normalized) ? normalized : null;
}

function sanitizeAttendanceFields(input = {}) {
  const picked = {};

  for (const field of ALLOWED_ATTENDANCE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      picked[field] = input[field];
    }
  }

  return picked;
}

// =========================================================
// LIST ATTENDANCE
// =========================================================

export async function listAttendance(req, res) {
  try {
    const attendance = await getCollection(resource);

    if (req.user?.role === "teacher") {
      const students = await getAllowedStudentsForTeacher(req.user);
      if (!students) {
        return res.status(403).json({
          success: false,
          message: "Teacher assignment is not configured",
        });
      }
      const allowedIds = new Set(students.map((student) => String(student.id)));
      return res.json(
        attendance.filter((item) => allowedIds.has(String(item.studentId))),
      );
    }

    res.json(attendance);
  } catch (error) {
    console.error("List attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load attendance records",
    });
  }
}

// =========================================================
// GET SINGLE ATTENDANCE
// =========================================================

export async function getAttendance(req, res) {
  try {
    const attendance = await getCollection(resource);

    const record = attendance.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json(record);
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load attendance record",
    });
  }
}

// =========================================================
// CREATE / UPDATE MANUAL ATTENDANCE
// =========================================================

export async function createAttendance(req, res) {
  try {
    const payload = sanitizeAttendanceFields(req.body);
    const { studentId, name, batch, date, status } = payload;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Student ID, date, and status are required",
      });
    }

    // -------------------------------------------------------
    // Validate status
    // -------------------------------------------------------

    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        message: "Status must be either present or absent",
      });
    }

    // -------------------------------------------------------
    // Get existing attendance
    // -------------------------------------------------------

    const attendance = await getCollection(resource);

    if (req.user?.role === "teacher") {
      const students = await getAllowedStudentsForTeacher(req.user);
      if (!students || !findAllowedStudent(students, studentId)) {
        return res.status(403).json({
          success: false,
          message: "Student is outside your assigned batch",
        });
      }
    }

    // -------------------------------------------------------
    // Prevent duplicate attendance for same student/date
    // -------------------------------------------------------

    const existingRecord = attendance.find(
      (item) =>
        String(item.studentId) === String(studentId) &&
        String(item.date) === String(date),
    );

    // -------------------------------------------------------
    // Update existing record
    // -------------------------------------------------------

    if (existingRecord) {
      const updatedRecord = await updateItem(resource, existingRecord.id, {
        name: name || existingRecord.name || "",
        batch: batch || existingRecord.batch || "",
        date,
        status: normalizedStatus,
        source: payload.source || existingRecord.source || "manual",
      });

      return res.json({
        ...updatedRecord,
        updated: true,
      });
    }

    // -------------------------------------------------------
    // Create new record
    // -------------------------------------------------------

    const newRecord = {
      id: randomUUID(),

      studentId,

      name: name || "",

      batch: batch || "",

      date,

      status: normalizedStatus,

      source: payload.source || "manual",

      createdAt: new Date().toISOString(),
    };

    await createItem(resource, newRecord);

    res.status(201).json({
      ...newRecord,
      updated: false,
    });
  } catch (error) {
    console.error("Create attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save attendance",
    });
  }
}

// =========================================================
// CREATE QR ATTENDANCE SESSION
// =========================================================

export async function createAttendanceSession(req, res) {
  try {
    const payload = sanitizeAttendanceFields(req.body);
    const { batch, date } = payload;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (!batch || !date) {
      return res.status(400).json({
        success: false,
        message: "Batch and date are required to start a session",
      });
    }

    // -------------------------------------------------------
    // Prevent duplicate active session
    // -------------------------------------------------------

    const sessions = await getCollection(sessionResource);

    const existingSession = sessions.find(
      (item) =>
        String(item.batch).toLowerCase() === String(batch).toLowerCase() &&
        String(item.date) === String(date),
    );

    if (existingSession) {
      return res.json({
        ...existingSession,
        existing: true,
      });
    }

    // -------------------------------------------------------
    // Create session
    // -------------------------------------------------------

    const session = {
      id: randomUUID(),

      batch,

      date,

      teacherId: req.user?.id || null,

      createdAt: new Date().toISOString(),
    };

    await createItem(sessionResource, session);

    res.status(201).json({
      ...session,
      existing: false,
    });
  } catch (error) {
    console.error("Create attendance session error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create attendance session",
    });
  }
}

// =========================================================
// QR ATTENDANCE SCAN
// =========================================================

export async function scanAttendanceQr(req, res) {
  try {
    const payload = sanitizeAttendanceFields(req.body);
    const { sessionId, studentId, status } = payload;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (!sessionId || !studentId || !status) {
      return res.status(400).json({
        success: false,
        message: "Session ID, student ID, and status are required for QR scan",
      });
    }

    // -------------------------------------------------------
    // Validate status
    // -------------------------------------------------------

    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        message: "Status must be either present or absent",
      });
    }

    // -------------------------------------------------------
    // Find session
    // -------------------------------------------------------

    const sessions = await getCollection(sessionResource);

    const session = sessions.find(
      (item) => String(item.id) === String(sessionId),
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Attendance session not found",
      });
    }

    // -------------------------------------------------------
    // Check whether student already scanned
    // -------------------------------------------------------

    const attendance = await getCollection(resource);

    const existingRecord = attendance.find(
      (item) =>
        String(item.sessionId) === String(sessionId) &&
        String(item.studentId) === String(studentId),
    );

    // -------------------------------------------------------
    // Update existing QR attendance
    // -------------------------------------------------------

    if (existingRecord) {
      const updatedRecord = await updateItem(resource, existingRecord.id, {
        status: normalizedStatus,
        source: "qr",
      });

      return res.json({
        ...updatedRecord,
        alreadyScanned: true,
        updated: true,
      });
    }

    // -------------------------------------------------------
    // Create QR attendance record
    // -------------------------------------------------------

    const record = {
      id: randomUUID(),

      studentId,

      batch: session.batch,

      date: session.date,

      status: normalizedStatus,

      source: "qr",

      sessionId,

      createdAt: new Date().toISOString(),
    };

    await createItem(resource, record);

    res.status(201).json({
      ...record,
      alreadyScanned: false,
      updated: false,
    });
  } catch (error) {
    console.error("QR attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to record QR attendance",
    });
  }
}

// =========================================================
// ATTENDANCE REPORT
// =========================================================

export async function attendanceReport(req, res) {
  try {
    const { month, batch, studentId } = req.query;

    const attendance = await getCollection(resource);

    let filtered = [...attendance];

    // -------------------------------------------------------
    // Filter by month
    // Expected format: YYYY-MM
    // -------------------------------------------------------

    if (month) {
      filtered = filtered.filter((item) =>
        String(item.date || "").startsWith(String(month)),
      );
    }

    // -------------------------------------------------------
    // Filter by batch
    // -------------------------------------------------------

    if (batch) {
      filtered = filtered.filter(
        (item) =>
          String(item.batch || "").toLowerCase() ===
          String(batch).toLowerCase(),
      );
    }

    // -------------------------------------------------------
    // Filter by student
    // -------------------------------------------------------

    if (studentId) {
      filtered = filtered.filter(
        (item) => String(item.studentId) === String(studentId),
      );
    }

    // -------------------------------------------------------
    // Build student report
    // -------------------------------------------------------

    const reportMap = {};

    filtered.forEach((record) => {
      const id = record.studentId || "unknown";

      if (!reportMap[id]) {
        reportMap[id] = {
          studentId: id,
          name: record.name || "",
          batch: record.batch || "",
          total: 0,
          present: 0,
          absent: 0,
        };
      }

      reportMap[id].total += 1;

      if (String(record.status).toLowerCase() === "present") {
        reportMap[id].present += 1;
      }

      if (String(record.status).toLowerCase() === "absent") {
        reportMap[id].absent += 1;
      }
    });

    // -------------------------------------------------------
    // Calculate percentages
    // -------------------------------------------------------

    const report = Object.values(reportMap).map((student) => {
      const percentage =
        student.total > 0 ? (student.present / student.total) * 100 : 0;

      return {
        ...student,

        percentage: Number(percentage.toFixed(2)),
      };
    });

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    res.json({
      success: true,

      filters: {
        month: month || "all",
        batch: batch || "all",
        studentId: studentId || "all",
      },

      totalRecords: filtered.length,

      report,
    });
  } catch (error) {
    console.error("Attendance report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate attendance report",
    });
  }
}

// =========================================================
// UPDATE ATTENDANCE
// =========================================================

export async function updateAttendance(req, res) {
  try {
    const attendance = await getCollection(resource);
    const existingRecord = attendance.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    if (req.user?.role === "teacher") {
      const students = await getAllowedStudentsForTeacher(req.user);
      if (
        !students ||
        !findAllowedStudent(students, existingRecord.studentId)
      ) {
        return res.status(403).json({
          success: false,
          message: "Student is outside your assigned batch",
        });
      }
    }

    const payload = sanitizeAttendanceFields(req.body);
    const { status, ...otherChanges } = payload;

    const changes = {
      ...otherChanges,
    };

    // -------------------------------------------------------
    // Validate status if provided
    // -------------------------------------------------------

    if (status !== undefined) {
      const normalizedStatus = normalizeStatus(status);

      if (!normalizedStatus) {
        return res.status(400).json({
          success: false,
          message: "Status must be either present or absent",
        });
      }

      changes.status = normalizedStatus;
    }

    // -------------------------------------------------------
    // Update record
    // -------------------------------------------------------

    const updatedRecord = await updateItem(resource, req.params.id, changes);

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error("Update attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update attendance record",
    });
  }
}

// =========================================================
// DELETE ATTENDANCE
// =========================================================

export async function deleteAttendance(req, res) {
  try {
    const deleted = await deleteItem(resource, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Delete attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete attendance record",
    });
  }
}

import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "attendance";
const sessionResource = "attendanceSessions";

export async function listAttendance(req, res) {
  const attendance = await getCollection(resource);
  res.json(attendance);
}

export async function getAttendance(req, res) {
  const attendance = await getCollection(resource);
  const record = attendance.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!record)
    return res.status(404).json({ message: "Attendance record not found" });
  res.json(record);
}

export async function createAttendance(req, res) {
  const { studentId, name, batch, date, status } = req.body;
  if (!studentId || !status || !date) {
    return res
      .status(400)
      .json({ message: "Student ID, date, and status are required" });
  }

  const newRecord = {
    id: randomUUID(),
    studentId,
    name: name || "",
    batch: batch || "",
    date,
    status,
    source: "manual",
  };

  await createItem(resource, newRecord);
  res.status(201).json(newRecord);
}

export async function createAttendanceSession(req, res) {
  const { batch, date, teacherId } = req.body;
  if (!batch || !date) {
    return res
      .status(400)
      .json({ message: "Batch and date are required to start a session" });
  }

  const session = {
    id: randomUUID(),
    batch,
    date,
    teacherId: teacherId || req.user?.id,
    createdAt: new Date().toISOString(),
  };

  await createItem(sessionResource, session);
  res.status(201).json(session);
}

export async function scanAttendanceQr(req, res) {
  const { sessionId, studentId, status } = req.body;
  if (!sessionId || !studentId || !status) {
    return res.status(400).json({
      message: "Session ID, student ID, and status are required for QR scan",
    });
  }

  const sessions = await getCollection(sessionResource);
  const session = sessions.find(
    (item) => String(item.id) === String(sessionId),
  );
  if (!session) {
    return res.status(404).json({ message: "Attendance session not found" });
  }

  const record = {
    id: randomUUID(),
    studentId,
    batch: session.batch,
    date: session.date,
    status,
    source: "qr",
    sessionId,
  };

  await createItem(resource, record);
  res.status(201).json(record);
}

export async function attendanceReport(req, res) {
  const month = req.query.month?.toLowerCase();
  const attendance = await getCollection(resource);
  const filtered = month
    ? attendance.filter((item) =>
        String(item.date).toLowerCase().includes(month),
      )
    : attendance;

  const report = filtered.reduce((acc, record) => {
    const key = record.studentId || "unknown";
    if (!acc[key]) {
      acc[key] = { studentId: key, total: 0, present: 0, absent: 0 };
    }
    acc[key].total += 1;
    if (String(record.status).toLowerCase() === "present")
      acc[key].present += 1;
    else acc[key].absent += 1;
    return acc;
  }, {});

  res.json({ report: Object.values(report), month: req.query.month || "all" });
}

export async function updateAttendance(req, res) {
  const updatedRecord = await updateItem(resource, req.params.id, req.body);
  if (!updatedRecord) {
    return res.status(404).json({ message: "Attendance record not found" });
  }
  res.json(updatedRecord);
}

export async function deleteAttendance(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Attendance record not found" });
  }
  res.json({ success: true });
}

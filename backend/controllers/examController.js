import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";
import { calculateNepalGrade } from "../utils/gradeCalc.js";

const resource = "exams";

export async function listExams(req, res) {
  const exams = await getCollection(resource);
  res.json(exams);
}

export async function getExam(req, res) {
  const exams = await getCollection(resource);
  const exam = exams.find((item) => String(item.id) === String(req.params.id));
  if (!exam) return res.status(404).json({ message: "Exam record not found" });
  res.json(exam);
}

export async function createExam(req, res) {
  const { student, name, subject, marks, total, date, grade, gpa } = req.body;
  if (!student || !name || !subject || marks == null || total == null) {
    return res.status(400).json({
      message: "Student, name, subject, marks, and total are required",
    });
  }

  const computed = calculateNepalGrade(Number(marks), Number(total));
  const newExam = {
    id: randomUUID(),
    student,
    name,
    subject,
    marks: Number(marks),
    total: Number(total),
    date: date || new Date().toISOString(),
    grade: grade || computed.grade,
    gpa: gpa || computed.gpa,
  };

  await createItem(resource, newExam);
  res.status(201).json(newExam);
}

export async function bulkCreateExams(req, res) {
  const exams = req.body.exams;
  if (!Array.isArray(exams) || exams.length === 0) {
    return res.status(400).json({ message: "Exam records are required" });
  }

  const created = [];
  for (const item of exams) {
    const { student, name, subject, marks, total, date } = item;
    if (!student || !name || !subject || marks == null || total == null)
      continue;
    const computed = calculateNepalGrade(Number(marks), Number(total));
    const exam = {
      id: randomUUID(),
      student,
      name,
      subject,
      marks: Number(marks),
      total: Number(total),
      date: date || new Date().toISOString(),
      grade: computed.grade,
      gpa: computed.gpa,
    };
    await createItem(resource, exam);
    created.push(exam);
  }

  res.status(201).json({ createdCount: created.length, created });
}

export async function getStudentResults(req, res) {
  const { studentId } = req.params;
  const exams = await getCollection(resource);
  const results = exams.filter(
    (item) => String(item.student) === String(studentId),
  );
  res.json(results);
}

export async function updateExam(req, res) {
  const updatedExam = await updateItem(resource, req.params.id, req.body);
  if (!updatedExam) {
    return res.status(404).json({ message: "Exam record not found" });
  }
  res.json(updatedExam);
}

export async function deleteExam(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Exam record not found" });
  }
  res.json({ success: true });
}

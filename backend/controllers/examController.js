import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";
import { calculateNepalGrade } from "../utils/gradeCalc.js";
import { getStudentForUser } from "../utils/studentAccess.js";
import {
  findAllowedStudent,
  getAllowedStudentsForTeacher,
} from "../utils/teacherAccess.js";

const resource = "exams";
const MAX_BULK_EXAMS = 100;

function validateExamInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "Exam record must be an object" };
  }

  const textValues = {};
  for (const field of ["examName", "student", "subject", "date"]) {
    if (typeof input[field] !== "string") {
      return { error: `${field} must be a non-empty string` };
    }

    const value = input[field].trim();
    if (!value) {
      return { error: `${field} must be a non-empty string` };
    }
    textValues[field] = value;
  }

  if (Number.isNaN(new Date(textValues.date).getTime())) {
    return { error: "Date must be valid" };
  }

  const numberValues = {};
  for (const field of ["marks", "total"]) {
    const value = input[field];
    if (
      (typeof value !== "number" && typeof value !== "string") ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return { error: `${field} must be a valid number` };
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return { error: `${field} must be a finite number` };
    }
    numberValues[field] = numericValue;
  }

  if (numberValues.marks < 0) {
    return { error: "Marks cannot be negative" };
  }
  if (numberValues.total <= 0) {
    return { error: "Total marks must be greater than zero" };
  }
  if (numberValues.marks > numberValues.total) {
    return { error: "Obtained marks cannot be greater than total marks" };
  }

  return {
    value: {
      examName: textValues.examName,
      student: textValues.student,
      subject: textValues.subject,
      marks: numberValues.marks,
      total: numberValues.total,
      date: textValues.date,
    },
  };
}

function buildExamRecord(input, students) {
  const validation = validateExamInput(input);
  if (validation.error) return validation;

  const selectedStudent = students.find(
    (item) => String(item.id) === String(validation.value.student),
  );
  if (!selectedStudent) return { error: "Student not found", status: 404 };

  const computed = calculateNepalGrade(
    validation.value.marks,
    validation.value.total,
  );

  return {
    value: {
      id: randomUUID(),
      examName: validation.value.examName,
      student: selectedStudent.id,
      name:
        selectedStudent.name || selectedStudent.fullName || "Unknown Student",
      subject: validation.value.subject,
      marks: validation.value.marks,
      total: validation.value.total,
      date: validation.value.date,
      grade: computed.grade,
      gpa: computed.gpa,
    },
  };
}

export async function listExams(req, res) {
  const exams = await getCollection(resource);
  if (req.user?.role === "teacher") {
    const students = await getAllowedStudentsForTeacher(req.user);
    if (!students) {
      return res
        .status(403)
        .json({ message: "Teacher assignment is not configured" });
    }
    const allowedIds = new Set(students.map((student) => String(student.id)));
    return res.json(
      exams.filter((exam) => allowedIds.has(String(exam.student))),
    );
  }
  res.json(exams);
}

export async function getExam(req, res) {
  const exams = await getCollection(resource);
  const exam = exams.find((item) => String(item.id) === String(req.params.id));
  if (!exam) return res.status(404).json({ message: "Exam record not found" });

  if (req.user?.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      !findAllowedStudent(allowedStudents, exam.student)
    ) {
      return res
        .status(403)
        .json({ message: "Exam is outside your assigned batch" });
    }
  }

  res.json(exam);
}

export async function createExam(req, res) {
  const students = await getCollection("students");
  if (req.user?.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      !findAllowedStudent(allowedStudents, req.body?.student)
    ) {
      return res
        .status(403)
        .json({ message: "Student is outside your assigned batch" });
    }
  }
  const prepared = buildExamRecord(req.body, students);
  if (prepared.error) {
    return res.status(prepared.status || 400).json({ message: prepared.error });
  }

  await createItem(resource, prepared.value);

  res.status(201).json(prepared.value);
}

export async function bulkCreateExams(req, res) {
  const exams = req.body?.exams;
  if (!Array.isArray(exams) || exams.length === 0) {
    return res.status(400).json({ message: "Exam records are required" });
  }
  if (exams.length > MAX_BULK_EXAMS) {
    return res.status(400).json({
      message: `A maximum of ${MAX_BULK_EXAMS} exam records is allowed`,
    });
  }

  const students = await getCollection("students");
  if (req.user?.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      exams.some((item) => !findAllowedStudent(allowedStudents, item?.student))
    ) {
      return res
        .status(403)
        .json({ message: "Student is outside your assigned batch" });
    }
  }
  const preparedExams = [];

  for (const item of exams) {
    const prepared = buildExamRecord(item, students);
    if (prepared.error) {
      return res
        .status(prepared.status || 400)
        .json({ message: prepared.error });
    }
    preparedExams.push(prepared.value);
  }

  const created = [];
  for (const exam of preparedExams) {
    await createItem(resource, exam);
    created.push(exam);
  }

  res.status(201).json({ createdCount: created.length, created });
}

export async function getStudentResults(req, res) {
  let requestedStudentId = req.params.studentId;

  if (req.user.role === "student") {
    const linkedStudent = await getStudentForUser(req.user);

    if (!linkedStudent) {
      return res.status(403).json({ message: "Forbidden" });
    }
    requestedStudentId = linkedStudent.id;
  } else if (req.user.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      !findAllowedStudent(allowedStudents, requestedStudentId)
    ) {
      return res
        .status(403)
        .json({ message: "Student is outside your assigned batch" });
    }
  } else if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const exams = await getCollection(resource);
  const results = exams.filter(
    (item) => String(item.student) === String(requestedStudentId),
  );
  res.json(results);
}

export async function updateExam(req, res) {
  const exams = await getCollection(resource);
  const existingExam = exams.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!existingExam) {
    return res.status(404).json({ message: "Exam record not found" });
  }

  const students = await getCollection("students");
  if (req.user?.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      !findAllowedStudent(allowedStudents, existingExam.student)
    ) {
      return res
        .status(403)
        .json({ message: "Student is outside your assigned batch" });
    }
  }
  const requestBody =
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body
      : {};
  const candidate = {
    examName: requestBody.examName ?? existingExam.examName,
    student: requestBody.student ?? existingExam.student,
    subject: requestBody.subject ?? existingExam.subject,
    marks: requestBody.marks ?? existingExam.marks,
    total: requestBody.total ?? existingExam.total,
    date: requestBody.date ?? existingExam.date,
  };
  const prepared = buildExamRecord(candidate, students);
  if (prepared.error) {
    return res.status(prepared.status || 400).json({ message: prepared.error });
  }

  if (String(prepared.value.student) !== String(existingExam.student)) {
    return res.status(400).json({
      message: "Exam ownership cannot be changed",
    });
  }

  const { id, ...changes } = prepared.value;
  changes.student = existingExam.student;
  const updatedExam = await updateItem(resource, req.params.id, changes);

  res.json(updatedExam);
}

export async function deleteExam(req, res) {
  const exams = await getCollection(resource);
  const exam = exams.find((item) => String(item.id) === String(req.params.id));
  if (!exam) {
    return res.status(404).json({ message: "Exam record not found" });
  }

  if (req.user?.role === "teacher") {
    const allowedStudents = await getAllowedStudentsForTeacher(req.user);
    if (
      !allowedStudents ||
      !findAllowedStudent(allowedStudents, exam.student)
    ) {
      return res
        .status(403)
        .json({ message: "Exam is outside your assigned batch" });
    }
  }

  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Exam record not found" });
  }
  res.json({ success: true });
}

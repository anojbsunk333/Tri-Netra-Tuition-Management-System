import { getCollection } from "./db.js";

export async function getTeacherForUser(user) {
  if (!user || user.role !== "teacher") return null;

  const teachers = await getCollection("teachers");
  const email = String(user.email || "")
    .trim()
    .toLowerCase();

  return (
    teachers.find(
      (teacher) =>
        email &&
        String(teacher.email || "")
          .trim()
          .toLowerCase() === email,
    ) || null
  );
}

export async function getAllowedStudentsForTeacher(user) {
  const teacher = await getTeacherForUser(user);
  if (!teacher) return null;

  const assignedBatch = String(teacher.batch || "").trim();
  if (!assignedBatch) return null;

  const students = await getCollection("students");
  return students.filter(
    (student) =>
      String(student.batch || "")
        .trim()
        .toLowerCase() === assignedBatch.toLowerCase(),
  );
}

export function findAllowedStudent(students, studentId) {
  return (
    students?.find((student) => String(student.id) === String(studentId)) ||
    null
  );
}

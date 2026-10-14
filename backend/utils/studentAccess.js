import { getCollection, updateItem } from "./db.js";

export async function getStudentIdForUser(user) {
  if (!user || user.role !== "student") return null;

  const users = await getCollection("users");
  const account = users.find((item) => String(item.id) === String(user.id));
  if (!account) return null;

  const linkedStudentId = account.studentId || account.rollNo;
  if (linkedStudentId) return linkedStudentId;

  // Link legacy accounts when their email or phone identifies one profile.
  const email = String(account.email || "")
    .trim()
    .toLowerCase();
  const phone = String(account.phone || "").trim();
  if (!email && !phone) return null;

  const students = await getCollection("students");
  const matches = students.filter(
    (student) =>
      (email &&
        String(student.email || "")
          .trim()
          .toLowerCase() === email) ||
      (phone && String(student.phone || "").trim() === phone),
  );

  if (matches.length !== 1) return null;

  const studentId = matches[0].id;
  await updateItem("users", account.id, {
    studentId,
    rollNo: studentId,
  });
  return studentId;
}

export async function getStudentForUser(user) {
  const studentId = await getStudentIdForUser(user);
  if (!studentId) return null;

  const students = await getCollection("students");
  return students.find((item) => String(item.id) === String(studentId)) || null;
}

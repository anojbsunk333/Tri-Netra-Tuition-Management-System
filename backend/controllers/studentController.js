import { STUDENTS } from "../mockData.js";

export function listStudents(req, res) {
  res.json(STUDENTS);
}

export function getStudent(req, res) {
  const s = STUDENTS.find((st) => st.id === req.params.id);
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json(s);
}

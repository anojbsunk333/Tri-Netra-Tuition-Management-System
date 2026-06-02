import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "students";

export async function listStudents(req, res) {
  const students = await getCollection(resource);
  res.json(students);
}

export async function getStudent(req, res) {
  const students = await getCollection(resource);
  const student = students.find(
    (st) => String(st.id) === String(req.params.id),
  );
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
}

export async function createStudent(req, res) {
  const { name, class: className, batch, phone, parent, feeStatus } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Student name is required" });
  }

  const newStudent = {
    id: randomUUID(),
    name,
    class: className || "",
    batch: batch || "",
    phone: phone || "",
    parent: parent || "",
    feeStatus: feeStatus || "due",
    attendance: 0,
    gpa: 0,
    joined: new Date().toISOString(),
  };

  await createItem(resource, newStudent);
  res.status(201).json(newStudent);
}

export async function updateStudent(req, res) {
  const updatedStudent = await updateItem(resource, req.params.id, req.body);
  if (!updatedStudent) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(updatedStudent);
}

export async function deleteStudent(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json({ success: true });
}

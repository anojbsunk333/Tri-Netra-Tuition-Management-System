import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "teachers";

export async function listTeachers(req, res) {
  const teachers = await getCollection(resource);
  res.json(teachers);
}

export async function getTeacher(req, res) {
  const teachers = await getCollection(resource);
  const teacher = teachers.find((t) => String(t.id) === String(req.params.id));
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  res.json(teacher);
}

export async function createTeacher(req, res) {
  const { name, subject, batch, phone, email, classes } = req.body;
  if (!name || !subject) {
    return res
      .status(400)
      .json({ message: "Teacher name and subject are required" });
  }

  const newTeacher = {
    id: randomUUID(),
    name,
    subject,
    batch: batch || "",
    phone: phone || "",
    email: email || "",
    classes: classes || [],
    joined: new Date().toISOString(),
  };

  await createItem(resource, newTeacher);
  res.status(201).json(newTeacher);
}

export async function updateTeacher(req, res) {
  const updatedTeacher = await updateItem(resource, req.params.id, req.body);
  if (!updatedTeacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.json(updatedTeacher);
}

export async function deleteTeacher(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.json({ success: true });
}

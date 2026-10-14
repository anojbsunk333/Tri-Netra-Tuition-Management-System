import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "batches";

function matchesBatch(student, batch) {
  return (
    String(student.batch || "")
      .trim()
      .toLowerCase() ===
    String(batch.name || "")
      .trim()
      .toLowerCase()
  );
}

async function withCurrentStudentCount(batch) {
  const students = await getCollection("students");
  return {
    ...batch,
    students: students.filter((student) => matchesBatch(student, batch)).length,
  };
}

async function getValidatedTeacherName(teacher) {
  const reference = String(teacher || "").trim();
  if (!reference) return "";

  const teachers = await getCollection("teachers");
  const selectedTeacher = teachers.find(
    (item) =>
      String(item.name || "")
        .trim()
        .toLowerCase() === reference.toLowerCase(),
  );

  return selectedTeacher?.name || null;
}

export async function listBatches(req, res) {
  const batches = await getCollection(resource);
  res.json(await Promise.all(batches.map(withCurrentStudentCount)));
}

export async function getBatch(req, res) {
  const batches = await getCollection(resource);
  const batch = batches.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!batch) return res.status(404).json({ message: "Batch not found" });
  res.json(await withCurrentStudentCount(batch));
}

export async function createBatch(req, res) {
  const { name, time, students, teacher, classes } = req.body;
  if (!name || !time) {
    return res
      .status(400)
      .json({ message: "Batch name and time are required" });
  }

  const validatedTeacher = await getValidatedTeacherName(teacher);
  if (teacher && !validatedTeacher) {
    return res.status(400).json({ message: "Assigned teacher not found" });
  }

  const newBatch = {
    id: randomUUID(),
    name,
    time,
    students: students || 0,
    teacher: validatedTeacher,
    classes: Array.isArray(classes)
      ? classes
      : String(classes || "")
          .split(",")
          .map((value) => String(value).trim())
          .filter(Boolean),
  };

  await createItem(resource, newBatch);
  res.status(201).json(newBatch);
}

export async function updateBatch(req, res) {
  const changes = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(changes, "teacher")) {
    const validatedTeacher = await getValidatedTeacherName(changes.teacher);
    if (changes.teacher && !validatedTeacher) {
      return res.status(400).json({ message: "Assigned teacher not found" });
    }
    changes.teacher = validatedTeacher;
  }

  const updatedBatch = await updateItem(resource, req.params.id, changes);
  if (!updatedBatch) {
    return res.status(404).json({ message: "Batch not found" });
  }
  res.json(updatedBatch);
}

export async function deleteBatch(req, res) {
  const batches = await getCollection(resource);
  const batch = batches.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const students = await getCollection("students");
  if (students.some((student) => matchesBatch(student, batch))) {
    return res.status(409).json({
      message:
        "Batch has active students. Reassign students before deleting it.",
    });
  }

  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Batch not found" });
  }
  res.json({ success: true });
}

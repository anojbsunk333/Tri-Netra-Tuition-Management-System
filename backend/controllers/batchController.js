import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "batches";

export async function listBatches(req, res) {
  const batches = await getCollection(resource);
  res.json(batches);
}

export async function getBatch(req, res) {
  const batches = await getCollection(resource);
  const batch = batches.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!batch) return res.status(404).json({ message: "Batch not found" });
  res.json(batch);
}

export async function createBatch(req, res) {
  const { name, time, students, teacher, classes } = req.body;
  if (!name || !time) {
    return res
      .status(400)
      .json({ message: "Batch name and time are required" });
  }

  const newBatch = {
    id: randomUUID(),
    name,
    time,
    students: students || 0,
    teacher: teacher || "",
    classes: classes || [],
  };

  await createItem(resource, newBatch);
  res.status(201).json(newBatch);
}

export async function updateBatch(req, res) {
  const updatedBatch = await updateItem(resource, req.params.id, req.body);
  if (!updatedBatch) {
    return res.status(404).json({ message: "Batch not found" });
  }
  res.json(updatedBatch);
}

export async function deleteBatch(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Batch not found" });
  }
  res.json({ success: true });
}

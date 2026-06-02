import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "fees";

export async function listFees(req, res) {
  const fees = await getCollection(resource);
  res.json(fees);
}

export async function getFee(req, res) {
  const fees = await getCollection(resource);
  const fee = fees.find((item) => String(item.id) === String(req.params.id));
  if (!fee) return res.status(404).json({ message: "Fee record not found" });
  res.json(fee);
}

export async function createFee(req, res) {
  const { student, name, month, amount, paid, due, status, date } = req.body;
  if (!student || !name || !month || amount == null) {
    return res
      .status(400)
      .json({ message: "Student, name, month, and amount are required" });
  }

  const newFee = {
    id: randomUUID(),
    student,
    name,
    month,
    amount,
    paid: paid || 0,
    due: due != null ? due : amount - (paid || 0),
    status: status || (paid >= amount ? "paid" : paid > 0 ? "partial" : "due"),
    date: date || new Date().toISOString(),
  };

  await createItem(resource, newFee);
  res.status(201).json(newFee);
}

export async function recordPayment(req, res) {
  const feeId = req.params.id;
  const { paidAmount } = req.body;

  if (paidAmount == null || paidAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Paid amount must be greater than zero" });
  }

  const fees = await getCollection(resource);
  const fee = fees.find((item) => String(item.id) === String(feeId));
  if (!fee) return res.status(404).json({ message: "Fee record not found" });

  const updatedPaid = (fee.paid || 0) + Number(paidAmount);
  const updatedDue = Math.max((fee.amount || 0) - updatedPaid, 0);
  const status =
    updatedDue === 0 ? "paid" : updatedPaid === 0 ? "due" : "partial";

  const updatedFee = await updateItem(resource, fee.id, {
    paid: updatedPaid,
    due: updatedDue,
    status,
    date: new Date().toISOString(),
  });
  res.json(updatedFee);
}

export async function bulkGenerateFees(req, res) {
  const entries = req.body.entries;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: "Fee entries are required" });
  }

  const created = [];
  for (const entry of entries) {
    const { student, name, month, amount, paid, due, status, date } = entry;
    if (!student || !name || !month || amount == null) continue;
    const fee = {
      id: randomUUID(),
      student,
      name,
      month,
      amount,
      paid: paid || 0,
      due: due != null ? due : amount - (paid || 0),
      status:
        status || (paid >= amount ? "paid" : paid > 0 ? "partial" : "due"),
      date: date || new Date().toISOString(),
    };
    await createItem(resource, fee);
    created.push(fee);
  }

  res.status(201).json({ createdCount: created.length, created });
}

export async function feeSummary(req, res) {
  const month = req.query.month?.toLowerCase();
  const fees = await getCollection(resource);
  const filtered = month
    ? fees.filter((item) => String(item.month).toLowerCase().includes(month))
    : fees;

  const summary = filtered.reduce(
    (acc, fee) => {
      acc.totalAmount += fee.amount || 0;
      acc.totalPaid += fee.paid || 0;
      acc.totalDue += fee.due || 0;
      acc.statusCounts[fee.status] = (acc.statusCounts[fee.status] || 0) + 1;
      return acc;
    },
    { totalAmount: 0, totalPaid: 0, totalDue: 0, statusCounts: {} },
  );

  res.json({ summary, month: req.query.month || "all" });
}

export async function updateFee(req, res) {
  const updatedFee = await updateItem(resource, req.params.id, req.body);
  if (!updatedFee) {
    return res.status(404).json({ message: "Fee record not found" });
  }
  res.json(updatedFee);
}

export async function deleteFee(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Fee record not found" });
  }
  res.json({ success: true });
}

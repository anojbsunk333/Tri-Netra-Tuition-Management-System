import { getCollection } from "../utils/db.js";
import { createReceiptPdf } from "../utils/pdfGenerator.js";
import { getStudentIdForUser } from "../utils/studentAccess.js";

export async function studentReport(req, res) {
  const { studentId } = req.params;

  if (req.user?.role !== "admin") {
    const linkedStudentId = await getStudentIdForUser(req.user);
    if (!linkedStudentId || String(linkedStudentId) !== String(studentId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const students = await getCollection("students");
  const student = students.find(
    (item) => String(item.id) === String(studentId),
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const exams = (await getCollection("exams")).filter(
    (item) => String(item.student) === String(studentId),
  );
  const fees = (await getCollection("fees")).filter(
    (item) => String(item.student) === String(studentId),
  );
  const attendance = (await getCollection("attendance")).filter(
    (item) => String(item.studentId) === String(studentId),
  );

  res.json({ student, exams, fees, attendance });
}

export async function attendanceReport(req, res) {
  const month = req.query.month?.toLowerCase();
  const batch = req.query.batch?.toLowerCase();
  const attendance = await getCollection("attendance");
  const filtered = attendance.filter((item) => {
    const monthMatches = month
      ? String(item.date || "")
          .toLowerCase()
          .startsWith(month)
      : true;
    const batchMatches = batch
      ? String(item.batch || "").toLowerCase() === batch
      : true;

    return monthMatches && batchMatches;
  });

  const report = filtered.reduce((acc, record) => {
    const key = record.studentId || "unknown";
    if (!acc[key]) {
      acc[key] = { studentId: key, total: 0, present: 0, absent: 0 };
    }
    acc[key].total += 1;
    if (String(record.status).toLowerCase() === "present")
      acc[key].present += 1;
    else acc[key].absent += 1;
    return acc;
  }, {});

  const present = filtered.filter(
    (record) => String(record.status).toLowerCase() === "present",
  ).length;
  const absent = filtered.filter(
    (record) => String(record.status).toLowerCase() === "absent",
  ).length;
  const totalRecords = filtered.length;

  res.json({
    report: Object.values(report),
    totalRecords,
    present,
    absent,
    percentage: totalRecords
      ? Number(((present / totalRecords) * 100).toFixed(2))
      : 0,
    month: req.query.month || "all",
    batch: req.query.batch || "all",
  });
}

export async function feeReport(req, res) {
  const month = req.query.month?.toLowerCase();
  const fees = await getCollection("fees");
  const filtered = month
    ? fees.filter((item) => String(item.month).toLowerCase().includes(month))
    : fees;

  const summary = filtered.reduce(
    (acc, fee) => {
      const amount = Number(fee.amount || 0);
      const paid = Number(fee.paid || 0);
      const due = Number(fee.due ?? Math.max(amount - paid, 0));
      const status = due === 0 ? "paid" : paid > 0 ? "partial" : "due";

      acc.totalAmount += amount;
      acc.totalPaid += paid;
      acc.totalDue += due;
      acc.statusCounts[status] = (acc.statusCounts[status] || 0) + 1;
      return acc;
    },
    { totalAmount: 0, totalPaid: 0, totalDue: 0, statusCounts: {} },
  );

  res.json({ summary, month: req.query.month || "all" });
}

export async function receiptPdf(req, res) {
  const { feeId } = req.params;
  const fees = await getCollection("fees");
  const fee = fees.find((item) => String(item.id) === String(feeId));

  if (!fee) {
    return res.status(404).json({ message: "Fee record not found" });
  }

  if (req.user?.role !== "admin") {
    const studentId = await getStudentIdForUser(req.user);
    if (!studentId || String(fee.student) !== String(studentId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const pdfBuffer = await createReceiptPdf(fee);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=fee-receipt-${feeId}.pdf`,
  );
  res.send(pdfBuffer);
}

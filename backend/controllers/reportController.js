import { getCollection } from "../utils/db.js";
import { createReceiptPdf } from "../utils/pdfGenerator.js";

export async function studentReport(req, res) {
  const { studentId } = req.params;
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
  const attendance = await getCollection("attendance");
  const filtered = month
    ? attendance.filter((item) =>
        String(item.date).toLowerCase().includes(month),
      )
    : attendance;

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

  res.json({ report: Object.values(report), month: req.query.month || "all" });
}

export async function feeReport(req, res) {
  const month = req.query.month?.toLowerCase();
  const fees = await getCollection("fees");
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

export async function receiptPdf(req, res) {
  const { feeId } = req.params;
  const fees = await getCollection("fees");
  const fee = fees.find((item) => String(item.id) === String(feeId));

  if (!fee) {
    return res.status(404).json({ message: "Fee record not found" });
  }

  const pdfBuffer = await createReceiptPdf(fee);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=fee-receipt-${feeId}.pdf`,
  );
  res.send(pdfBuffer);
}

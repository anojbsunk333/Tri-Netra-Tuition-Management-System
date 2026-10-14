import { getCollection } from "../utils/db.js";
import { getStudentIdForUser } from "../utils/studentAccess.js";

const resource = "payments";

async function canAccessPayment(user, payment) {
  if (user?.role === "admin") return true;

  const studentId = await getStudentIdForUser(user);
  return Boolean(studentId && String(payment.student) === String(studentId));
}

export async function listPayments(req, res) {
  const payments = await getCollection(resource);
  res.json(payments);
}

export async function getPayment(req, res) {
  const payments = await getCollection(resource);

  const payment = payments.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!payment) {
    return res.status(404).json({
      message: "Payment record not found",
    });
  }

  if (!(await canAccessPayment(req.user, payment))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(payment);
}

export async function getPaymentsByFee(req, res) {
  const payments = await getCollection(resource);

  const feeId = String(req.params.feeId);

  const filtered = payments.filter(
    (payment) => String(payment.feeId) === feeId,
  );

  if (req.user?.role !== "admin") {
    const studentId = await getStudentIdForUser(req.user);
    const fee = (await getCollection("fees")).find(
      (item) => String(item.id) === feeId,
    );

    if (!fee || !studentId || String(fee.student) !== String(studentId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  res.json(filtered);
}

import { getCollection } from "../utils/db.js";

const resource = "payments";

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

  res.json(payment);
}

export async function getPaymentsByFee(req, res) {
  const payments = await getCollection(resource);

  const feeId = String(req.params.feeId);

  const filtered = payments.filter(
    (payment) => String(payment.feeId) === feeId,
  );

  res.json(filtered);
}

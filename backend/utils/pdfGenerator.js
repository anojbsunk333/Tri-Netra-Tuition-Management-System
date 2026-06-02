import PDFDocument from "pdfkit";

export function createReceiptPdf(fee) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(20).text("Fee Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt ID: ${fee.id}`);
    doc.text(`Student: ${fee.name}`);
    doc.text(`Student ID: ${fee.student}`);
    doc.text(`Month: ${fee.month}`);
    doc.text(`Amount: Rs. ${fee.amount}`);
    doc.text(`Paid: Rs. ${fee.paid}`);
    doc.text(`Due: Rs. ${fee.due}`);
    doc.text(`Status: ${fee.status}`);
    doc.text(`Date: ${fee.date || new Date().toISOString()}`);

    doc.moveDown();
    doc.text("Thank you for your payment.", { align: "left" });
    doc.end();
  });
}

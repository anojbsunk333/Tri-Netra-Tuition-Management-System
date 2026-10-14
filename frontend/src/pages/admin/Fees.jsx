import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

import {
  getFees,
  getFeeSummary,
  recordPayment,
  bulkGenerateFees,
} from "../../services/feeService";

import { getStudents } from "../../services/studentService";
import { getPaymentsByFee } from "../../services/paymentService";

// =========================================================
// NEPALI MONTHS
// =========================================================

const NEPALI_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

// Current BS year used as the default generation year.
const DEFAULT_BS_YEAR = 2083;

// =========================================================
// HELPERS
// =========================================================

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB");
}

// =========================================================
// COMPONENT
// =========================================================

export default function Fees() {
  const [fees, setFees] = useState([]);

  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    statusCounts: {},
  });

  // =========================================================
  // GENERAL
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FEE FILTERS
  // =========================================================

  const [searchStudent, setSearchStudent] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // =========================================================
  // GENERATE FEES
  // =========================================================

  const [showGenerateForm, setShowGenerateForm] = useState(false);

  const [generateMonth, setGenerateMonth] = useState("");
  const [generateYear, setGenerateYear] = useState(DEFAULT_BS_YEAR);
  const [generateAmount, setGenerateAmount] = useState("");

  const [generatingFees, setGeneratingFees] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState("");

  // =========================================================
  // PAYMENT MODAL
  // =========================================================

  const [paymentFee, setPaymentFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // =========================================================
  // PAYMENT HISTORY
  // =========================================================

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(false);
  const [paymentHistoryError, setPaymentHistoryError] = useState("");
  const [historyFee, setHistoryFee] = useState(null);

  // =========================================================
  // RECEIPT
  // =========================================================

  const [receipt, setReceipt] = useState(null);

  // =========================================================
  // LOAD FEES
  // =========================================================

  async function loadFees() {
    try {
      setLoading(true);
      setError("");

      const [data, summaryData] = await Promise.all([
        getFees(),
        getFeeSummary(),
      ]);

      setFees(data || []);

      setSummary(
        summaryData?.summary || {
          totalAmount: 0,
          totalPaid: 0,
          totalDue: 0,
          statusCounts: {},
        },
      );
    } catch (err) {
      console.error("Unable to load fees:", err);
      setError("Unable to load fee records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  // =========================================================
  // FILTER FEES
  // =========================================================

  const filteredFees = fees.filter((fee) => {
    const search = searchStudent.trim().toLowerCase();

    const matchesStudent =
      !search ||
      String(fee.name || "")
        .toLowerCase()
        .includes(search) ||
      String(fee.student || "")
        .toLowerCase()
        .includes(search);

   const feeMonth = String(fee.month || "");
   const feeYear = String(fee.year || "");

   const matchesMonth =
     !filterMonth ||
     feeMonth.toLowerCase().startsWith(filterMonth.toLowerCase());

   const matchesYear = !filterYear || feeYear === String(filterYear);

    return matchesStudent && matchesMonth && matchesYear;
  });

  // =========================================================
  // FILTERED SUMMARY
  // =========================================================

  const filteredSummary = filteredFees.reduce(
    (acc, fee) => {
      acc.totalAmount += Number(fee.amount || 0);
      acc.totalPaid += Number(fee.paid || 0);
      acc.totalDue += Number(fee.due || 0);

      acc.statusCounts[fee.status] = (acc.statusCounts[fee.status] || 0) + 1;

      return acc;
    },
    {
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      statusCounts: {},
    },
  );

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {
    setSearchStudent("");
    setFilterMonth("");
    setFilterYear("");
  }

  // =========================================================
  // PAYMENT
  // =========================================================

  function openPaymentModal(fee) {
    setPaymentFee(fee);
    setPaymentAmount("");
    setPaymentError("");
  }

  function closePaymentModal() {
    if (savingPayment) return;

    setPaymentFee(null);
    setPaymentAmount("");
    setPaymentError("");
  }

  async function handlePayment(event) {
    event.preventDefault();

    if (!paymentFee) return;

    const amount = Number(paymentAmount);
    const due = Number(paymentFee.due || 0);

    if (!amount || amount <= 0) {
      setPaymentError("Please enter a valid payment amount.");
      return;
    }

    if (amount > due) {
      setPaymentError(
        `Payment cannot be greater than the remaining due amount of ${formatCurrency(
          due,
        )}.`,
      );
      return;
    }

    try {
      setSavingPayment(true);
      setPaymentError("");

      const result = await recordPayment(paymentFee.id, amount);

      const payment = result?.payment;

      const previousPaid = Number(
        payment?.previousPaid ?? paymentFee.paid ?? 0,
      );

      const remainingDue = Number(payment?.remainingDue ?? due - amount);

      setReceipt({
        id: payment?.id || `R-${Date.now()}`,

        feeId: payment?.feeId || paymentFee.id,

        date: payment?.date || new Date().toISOString(),

        name: payment?.name || paymentFee.name,

        student: payment?.student || paymentFee.student,

        month: payment?.month || paymentFee.month,

        previousPaid,

        amount: Number(payment?.amount ?? amount),

        remainingDue,
      });

      closePaymentModal();

      await loadFees();
    } catch (err) {
      console.error("Unable to record payment:", err);

      setPaymentError(
        err?.response?.data?.message || "Unable to record payment.",
      );
    } finally {
      setSavingPayment(false);
    }
  }

  // =========================================================
  // PAYMENT HISTORY
  // =========================================================

  async function openPaymentHistory(fee) {
    console.log("HISTORY CLICKED:", fee);

    setHistoryFee(fee);
    setShowPaymentHistory(true);
    setLoadingPaymentHistory(true);
    setPaymentHistoryError("");
    setPaymentHistory([]);

    try {
      const payments = await getPaymentsByFee(fee.id);

      console.log("PAYMENT HISTORY RESPONSE:", payments);

      const historyData = Array.isArray(payments)
        ? payments
        : payments?.payments || [];

      setPaymentHistory(historyData);
    } catch (err) {
      console.error("Unable to load payment history:", err);

      setPaymentHistoryError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment history.",
      );
    } finally {
      setLoadingPaymentHistory(false);
    }
  }

  function closePaymentHistory() {
    if (loadingPaymentHistory) return;

    setShowPaymentHistory(false);
    setPaymentHistory([]);
    setPaymentHistoryError("");
    setHistoryFee(null);
  }

  // =========================================================
  // HISTORICAL PAYMENT RECEIPT
  // =========================================================

  function openHistoricalReceipt(payment) {
    console.log("SELECTED PAYMENT:", payment);

    const amount = Number(
      payment.amount ?? payment.paidAmount ?? payment.paymentAmount ?? 0,
    );

    const paymentDate =
      payment.date ||
      payment.paymentDate ||
      payment.createdAt ||
      new Date().toISOString();

    setReceipt({
      id:
        payment.receiptNumber ||
        payment.receiptId ||
        payment.id ||
        `R-${Date.now()}`,

      feeId: payment.feeId || historyFee?.id || "",

      date: paymentDate,

      name: payment.name || payment.studentName || historyFee?.name || "",

      student:
        payment.student || payment.studentId || historyFee?.student || "",

      month: payment.month || historyFee?.month || "",

      previousPaid: Number(payment.previousPaid || 0),

      amount,

      remainingDue:
        payment.remainingDue !== undefined
          ? Number(payment.remainingDue)
          : Number(historyFee?.due || 0),
    });

    closePaymentHistory();
  }

  // =========================================================
  // GENERATE MONTHLY FEES
  // =========================================================

  async function handleGenerateFees(event) {
    event.preventDefault();

    if (!generateMonth) {
      setGenerateError("Please select a Nepali month.");
      return;
    }

    if (!generateYear) {
      setGenerateError("Please select a Nepali year.");
      return;
    }

    const amount = Number(generateAmount);

    if (!amount || amount <= 0) {
      setGenerateError("Please enter a valid fee amount.");
      return;
    }

    try {
      setGeneratingFees(true);
      setGenerateError("");
      setGenerateSuccess("");

      const students = await getStudents();

      if (!students?.length) {
        setGenerateError("No students found.");
        return;
      }

      // =====================================================
      // NEPALI MONTH + BS YEAR
      //
      // Example:
      // Baisakh 2083
      // Jestha 2083
      // Ashadh 2083
      // =====================================================

     const formattedMonth = `${generateMonth} ${generateYear}`;

     const entries = students.map((student) => ({
       student: student.id,
       name: student.name,
       month: generateMonth,
       year: generateYear,
       amount,
       paid: 0,
       due: amount,
       status: "due",
     }));

      const result = await bulkGenerateFees(entries);

      console.log("Fee generation result:", result);

      if (result.createdCount > 0 && result.skippedCount > 0) {
        setGenerateSuccess(
          `${result.createdCount} fee record(s) created. ${result.skippedCount} existing fee record(s) were skipped.`,
        );
      } else if (result.createdCount > 0) {
        setGenerateSuccess(
          `${result.createdCount} fee record(s) generated successfully for ${formattedMonth}.`,
        );
      } else if (result.skippedCount > 0) {
        setGenerateSuccess(
          `No new fees were generated. ${result.skippedCount} fee record(s) already existed for ${formattedMonth}.`,
        );
      } else {
        setGenerateSuccess("Fee generation completed.");
      }

      setShowGenerateForm(false);

      setGenerateMonth("");
      setGenerateYear(DEFAULT_BS_YEAR);
      setGenerateAmount("");

      setGenerateError("");

      await loadFees();
    } catch (err) {
      console.error("Unable to generate fees:", err);

      setGenerateError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to generate fees.",
      );
    } finally {
      setGeneratingFees(false);
    }
  }

  // =========================================================
  // PRINT RECEIPT
  // =========================================================

  function printReceipt() {
    if (!receipt) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");

    if (!printWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${receipt.id}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              color: #111827;
              background: white;
            }

            .receipt {
              max-width: 700px;
              margin: 0 auto;
              border: 1px solid #d1d5db;
              padding: 30px;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #111827;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            .header h1 {
              margin: 0;
              font-size: 24px;
            }

            .header p {
              margin: 8px 0 0;
              color: #6b7280;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .label {
              color: #6b7280;
            }

            .value {
              font-weight: 600;
            }

            .section {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
            }

            .payment {
              border-top: 1px solid #d1d5db;
              padding-top: 15px;
            }

            .payment-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .this-payment {
              font-size: 20px;
              font-weight: bold;
            }

            .remaining {
              border-top: 1px solid #d1d5db;
              padding-top: 12px;
              font-size: 18px;
              font-weight: bold;
            }

            .success {
              margin-top: 25px;
              padding: 12px;
              text-align: center;
              border: 1px solid #bbf7d0;
              background: #f0fdf4;
              color: #15803d;
              font-weight: bold;
              border-radius: 6px;
            }

            .footer {
              margin-top: 35px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }

            @media print {
              body {
                padding: 0;
              }

              .receipt {
                border: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">

            <div class="header">
              <h1>TRI-NETRA TUITION CENTER</h1>
              <p>Payment Receipt</p>
            </div>

            <div class="section">

              <div class="row">
                <span class="label">Receipt No.</span>
                <span class="value">${receipt.id}</span>
              </div>

              <div class="row">
                <span class="label">Fee ID</span>
                <span class="value">
                  ${receipt.feeId || "—"}
                </span>
              </div>

              <div class="row">
                <span class="label">Date</span>
                <span class="value">
                  ${formatDate(receipt.date)}
                </span>
              </div>

            </div>

            <div class="section">

              <div class="row">
                <span class="label">Student</span>
                <span class="value">
                  ${receipt.name || "—"}
                </span>
              </div>

              <div class="row">
                <span class="label">Student ID</span>
                <span class="value">
                  ${receipt.student || "—"}
                </span>
              </div>

              <div class="row">
                <span class="label">Fee Month</span>
                <span class="value">
                  ${receipt.month || "—"}
                </span>
              </div>

            </div>

            <div class="payment">

              <div class="payment-row">
                <span>Previous Paid</span>
                <span>
                  Rs. ${Number(receipt.previousPaid || 0).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div class="payment-row this-payment">
                <span>This Payment</span>
                <span>
                  Rs. ${Number(receipt.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div class="payment-row remaining">
                <span>Remaining Due</span>
                <span>
                  Rs. ${Number(receipt.remainingDue || 0).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

            </div>

            <div class="success">
              Payment Recorded Successfully
            </div>

            <div class="footer">
              Thank you for your payment.<br />
              TRI-NETRA TUITION CENTER
            </div>

          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fees</h1>

              <p className="mt-1 text-sm text-gray-500">
                Review student fee status and payment records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowGenerateForm(true);
                setGenerateSuccess("");
                setGenerateError("");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Generate Fees
            </button>
          </div>

          {/* =================================================
              GENERATE FEES FORM
          ================================================= */}

          {showGenerateForm && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Generate Monthly Fees
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Generate monthly fee records for all students using the
                    Nepali calendar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowGenerateForm(false);
                    setGenerateError("");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleGenerateFees}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* NEPALI MONTH */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nepali Month *
                    </label>

                    <select
                      value={generateMonth}
                      onChange={(e) => setGenerateMonth(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select Month</option>

                      {NEPALI_MONTHS.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BS YEAR */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nepali Year *
                    </label>

                    <select
                      value={generateYear}
                      onChange={(e) => setGenerateYear(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {Array.from(
                        { length: 11 },
                        (_, index) => 2078 + index,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year} BS
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AMOUNT */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Monthly Fee Amount *
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={generateAmount}
                      onChange={(e) => setGenerateAmount(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* PREVIEW */}

                {generateMonth && generateYear && (
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                      Fee will be generated for:
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-900">
                      {generateMonth} {generateYear}
                    </p>
                  </div>
                )}

                {generateError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {generateError}
                  </div>
                )}

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGenerateForm(false);
                      setGenerateError("");
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={generatingFees}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generatingFees ? "Generating..." : "Generate Fees"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-500">Total Fees</p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(filteredSummary.totalAmount)}
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-lg">
              <p className="text-sm font-medium text-green-700">Total Paid</p>

              <p className="mt-2 text-3xl font-bold text-green-700">
                {formatCurrency(filteredSummary.totalPaid)}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-lg">
              <p className="text-sm font-medium text-red-700">Total Due</p>

              <p className="mt-2 text-3xl font-bold text-red-700">
                {formatCurrency(filteredSummary.totalDue)}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-lg">
              <p className="text-sm font-medium text-blue-700">Paid Records</p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {filteredSummary.statusCounts?.paid || 0}
              </p>
            </div>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {generateSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {generateSuccess}
            </div>
          )}

          {/* =================================================
              FEE FILTERS
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Fee Records</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Search students and filter fees by Nepali month and year.
                </p>
              </div>

              {(searchStudent || filterMonth || filterYear) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* STUDENT SEARCH */}

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Search Student
                </label>

                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search by student name or ID..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* NEPALI MONTH */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nepali Month
                </label>

                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Months</option>

                  {NEPALI_MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* NEPALI YEAR */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nepali Year
                </label>

                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Years</option>

                  {Array.from({ length: 11 }, (_, index) => 2078 + index).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year} BS
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* FILTER RESULT COUNT */}

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredFees.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {fees.length}
                </span>{" "}
                fee records
              </p>

              {(filterMonth || filterYear) && (
                <p className="text-sm font-medium text-blue-700">
                  {filterMonth || "All Months"} {filterYear || ""}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              FEE TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading fee data...
              </div>
            ) : filteredFees.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium text-gray-700">
                  {fees.length === 0
                    ? "No fee records found."
                    : "No fee records match your filters."}
                </p>

                {fees.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Fee ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Student
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Student ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Nepali Month
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Paid
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Due
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredFees.map((fee) => (
                      <tr key={fee.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          {fee.id}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {fee.name}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                          {fee.student}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-blue-700">
                          {fee.month} {fee.year ? `${fee.year} BS` : ""}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatCurrency(fee.amount)}
                        </td>

                        <td className="px-4 py-3 text-sm text-green-700">
                          {formatCurrency(fee.paid)}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold text-red-700">
                          {formatCurrency(fee.due)}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold capitalize">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : fee.status === "partial"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {Number(fee.due || 0) > 0 ? (
                              <button
                                type="button"
                                onClick={() => openPaymentModal(fee)}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                Record Payment
                              </button>
                            ) : (
                              <span className="text-xs font-medium text-green-600">
                                Fully Paid
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => openPaymentHistory(fee)}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              History
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {paymentFee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Record Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Fee ID: {paymentFee.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                disabled={savingPayment}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Student</span>

                <span className="text-sm font-semibold text-gray-900">
                  {paymentFee.name}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Student ID</span>

                <span className="text-sm font-semibold text-gray-900">
                  {paymentFee.student}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Nepali Month</span>

                <span className="text-sm font-semibold text-blue-700">
                  {paymentFee.month}
                </span>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Total</p>

                <p className="mt-1 font-bold text-gray-900">
                  {formatCurrency(paymentFee.amount)}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-xs text-green-600">Paid</p>

                <p className="mt-1 font-bold text-green-700">
                  {formatCurrency(paymentFee.paid)}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-xs text-red-600">Due</p>

                <p className="mt-1 font-bold text-red-700">
                  {formatCurrency(paymentFee.due)}
                </p>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Payment Amount
              </label>

              <input
                type="number"
                min="1"
                max={Number(paymentFee.due || 0)}
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                autoFocus
              />

              {paymentError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {paymentError}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={savingPayment}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingPayment}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPayment ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          PAYMENT HISTORY MODAL
      ===================================================== */}

      {showPaymentHistory && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePaymentHistory();
            }
          }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment History
                </h2>

                {historyFee && (
                  <p className="mt-1 text-sm text-gray-500">
                    {historyFee.name} —{" "}
                    <span className="font-semibold text-blue-700">
                      {historyFee.month}
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closePaymentHistory}
                disabled={loadingPaymentHistory}
                className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* BODY */}

            <div className="p-6">
              {loadingPaymentHistory ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading payment history...
                </div>
              ) : paymentHistoryError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {paymentHistoryError}
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No payment history found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Payment ID
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Date
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Amount
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {paymentHistory.map((payment) => {
                        const amount = Number(
                          payment.amount ??
                            payment.paidAmount ??
                            payment.paymentAmount ??
                            0,
                        );

                        const date =
                          payment.date ||
                          payment.paymentDate ||
                          payment.createdAt;

                        return (
                          <tr key={payment.id}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                              {payment.id}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {date ? formatDate(date) : "—"}
                            </td>

                            <td className="px-4 py-3 text-sm font-semibold text-green-700">
                              {formatCurrency(amount)}
                            </td>

                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => openHistoricalReceipt(payment)}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-gray-200 p-6">
              <button
                type="button"
                onClick={closePaymentHistory}
                disabled={loadingPaymentHistory}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RECEIPT MODAL
      ===================================================== */}

      {receipt && (
        <div className="receipt-overlay fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4">
          <div className="receipt-modal w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                TRI-NETRA TUITION CENTER
              </h2>

              <p className="mt-1 text-sm text-gray-500">Payment Receipt</p>
            </div>

            <div className="mb-5 rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Receipt No.</span>

                <span className="text-sm font-bold text-gray-900">
                  {receipt.id}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Fee ID</span>

                <span className="text-sm font-semibold text-gray-900">
                  {receipt.feeId || "—"}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Payment Date</span>

                <span className="text-sm font-semibold text-gray-900">
                  {formatDate(receipt.date)}
                </span>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Student</span>

                <span className="text-sm font-semibold text-gray-900">
                  {receipt.name || "—"}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Student ID</span>

                <span className="text-sm font-semibold text-gray-900">
                  {receipt.student || "—"}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Fee Month</span>

                <span className="text-sm font-semibold text-blue-700">
                  {receipt.month || "—"}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Previous Paid</span>

                <span className="text-sm font-semibold">
                  {formatCurrency(receipt.previousPaid)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  This Payment
                </span>

                <span className="text-lg font-bold text-green-700">
                  {formatCurrency(receipt.amount)}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-semibold text-gray-900">
                  Remaining Due
                </span>

                <span className="text-lg font-bold text-red-700">
                  {formatCurrency(receipt.remainingDue)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-green-50 p-3 text-center">
              <p className="text-sm font-semibold text-green-700">
                Payment Recorded Successfully
              </p>
            </div>

            <div className="receipt-buttons mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={printReceipt}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PRINT STYLES
      ===================================================== */}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden;
            }

            .receipt-overlay,
            .receipt-overlay * {
              visibility: visible;
            }

            .receipt-overlay {
              position: absolute !important;
              inset: 0 !important;
              background: white !important;
              display: block !important;
              padding: 0 !important;
            }

            .receipt-modal {
              position: relative !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 30px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            .receipt-buttons {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

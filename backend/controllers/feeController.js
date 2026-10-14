// No random UUID needed for fee IDs

import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "fees";
const paymentResource = "payments";

// =========================================================
// NEPALI BS MONTHS
// =========================================================

const NEPALI_MONTHS = [
  {
    number: 1,
    value: "Baisakh",
    nepali: "बैशाख",
  },
  {
    number: 2,
    value: "Jestha",
    nepali: "जेठ",
  },
  {
    number: 3,
    value: "Asar",
    nepali: "असार",
  },
  {
    number: 4,
    value: "Shrawan",
    nepali: "श्रावण",
  },
  {
    number: 5,
    value: "Bhadra",
    nepali: "भाद्र",
  },
  {
    number: 6,
    value: "Ashwin",
    nepali: "आश्विन",
  },
  {
    number: 7,
    value: "Kartik",
    nepali: "कार्तिक",
  },
  {
    number: 8,
    value: "Mangsir",
    nepali: "मंसिर",
  },
  {
    number: 9,
    value: "Poush",
    nepali: "पौष",
  },
  {
    number: 10,
    value: "Magh",
    nepali: "माघ",
  },
  {
    number: 11,
    value: "Falgun",
    nepali: "फाल्गुण",
  },
  {
    number: 12,
    value: "Chaitra",
    nepali: "चैत्र",
  },
];

// =========================================================
// HELPERS
// =========================================================

function generateFeeId(fees) {
  const numericIds = fees
    .map((fee) => {
      const match = String(fee.id).match(/^F(\d+)$/);

      return match ? Number(match[1]) : 0;
    })
    .filter((id) => id > 0);

  const nextNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

  return `F${String(nextNumber).padStart(3, "0")}`;
}

function generatePaymentId(payments) {
  const numericIds = payments
    .map((payment) => {
      const match = String(payment.id).match(/^P(\d+)$/);

      return match ? Number(match[1]) : 0;
    })
    .filter((id) => id > 0);

  const nextNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

  return `P${String(nextNumber).padStart(4, "0")}`;
}

function getNepaliMonth(month) {
  if (!month) return null;

  const normalized = String(month).trim().toLowerCase();

  return NEPALI_MONTHS.find(
    (item) =>
      item.value.toLowerCase() === normalized ||
      item.nepali === String(month).trim(),
  );
}

function normalizeYear(year) {
  if (year == null || year === "") return null;

  const numericYear = Number(year);

  if (!Number.isInteger(numericYear)) {
    return null;
  }

  return numericYear;
}

function getFeeDisplayMonth(fee) {
  if (fee.monthNepali && fee.year) {
    return `${fee.monthNepali} ${fee.year}`;
  }

  if (fee.month && fee.year) {
    return `${fee.month} ${fee.year}`;
  }

  return fee.month || "—";
}

function getFeeStatus(amount, paid) {
  if (paid >= amount) return "paid";
  if (paid > 0) return "partial";
  return "due";
}

function getCalculatedDue(amount, paid) {
  return Math.max(amount - paid, 0);
}

// =========================================================
// LIST FEES
// =========================================================

export async function listFees(req, res) {
  try {
    const fees = await getCollection(resource);

    res.json(fees);
  } catch (error) {
    console.error("Unable to list fees:", error);

    res.status(500).json({
      message: "Unable to load fee records",
    });
  }
}

// =========================================================
// GET SINGLE FEE
// =========================================================

export async function getFee(req, res) {
  try {
    const fees = await getCollection(resource);

    const fee = fees.find((item) => String(item.id) === String(req.params.id));

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    res.json(fee);
  } catch (error) {
    console.error("Unable to get fee:", error);

    res.status(500).json({
      message: "Unable to load fee record",
    });
  }
}

// =========================================================
// CREATE SINGLE FEE
// =========================================================

export async function createFee(req, res) {
  try {
    const {
      student,
      name,
      month,
      monthNepali,
      year,
      amount,
      paid,
      due,
      status,
      date,
    } = req.body;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (!student || !name || !month || year == null || amount == null) {
      return res.status(400).json({
        message: "Student, name, BS year, month, and amount are required",
      });
    }

    // -------------------------------------------------------
    // Validate month
    // -------------------------------------------------------

    const nepaliMonth = getNepaliMonth(month);

    if (!nepaliMonth) {
      return res.status(400).json({
        message: "Invalid Nepali month. Please use a valid BS month.",
      });
    }

    // -------------------------------------------------------
    // Validate year
    // -------------------------------------------------------

    const numericYear = normalizeYear(year);

    if (numericYear == null || numericYear < 2000 || numericYear > 2200) {
      return res.status(400).json({
        message: "Please provide a valid BS year.",
      });
    }

    // -------------------------------------------------------
    // Validate amount
    // -------------------------------------------------------

    const numericAmount = Number(amount);
    const numericPaid = Number(paid || 0);

    if (!Number.isFinite(numericAmount) || !Number.isFinite(numericPaid)) {
      return res.status(400).json({
        message: "Amount and paid amount must be valid numbers",
      });
    }

    if (numericAmount < 0 || numericPaid < 0) {
      return res.status(400).json({
        message: "Amount and paid amount cannot be negative",
      });
    }

    if (numericPaid > numericAmount) {
      return res.status(400).json({
        message: "Paid amount cannot be greater than fee amount",
      });
    }

    // -------------------------------------------------------
    // Get existing fees
    // -------------------------------------------------------

    const fees = await getCollection(resource);
    const students = await getCollection("students");

    const studentProfile = students.find(
      (item) => String(item.id) === String(student),
    );

    if (!studentProfile) {
      return res.status(400).json({
        message: "Student profile not found",
      });
    }

    // -------------------------------------------------------
    // Duplicate check
    //
    // New records:
    // student + year + month
    //
    // Old records without year:
    // student + month
    // -------------------------------------------------------

    const duplicateFee = fees.find((fee) => {
      const sameStudent = String(fee.student) === String(student);

      const sameMonth =
        String(fee.month).toLowerCase() ===
        String(nepaliMonth.value).toLowerCase();

      // New-format record
      if (fee.year != null) {
        return sameStudent && sameMonth && Number(fee.year) === numericYear;
      }

      // Old-format record
      return sameStudent && sameMonth;
    });

    if (duplicateFee) {
      return res.status(409).json({
        message: `A fee for ${name} already exists for ${nepaliMonth.nepali} ${numericYear}.`,
      });
    }

    // -------------------------------------------------------
    // Create fee
    // -------------------------------------------------------

    const calculatedDue = getCalculatedDue(numericAmount, numericPaid);

    const newFee = {
      id: generateFeeId(fees),

      student,
      name,

      // BS month
      month: nepaliMonth.value,
      monthNepali: nepaliMonth.nepali,
      year: numericYear,

      amount: numericAmount,
      paid: numericPaid,
      due: Math.max(calculatedDue, 0),

      status: getFeeStatus(numericAmount, numericPaid),

      date: date || new Date().toISOString(),
    };

    await createItem(resource, newFee);

    res.status(201).json(newFee);
  } catch (error) {
    console.error("Unable to create fee:", error);

    res.status(500).json({
      message: "Unable to create fee record",
    });
  }
}

// =========================================================
// RECORD PAYMENT
// =========================================================

export async function recordPayment(req, res) {
  try {
    const feeId = req.params.id;

    const { paidAmount } = req.body;

    // -------------------------------------------------------
    // Validate payment amount
    // -------------------------------------------------------

    if (paidAmount == null || Number(paidAmount) <= 0) {
      return res.status(400).json({
        message: "Paid amount must be greater than zero",
      });
    }

    const paymentAmount = Number(paidAmount);

    if (Number.isNaN(paymentAmount)) {
      return res.status(400).json({
        message: "Paid amount must be a valid number",
      });
    }

    // -------------------------------------------------------
    // Find fee
    // -------------------------------------------------------

    const fees = await getCollection(resource);

    const fee = fees.find((item) => String(item.id) === String(feeId));

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    // -------------------------------------------------------
    // Check remaining due
    // -------------------------------------------------------

    const currentPaid = Number(fee.paid || 0);
    const currentAmount = Number(fee.amount || 0);
    const remainingDue = getCalculatedDue(currentAmount, currentPaid);

    if (paymentAmount > remainingDue) {
      return res.status(400).json({
        message: `Payment cannot be greater than the remaining due amount of Rs. ${remainingDue}`,
      });
    }

    // -------------------------------------------------------
    // Calculate updated fee
    // -------------------------------------------------------

    const updatedPaid = currentPaid + paymentAmount;

    const updatedDue = getCalculatedDue(currentAmount, updatedPaid);

    const status = getFeeStatus(currentAmount, updatedPaid);

    const paymentDate = new Date().toISOString();

    // -------------------------------------------------------
    // Generate payment ID
    // -------------------------------------------------------

    const payments = await getCollection(paymentResource);

    const paymentId = generatePaymentId(payments);

    // -------------------------------------------------------
    // Store payment history record
    // -------------------------------------------------------

    const payment = {
      id: paymentId,

      feeId: fee.id,

      student: fee.student,
      name: fee.name,

      // Preserve BS month information
      month: fee.month,
      monthNepali: fee.monthNepali || null,
      year: fee.year || null,

      amount: paymentAmount,

      previousPaid: Number(fee.paid || 0),

      remainingDue: updatedDue,

      date: paymentDate,
    };

    await createItem(paymentResource, payment);

    // -------------------------------------------------------
    // Update main fee record
    // -------------------------------------------------------

    const updatedFee = await updateItem(resource, fee.id, {
      paid: updatedPaid,
      due: updatedDue,
      status,
      date: paymentDate,
    });

    res.json({
      fee: updatedFee,
      payment,
    });
  } catch (error) {
    console.error("Unable to record payment:", error);

    res.status(500).json({
      message: "Unable to record payment",
    });
  }
}

// =========================================================
// BULK GENERATE FEES
// =========================================================

export async function bulkGenerateFees(req, res) {
  try {
    const entries = req.body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        message: "Fee entries are required",
      });
    }

    const fees = await getCollection(resource);
    const students = await getCollection("students");

    const created = [];
    const skipped = [];

    // -------------------------------------------------------
    // Process every student
    // -------------------------------------------------------

    for (const entry of entries) {
      const {
        student,
        name,
        month,
        monthNepali,
        year,
        amount,
        paid,
        due,
        status,
        date,
      } = entry;

      // -----------------------------------------------------
      // Required fields
      // -----------------------------------------------------

      if (!student || !name || !month || year == null || amount == null) {
        skipped.push({
          student,
          name,
          month,
          year,
          reason: "Student, name, BS year, month, and amount are required",
        });

        continue;
      }

      // -----------------------------------------------------
      // Validate month
      // -----------------------------------------------------

      const nepaliMonth = getNepaliMonth(month);

      if (!nepaliMonth) {
        skipped.push({
          student,
          name,
          month,
          year,
          reason: "Invalid Nepali month",
        });

        continue;
      }

      // -----------------------------------------------------
      // Validate year
      // -----------------------------------------------------

      const numericYear = normalizeYear(year);

      if (numericYear == null || numericYear < 2000 || numericYear > 2200) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year,
          reason: "Invalid BS year",
        });

        continue;
      }

      const studentProfile = students.find(
        (item) => String(item.id) === String(student),
      );

      if (!studentProfile) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year: numericYear,
          reason: "Student profile not found",
        });

        continue;
      }

      // -----------------------------------------------------
      // Check existing database records
      // -----------------------------------------------------

      const alreadyExists = fees.some((fee) => {
        const sameStudent = String(fee.student) === String(student);

        const sameMonth =
          String(fee.month).toLowerCase() ===
          String(nepaliMonth.value).toLowerCase();

        // New-format record
        if (fee.year != null) {
          return sameStudent && sameMonth && Number(fee.year) === numericYear;
        }

        // Old-format record
        return sameStudent && sameMonth;
      });

      // -----------------------------------------------------
      // Check records created during this request
      // -----------------------------------------------------

      const alreadyCreated = created.some((fee) => {
        return (
          String(fee.student) === String(student) &&
          String(fee.month).toLowerCase() ===
            String(nepaliMonth.value).toLowerCase() &&
          Number(fee.year) === numericYear
        );
      });

      // -----------------------------------------------------
      // Skip duplicate
      // -----------------------------------------------------

      if (alreadyExists || alreadyCreated) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year: numericYear,
          reason: "Fee already exists for this month",
        });

        continue;
      }

      // -----------------------------------------------------
      // Validate amounts
      // -----------------------------------------------------

      const numericAmount = Number(amount);

      const numericPaid = paid != null ? Number(paid) : 0;

      if (!Number.isFinite(numericAmount) || !Number.isFinite(numericPaid)) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year: numericYear,
          reason: "Amount must be a valid number",
        });

        continue;
      }

      if (numericAmount < 0 || numericPaid < 0) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year: numericYear,
          reason: "Amount and paid amount cannot be negative",
        });

        continue;
      }

      if (numericPaid > numericAmount) {
        skipped.push({
          student,
          name,
          month: nepaliMonth.nepali,
          year: numericYear,
          reason: "Paid amount cannot be greater than fee amount",
        });

        continue;
      }

      // -----------------------------------------------------
      // Calculate due
      // -----------------------------------------------------

      const calculatedDue = getCalculatedDue(numericAmount, numericPaid);

      // -----------------------------------------------------
      // Create fee
      // -----------------------------------------------------

      const fee = {
        id: generateFeeId([...fees, ...created]),

        student,
        name,

        // BS month
        month: nepaliMonth.value,
        monthNepali: monthNepali || nepaliMonth.nepali,
        year: numericYear,

        amount: numericAmount,

        paid: numericPaid,

        due: Math.max(calculatedDue, 0),

        status: getFeeStatus(numericAmount, numericPaid),

        date: date || new Date().toISOString(),
      };

      await createItem(resource, fee);

      created.push(fee);
    }

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    res.status(201).json({
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    });
  } catch (error) {
    console.error("Unable to generate fees:", error);

    res.status(500).json({
      message: "Unable to generate fees",
    });
  }
}

// =========================================================
// FEE SUMMARY
// =========================================================

export async function feeSummary(req, res) {
  try {
    const month = req.query.month?.toLowerCase();

    const year = req.query.year != null ? Number(req.query.year) : null;

    const fees = await getCollection(resource);

    const filtered = fees.filter((item) => {
      // -----------------------------------------------------
      // Month filter
      // -----------------------------------------------------

      const monthMatches = month
        ? String(item.monthNepali || item.month || "")
            .toLowerCase()
            .includes(month)
        : true;

      // -----------------------------------------------------
      // Year filter
      // -----------------------------------------------------

      const yearMatches = year == null ? true : Number(item.year) === year;

      return monthMatches && yearMatches;
    });

    // -------------------------------------------------------
    // Calculate summary
    // -------------------------------------------------------

    const summary = filtered.reduce(
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

    res.json({
      summary,

      month: req.query.month || "all",

      year: req.query.year || "all",
    });
  } catch (error) {
    console.error("Unable to generate fee summary:", error);

    res.status(500).json({
      message: "Unable to generate fee summary",
    });
  }
}

// =========================================================
// UPDATE FEE
// =========================================================

export async function updateFee(req, res) {
  try {
    const fees = await getCollection(resource);
    const existingFee = fees.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!existingFee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    const allowedFields = [
      "name",
      "month",
      "monthNepali",
      "year",
      "amount",
      "paid",
    ];
    const changes = Object.fromEntries(
      allowedFields
        .filter((field) =>
          Object.prototype.hasOwnProperty.call(req.body, field),
        )
        .map((field) => [field, req.body[field]]),
    );

    if (changes.name !== undefined && !String(changes.name).trim()) {
      return res.status(400).json({ message: "Fee name cannot be empty" });
    }

    if (changes.month !== undefined) {
      const nepaliMonth = getNepaliMonth(changes.month);
      if (!nepaliMonth) {
        return res.status(400).json({ message: "Invalid Nepali month" });
      }
      changes.month = nepaliMonth.value;
      changes.monthNepali = nepaliMonth.nepali;
    }

    if (changes.year !== undefined) {
      const numericYear = normalizeYear(changes.year);
      if (numericYear == null || numericYear < 2000 || numericYear > 2200) {
        return res
          .status(400)
          .json({ message: "Please provide a valid BS year." });
      }
      changes.year = numericYear;
    }

    const amount = Number(changes.amount ?? existingFee.amount);
    const paid = Number(changes.paid ?? existingFee.paid ?? 0);

    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(paid) ||
      amount < 0 ||
      paid < 0
    ) {
      return res.status(400).json({
        message: "Amount and paid amount must be valid non-negative numbers",
      });
    }

    if (paid > amount) {
      return res.status(400).json({
        message: "Paid amount cannot be greater than fee amount",
      });
    }

    changes.amount = amount;
    changes.paid = paid;
    changes.due = getCalculatedDue(amount, paid);
    changes.status = getFeeStatus(amount, paid);
    changes.date = new Date().toISOString();

    const updatedFee = await updateItem(resource, existingFee.id, changes);

    res.json(updatedFee);
  } catch (error) {
    console.error("Unable to update fee:", error);

    res.status(500).json({
      message: "Unable to update fee record",
    });
  }
}

// =========================================================
// DELETE FEE
// =========================================================

export async function deleteFee(req, res) {
  try {
    const deleted = await deleteItem(resource, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to delete fee:", error);

    res.status(500).json({
      message: "Unable to delete fee record",
    });
  }
}

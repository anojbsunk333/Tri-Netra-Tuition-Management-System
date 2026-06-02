import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "Backend running" }));

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

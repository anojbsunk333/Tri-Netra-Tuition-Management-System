import dotenv from "dotenv";
import { ensureDbFile, readDb, saveDb } from "./utils/db.js";
import {
  USERS,
  STUDENTS,
  TEACHERS,
  BATCHES,
  FEES,
  EXAMS,
  ANNOUNCEMENTS,
} from "./mockData.js";
import { hashPassword } from "./models/User.js";

dotenv.config();

async function seed() {
  await ensureDbFile();
  const db = await readDb();

  if (db.users && db.users.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  db.users = USERS.map((user) => ({
    ...user,
    password: hashPassword(user.password),
  }));
  db.students = STUDENTS;
  db.teachers = TEACHERS;
  db.batches = BATCHES;
  db.fees = FEES;
  db.exams = EXAMS;
  db.announcements = ANNOUNCEMENTS;

  await saveDb();
  console.log("Seed data has been written to backend/data/db.json");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

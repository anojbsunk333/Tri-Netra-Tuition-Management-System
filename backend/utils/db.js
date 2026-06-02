import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  USERS,
  STUDENTS,
  TEACHERS,
  BATCHES,
  FEES,
  EXAMS,
  ANNOUNCEMENTS,
} from "../mockData.js";
import { hashPassword } from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FOLDER = path.join(__dirname, "../data");
const DB_FILE = path.join(DB_FOLDER, "db.json");
let cache = null;

async function ensureDbFile() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(DB_FOLDER, { recursive: true });
    const initial = {
      users: USERS.map((user) => ({
        ...user,
        password: hashPassword(user.password),
      })),
      students: STUDENTS,
      teachers: TEACHERS,
      batches: BATCHES,
      attendance: [],
      attendanceSessions: [],
      fees: FEES,
      exams: EXAMS,
      announcements: ANNOUNCEMENTS,
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readDb() {
  if (cache) return cache;
  await ensureDbFile();
  const text = await fs.readFile(DB_FILE, "utf8");
  cache = JSON.parse(text);
  return cache;
}

export async function saveDb() {
  if (!cache) {
    await readDb();
  }
  await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), "utf8");
  return cache;
}

export async function getCollection(collectionName) {
  const db = await readDb();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  return db[collectionName];
}

export async function createItem(collectionName, item) {
  const db = await readDb();
  db[collectionName] = db[collectionName] || [];
  db[collectionName].push(item);
  await saveDb();
  return item;
}

export async function updateItem(collectionName, id, changes) {
  const db = await readDb();
  const collection = db[collectionName] || [];
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...changes };
  await saveDb();
  return collection[index];
}

export async function deleteItem(collectionName, id) {
  const db = await readDb();
  const collection = db[collectionName] || [];
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return false;
  collection.splice(index, 1);
  await saveDb();
  return true;
}

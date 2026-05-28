import crypto from "crypto";

// Simple in-memory user storage
let users = [];
let userIdCounter = 1;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export default class User {
  constructor({ id, name, email, password, role }) {
    this.id = id || userIdCounter++;
    this.name = name;
    this.email = email;
    this.password = password ? hashPassword(password) : null;
    this.role = role || "student";
    this.createdAt = new Date();
  }

  static create({ name, email, password, role }) {
    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return null; // User already exists
    }

    const newUser = new User({ name, email, password, role });
    users.push(newUser);
    return newUser;
  }

  static findByEmail(email) {
    return users.find((u) => u.email === email);
  }

  static verifyPassword(storedHash, plainPassword) {
    return storedHash === hashPassword(plainPassword);
  }

  static getAll() {
    return users;
  }

  // Return user without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

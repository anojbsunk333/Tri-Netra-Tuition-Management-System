import crypto from "crypto";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(storedHash, plainPassword) {
  return storedHash === hashPassword(plainPassword);
}

export default class User {
  constructor({ id, name, email, password, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password ? hashPassword(password) : null;
    this.role = role || "student";
    this.createdAt = new Date();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

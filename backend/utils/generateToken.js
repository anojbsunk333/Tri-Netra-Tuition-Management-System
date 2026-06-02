import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "trinetra-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export default function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

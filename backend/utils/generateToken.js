export default function generateToken(user) {
  // Simple token generation (in production, use JWT)
  return `token-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

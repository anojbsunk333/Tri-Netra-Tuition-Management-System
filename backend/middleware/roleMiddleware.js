export function roleMiddleware(requiredRole) {
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (requiredRole && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
}

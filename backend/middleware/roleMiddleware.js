export function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    // placeholder: check req.user.role
    next();
  };
}

const jwt = require("jsonwebtoken");

const extractToken = (authHeader = "") => {
  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
};

const authMiddleware = (req, res, next) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }

  return next();
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};

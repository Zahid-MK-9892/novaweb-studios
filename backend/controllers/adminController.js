const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const VALID_ROLES = ["admin", "manager", "editor"];

const loadUsers = () => {
  if (process.env.ADMIN_USERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS_JSON);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter((user) => user?.email && user?.password)
          .map((user) => ({
            email: String(user.email).toLowerCase().trim(),
            password: String(user.password),
            role: VALID_ROLES.includes(user.role) ? user.role : "admin",
          }));
      }
    } catch (error) {
      console.error("Invalid ADMIN_USERS_JSON. Falling back to ADMIN_EMAIL/ADMIN_PASSWORD");
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    return [
      {
        email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      },
    ];
  }

  return [];
};

const passwordMatches = (plainPassword, storedPassword) => {
  if (!storedPassword) return false;

  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
    return bcrypt.compareSync(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  const users = loadUsers();

  if (users.length === 0) {
    return res.status(500).json({ message: "Admin credentials not configured" });
  }

  const matchedUser = users.find((user) => user.email === String(email).toLowerCase().trim());

  if (!matchedUser || !passwordMatches(password, matchedUser.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      email: matchedUser.email,
      role: matchedUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    user: {
      email: matchedUser.email,
      role: matchedUser.role,
    },
  });
};

const router = require("express").Router();
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

/* ===========================
   ADMIN AUTH MIDDLEWARE
=========================== */
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ===========================
   GET ALL LEADS
=========================== */
router.get("/leads", adminAuth, async (req, res) => {
  const leads = await Contact.find().sort({ createdAt: -1 });
  res.json(leads);
});

/* ===========================
   UPDATE LEAD STATUS
=========================== */
router.patch("/leads/:id", adminAuth, async (req, res) => {
  const { status } = req.body;

  const lead = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(lead);
});

module.exports = router;

const router = require("express").Router();
const Contact = require("../models/Contact");

// Get all leads
router.get("/leads", async (req, res) => {
  const leads = await Contact.find().sort({ createdAt: -1 });
  res.json(leads);
});

// Update lead status
router.put("/leads/:id", async (req, res) => {
  const { status } = req.body;

  const updated = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;

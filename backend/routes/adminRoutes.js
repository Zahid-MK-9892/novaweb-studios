const router = require("express").Router();
const Contact = require("../models/Contact");
const { login } = require("../controllers/adminController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Closed"];

router.post("/login", login);

router.get(
  "/leads",
  authMiddleware,
  authorizeRoles("admin", "manager", "editor"),
  async (req, res) => {
    try {
      const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
      const status = req.query.status;
      const search = req.query.search?.trim();

      const query = {};

      if (status && LEAD_STATUSES.includes(status)) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Contact.countDocuments(query);
      const leads = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.json({
        data: leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch leads" });
    }
  }
);

router.get(
  "/leads/analytics",
  authMiddleware,
  authorizeRoles("admin", "manager", "editor"),
  async (_req, res) => {
    try {
      const grouped = await Contact.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const summary = LEAD_STATUSES.reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        { total: 0 }
      );

      grouped.forEach((item) => {
        if (item._id && summary[item._id] !== undefined) {
          summary[item._id] = item.count;
          summary.total += item.count;
        }
      });

      return res.json(summary);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch analytics" });
    }
  }
);

router.patch(
  "/leads/:id",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const { status, notes } = req.body;
      const update = {};

      if (status) {
        if (!LEAD_STATUSES.includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }

        update.status = status;
      }

      if (typeof notes === "string") {
        update.notes = notes.trim();
      }

      const lead = await Contact.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      });

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      return res.json(lead);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update lead" });
    }
  }
);

router.get(
  "/leads/export/csv",
  authMiddleware,
  authorizeRoles("admin", "manager", "editor"),
  async (req, res) => {
    try {
      const status = req.query.status;
      const query = status && LEAD_STATUSES.includes(status) ? { status } : {};
      const leads = await Contact.find(query).sort({ createdAt: -1 });

      const csvHeaders = ["Name", "Email", "Message", "Status", "Notes", "Created At"];
      const escapeCsv = (value = "") => `"${String(value).replace(/"/g, '""')}"`;
      const csvRows = leads.map((lead) =>
        [
          lead.name,
          lead.email,
          lead.message,
          lead.status,
          lead.notes || "",
          lead.createdAt ? new Date(lead.createdAt).toISOString() : "",
        ]
          .map(escapeCsv)
          .join(",")
      );

      const csv = [csvHeaders.join(","), ...csvRows].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');

      return res.status(200).send(csv);
    } catch (error) {
      return res.status(500).json({ message: "Failed to export leads" });
    }
  }
);

module.exports = router;

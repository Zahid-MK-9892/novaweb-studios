const router = require("express").Router();
const { getPortfolio, addPortfolio } = require("../controllers/portfolioController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getPortfolio);
router.post("/", authMiddleware, authorizeRoles("admin", "manager", "editor"), addPortfolio);

module.exports = router;

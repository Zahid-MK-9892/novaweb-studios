const router = require("express").Router();
const {
  getPortfolio,
  addPortfolio,
} = require("../controllers/portfolioController");

router.get("/", getPortfolio);
router.post("/", addPortfolio); // admin-only later

module.exports = router;

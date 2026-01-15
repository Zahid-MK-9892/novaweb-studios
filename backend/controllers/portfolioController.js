const Portfolio = require("../models/Portfolio");

exports.getPortfolio = async (req, res) => {
  const items = await Portfolio.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.addPortfolio = async (req, res) => {
  const { title, category, description } = req.body;
  const item = await Portfolio.create({ title, category, description });
  res.json(item);
};

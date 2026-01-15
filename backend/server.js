const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ Works locally, ignored on Render

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

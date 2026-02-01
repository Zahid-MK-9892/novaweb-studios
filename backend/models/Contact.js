const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);

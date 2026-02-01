const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Closed"],
      default: "New"
    }
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite on Render / redeploy
module.exports =
  mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Task", taskSchema);

const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: [true, "provide tech name"],
  },
  task: {
    type: String,
    required: [true, "Provide the task"],
  },
});

module.exports = mongoose.model("task", taskSchema);

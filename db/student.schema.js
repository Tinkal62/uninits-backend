const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  scholarId: String,
  name: String,
  cgpa: Number,
  sgpa_prev: Number,
  sgpa_curr: Number,
  email: { type: String, default: null },
  userName: { type: String, default: null },
  profileImage: { type: String, default: "default.png" }
});

module.exports = mongoose.model("Student", studentSchema);

const mongoose = require("mongoose");

const subjectAttendanceSchema = new mongoose.Schema(
  {
    subjectCode: String,
    total: { type: Number, default: 0 },
    attended: { type: Number, default: 0 }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema({
  scholarId: { type: String, required: true, unique: true },
  semester: Number,
  attendance: [subjectAttendanceSchema]
});

module.exports = mongoose.model("Attendance", attendanceSchema);

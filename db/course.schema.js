const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  branchCode: Number,
  branchShort: String,
  semester: Number,
  courses: [
    {
      code: String,
      name: String,
      credits: Number
    }
  ]
});

module.exports = mongoose.model("Course", courseSchema);

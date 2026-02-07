require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db/connect");
const Student = require("./db/student.schema");
const Attendance = require("./db/attendance.schema");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { scholarId } = req.body;

  const student = await Student.findOne({ scholarId });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json({ success: true, student });
});

// ATTENDANCE
app.get("/api/attendance/:scholarId", async (req, res) => {
  const data = await Attendance.findOne({
    scholarId: req.params.scholarId
  });

  if (!data) return res.status(404).json({ error: "Not found" });
  res.json(data);
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);

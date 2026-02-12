🎓 uniNITS – NIT Silchar Student Portal










<div align="center"> <img src="public/assets/images/logo.png" alt="uniNITS Logo" width="120"/> <h3>One Platform. Entire Campus. Endless Possibilities.</h3> </div>
📌 Overview

uniNITS is a full-stack campus portal built for NIT Silchar students, integrating academics, events, hostels, clubs, and student services into one seamless digital ecosystem.

Instead of switching between multiple platforms, students can manage everything — attendance, CGPA, events, hostel info, and more — from a single dashboard.

✨ Features
🔐 Authentication

Secure student login & registration

Profile management with avatar upload

Protected routes & session persistence

📊 Academic Tools

Attendance Tracker with color indicators

🔴 Red (<75%)

🟡 Yellow (75–85%)

🟢 Green (>85%)

SGPA / CGPA overview

Semester-wise course listing

📅 Events & Calendar

Academic Calendar (JSON-powered)

Important event filtering

PDF download support

🏠 Campus Directory

20+ Clubs & Societies

Hostel Directory with warden details

Mess Menu

Guest House Information

🎨 UI/UX

Three.js particle background

Fully responsive (Mobile-first)

Smooth animations & gradient themes

Dark-mode optimized

🛠️ Tech Stack
Frontend (Firebase Hosted)

HTML5

CSS3

JavaScript

Three.js

Font Awesome

Backend (Render Hosted)

Node.js

Express.js

MongoDB Atlas

Mongoose

Multer (File Uploads)

JWT Authentication

🎨 Color Palette
Primary Colors
Hex Code	Color Name
#1a237e	Deep Indigo
#3949ab	Medium Indigo
#00b0ff	Bright Cyan
#4caf50	Green
#ff9800	Orange
#f44336	Red
Design Style

Dark Mode First

Glassmorphism Cards

Neon Cyan & Magenta Accents

Smooth Micro-interactions

🚀 Deployment
🔹 Frontend

Hosted on Firebase Hosting

CDN optimized

Secure HTTPS enabled

🔹 Backend

Hosted on Render.com

Auto deploy on Git push

Environment variables configured

🔹 Database

MongoDB Atlas (Cloud)

📁 Project Structure
uninits/
│
├── public/               # Frontend
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── data/
│   └── *.html
│
├── db/                   # Database Schemas
├── uploads/              # Profile images
├── index.js              # Express server
├── package.json
└── README.md

💻 Local Setup
git clone https://github.com/Tinkal62/uninits.git
cd uninits
npm install


Create .env file:

MONGO_URI=your_mongodb_uri
PORT=8080


Start backend:

node index.js


Serve frontend:

npx serve public

🤝 Contributing

Fork the repo

Create a feature branch

Commit changes

Open Pull Request

📄 License

MIT License © 2026

👨‍💻 Developer

Tinkal Das
Computer Science & Engineering
NIT Silchar

GitHub: https://github.com/Tinkal62

LinkedIn: https://linkedin.com

<div align="center"> Built with ❤️ for the NIT Silchar community </div>

uniNITS - NIT Silchar Student Portal
<div align="center"> <img src="public/assets/images/logo.png" alt="uniNITS Logo" width="100"/> <h3>One Platform. Entire Campus. Endless Possibilities.</h3>
https://img.shields.io/badge/Frontend-Firebase-FFCA28?style=flat&logo=firebase
https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render
https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=flat&logo=mongodb
https://img.shields.io/badge/License-MIT-green

</div>
📋 Overview
uniNITS is a comprehensive digital platform for NIT Silchar students, integrating academic tools, campus resources, events, and services into a single, seamless web application.

Live Demo: https://uninits.web.app
Backend API: https://uninits-backend.onrender.com

✨ Core Features
🔐 Authentication
Student login/registration with NIT Silchar email validation

Profile management with avatar upload

Persistent session management (localStorage)

Protected routes for authenticated pages

📊 Academic Tools
Attendance Tracker: Subject-wise records with color-coded alerts

Red (<75%) · Yellow (75-85%) · Green (>85%)

CGPA/SGPA Display: Real-time academic performance

Semester-wise Courses: Complete subject history

📅 Events & Calendar
Academic Calendar 2026: 35+ even/odd semester events

Important Events Filter: Priority-based event display

Dynamic JSON Loading: Real-time event updates

PDF Download: Offline calendar access

🏠 Campus Information
Clubs & Societies: 20+ clubs with descriptions & links

Hostel Directory: 20+ hostels with warden contacts

Mess Menu: Daily & weekly meal schedules

Guest House: Booking procedures & staff contacts

🛠️ Tech Stack
Frontend (Firebase Hosting)
text
├── HTML5          - Structure & semantics
├── CSS3           - Styling, animations, responsive design
├── JavaScript     - Core functionality & API calls
├── Three.js       - Interactive particle background
└── Font Awesome   - Icons & visual elements
Backend (Render)
text
├── Node.js        - Runtime environment
├── Express.js     - Web framework & routing
├── MongoDB Atlas  - Cloud database
├── Mongoose       - ODM & schema modeling
├── Multer         - Profile image uploads
└── Dotenv         - Environment configuration
📁 Project Structure
text
uninits/
├── 📁 public/                    # Frontend (Firebase)
│   ├── index.html              # Dashboard
│   ├── profile.html            # Student profile
│   ├── attendance.html         # Attendance tracker
│   ├── events.html             # Academic calendar
│   ├── clubs_society.html      # Clubs directory
│   ├── hostels.html            # Hostel information
│   ├── guest_house.html        # Guest house booking
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   │
│   ├── 📁 css/                 
│   │   └── index.css          # Master stylesheet
│   │
│   ├── 📁 js/                  
│   │   ├── auth-check.js      # Authentication guard
│   │   ├── profile.js         # Profile management
│   │   ├── attendance.js      # Attendance tracking
│   │   ├── events-loader.js   # JSON event loader
│   │   ├── login.js           # Login handler
│   │   ├── register.js        # Registration handler
│   │   ├── canvas.js          # Three.js background
│   │   └── components.js      # Navbar/footer loader
│   │
│   ├── 📁 data/               
│   │   └── events.json        # 35+ academic events
│   │
│   ├── 📁 assets/              # Images & static files
│   └── 📁 components/          # Reusable HTML
│       ├── navbar.html
│       └── footer.html
│
├── 📁 db/                       # Backend (Render)
│   ├── connect.js             # MongoDB connection
│   ├── student.schema.js      # Student model
│   ├── course.schema.js       # Course model
│   └── attendance.schema.js   # Attendance model
│
├── 📁 uploads/                 # Profile picture storage
├── index.js                   # Express server
├── package.json              # Dependencies
└── README.md                 # Documentation
🎨 Color Palette
Color Name	Usage
Deep Indigo	Primary brand color
Bright Cyan	Accent, links, hover states
Neon Magenta	Gradient text, highlights
Green	Good attendance (>85%)
Yellow	Borderline attendance (75-85%)
Red	Critical attendance (<75%)
Charcoal Black	Background
Light Gray	Body text
Design System: Dark mode first · Glassmorphism · Neon accents · Micro-interactions

🚀 Deployment
Backend (Render)
bash
# 1. Connect GitHub repo to Render
# 2. Set environment variables:
MONGO_URI=your_mongodb_atlas_uri
PORT=10000

# 3. Start command: node index.js
# 4. Auto-deploys on git push
Frontend (Firebase)
bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login & initialize
firebase login
firebase init hosting

# 3. Set public directory to 'public'
# 4. Deploy
firebase deploy

# Live at: https://uninits.web.app
💻 Local Setup
bash
# Clone repository
git clone https://github.com/Tinkal62/uninits.git
cd uninits

# Install backend dependencies
npm install

# Create .env file
echo "MONGO_URI=your_connection_string" > .env
echo "PORT=8080" >> .env

# Start backend server
node index.js

# Serve frontend (open public/index.html in browser)
# or use Live Server extension
📊 Database Schema
javascript
// Student Model
{
  scholarId: Number,      // Unique identifier
  email: String,         // NIT Silchar email
  userName: String,      // Display name
  profileImage: String,  // Avatar filename
  cgpa: Number,         // Cumulative GPA
  sgpa_curr: Number,    // Current semester GPA
  sgpa_prev: Number     // Previous semester GPA
}

// Attendance Model
{
  scholarId: String,    // Reference to student
  semester: Number,     // Current semester
  attendance: [{        // Subject-wise records
    subjectCode: String,
    total: Number,
    attended: Number
  }]
}
🔑 Key API Endpoints
Endpoint	Method	Description
/api/login	POST	Student authentication
/api/register	POST	New student registration
/api/profile/:scholarId	GET	Fetch student profile
/api/courses/:scholarId	GET	Get semester courses
/api/attendance/:scholarId	GET	Fetch attendance records
/api/attendance/update	POST	Update attendance
/api/profile/upload-photo	POST	Upload profile picture
📱 Responsive Design
Breakpoint	Devices	Optimization
>1024px	Desktop/Laptop	Full layout, 3-column grid
768px-1024px	Tablet	2-column grid, adjusted spacing
<768px	Mobile	Single column, stacked cards
<480px	Small mobile	Compact UI, touch targets
Mobile Features: Touch-optimized · Bottom sheets · Swipe gestures · Reduced motion

👨‍💻 Developer
Tinkal Das
CSE, NIT Silchar

https://img.shields.io/badge/GitHub-Tinkal62-181717?style=flat&logo=github
https://img.shields.io/badge/Email-tinkal_ug@ei.nits.ac.in-EA4335?style=flat&logo=gmail

<div align="center"> <sub>Built with ❤️ for the NIT Silchar community</sub> <br> <sub>© 2026 uniNITS. All rights reserved.</sub> </div> ```

// Check login
const student = JSON.parse(localStorage.getItem("student"));
if (!student) {
  window.location.href = "/login.html";
  throw new Error("Not logged in");
}

const scholarId = student.scholarId;
const BACKEND_URL = "https://uninits-backend.onrender.com";

// Helper function to get color based on percentage
function getAttendanceColor(percent) {
  if (percent < 50) {
    return "#ff0000"; // Red for low attendance
  } else if (percent >= 50 && percent < 75) {
    return "#ffb005"; // Yellow for borderline
  } else {
    return "#09ff00"; // Green for good attendance
  }
}

// Load attendance data
async function loadAttendance() {
  try {
    console.log("Loading attendance for:", scholarId);
    
    // Fetch attendance and courses in parallel
    const [attendanceRes, coursesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/attendance/${scholarId}`),
      fetch(`${BACKEND_URL}/api/courses/${scholarId}`)
    ]);
    
    const attendanceData = await attendanceRes.json();
    const coursesData = await coursesRes.json();
    
    console.log("Attendance:", attendanceData);
    console.log("Courses:", coursesData);
    
    // Update UI
    const yearCode = scholarId.toString().slice(0, 2);
    const semesterMap = { "22": 8, "23": 6, "24": 4, "25": 2 };
    const semester = semesterMap[yearCode] || "--";
    
    document.getElementById("semester").innerText = semester;
    document.getElementById("scholarId").innerText = scholarId;
    
    // Get current courses
    const currentCourses = coursesData.currentSemesterCourses || [];
    const attendanceRecords = attendanceData.attendance || [];
    
    // Render cards
    const container = document.getElementById("attendanceContainer");
    const template = container.querySelector(".sub-card");
    container.innerHTML = "";
    
    if (currentCourses.length === 0) {
      container.innerHTML = '<p style="color:#aaa;text-align:center;">No courses this semester</p>';
    } else {
      currentCourses.forEach(course => {
        const record = attendanceRecords.find(r => r.subjectCode === course.code);
        const total = record?.total || 0;
        const attended = record?.attended || 0;
        const percent = total === 0 ? 0 : Math.round((attended / total) * 100);
        const color = getAttendanceColor(percent);
        
        const card = template.cloneNode(true);
        card.dataset.code = course.code;
        card.querySelector(".subject-name").innerText = course.name;
        card.querySelector(".subject-code").innerText = course.code;
        card.querySelector(".total").innerText = total;
        card.querySelector(".attended").innerText = attended;
        card.querySelector(".percent").innerText = percent + "%";
        card.querySelector(".percent").style.color = color;
        
        // Add color to percentage text
        const percentElement = card.querySelector(".percent");
        percentElement.style.color = color;
        percentElement.style.textShadow = `0 0 10px ${color}40`;
        
        card.style.display = "block";
        container.appendChild(card);
      });
    }
    
    console.log("✅ Attendance loaded!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    const container = document.getElementById("attendanceContainer");
    container.innerHTML = `<p style="color:#ff5555;text-align:center;">Error: ${error.message}</p>`;
  }
}

// Update function with color coding
async function update(btn, delta, type) {
  const card = btn.closest(".sub-card");
  const totalEl = card.querySelector(".total");
  const attendedEl = card.querySelector(".attended");
  const percentEl = card.querySelector(".percent");

  let total = +totalEl.innerText;
  let attended = +attendedEl.innerText;

  if (type === "total") total = Math.max(0, total + delta);
  if (type === "attended") attended = Math.max(0, attended + delta);
  if (attended > total) attended = total;

  totalEl.innerText = total;
  attendedEl.innerText = attended;

  const percent = total === 0 ? 0 : Math.round((attended / total) * 100);
  percentEl.innerText = percent + "%";
  
  // Update color based on new percentage
  const color = getAttendanceColor(percent);
  percentEl.style.color = color;
  percentEl.style.textShadow = `0 0 10px ${color}40`;

  // Save to backend
  try {
    await fetch(`${BACKEND_URL}/api/attendance/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scholarId: scholarId,
        subjectCode: card.dataset.code,
        total,
        attended
      })
    });
    console.log("✅ Attendance saved!");
  } catch (error) {
    console.error("❌ Save failed:", error);
  }
}

// Load page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAttendance);
} else {
  loadAttendance();
}

// Add global update function to window for inline onclick to work
window.update = update;
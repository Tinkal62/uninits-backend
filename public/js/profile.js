// profile.js - CLEAN VERSION

// Check login
const student = JSON.parse(localStorage.getItem("student") || '{}');
if (!student.scholarId) {
  window.location.replace("/login.html");
}

const scholarId = student.scholarId;
const BACKEND_URL = "https://uninits-backend.onrender.com";

window.onload = function() {
  console.log("Profile page loaded for scholarId:", scholarId);
  setupProfileUpload();
  loadProfileData();
};

// Profile picture upload
function setupProfileUpload() {
  const profileUpload = document.getElementById("profileUpload");
  if (!profileUpload) return;

  profileUpload.addEventListener("change", async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const profileImage = document.getElementById("profileImage");
      const navProfileImage = document.getElementById("navProfileImage");

      const reader = new FileReader();
      reader.onload = function(e) {
        profileImage.src = e.target.result;
        if (navProfileImage) navProfileImage.src = e.target.result;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('scholarId', scholarId);

      const response = await fetch(`${BACKEND_URL}/api/profile/upload-photo`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Upload failed');

      const currentStudent = JSON.parse(localStorage.getItem("student") || '{}');
      currentStudent.profileImage = data.filename;
      localStorage.setItem("student", JSON.stringify(currentStudent));

      updateProfileImages();
    } catch (error) {
      console.error('Upload error:', error);
      updateProfileImages();
      alert('Failed to upload profile picture');
    }

    e.target.value = '';
  });
}

// Load profile data
async function loadProfileData() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/profile/${scholarId}`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    console.log("✅ Profile data received:", data);
    
    updateUI(data);
    await loadCoursesWithAttendance();
    
  } catch (error) {
    console.error("Error loading profile:", error);
    updateUIFromLocalStorage();
  }
}

// Update UI with backend data
function updateUI(data) {
  const studentData = data.student;
  const semester = data.semester;
  const branchShort = data.branchShort;

  // Basic info
  document.getElementById("studentName").textContent = studentData.name || studentData.userName || "Student";
  document.getElementById("studentScholarId").textContent = scholarId;
  document.getElementById("studentEmail").textContent = studentData.email || "--";
  document.getElementById("branchShort").textContent = branchShort || "--";
  document.getElementById("currentSemester").textContent = semester ? `Sem ${semester}` : "--";
  document.getElementById("branchShortTitle").textContent = branchShort || "--";

  // GPA values - DIRECT ASSIGNMENT
  console.log("📊 GPA from backend:", {
    cgpa: studentData.cgpa,
    sgpa_curr: studentData.sgpa_curr,
    sgpa_prev: studentData.sgpa_prev
  });

  document.getElementById("cgpa").textContent = studentData.cgpa !== undefined ? studentData.cgpa : "--";
  document.getElementById("sgpaCurr").textContent = studentData.sgpa_curr !== undefined ? studentData.sgpa_curr : "--";
  document.getElementById("sgpaPrev").textContent = studentData.sgpa_prev !== undefined ? studentData.sgpa_prev : "--";

  // Update localStorage
  const updatedStudent = {
    ...JSON.parse(localStorage.getItem("student") || '{}'),
    ...studentData,
    semester,
    branchShort
  };
  localStorage.setItem("student", JSON.stringify(updatedStudent));

  updateProfileImages();
}

// Fallback: update from localStorage
function updateUIFromLocalStorage() {
  const student = JSON.parse(localStorage.getItem("student") || '{}');
  
  document.getElementById("studentName").textContent = student.name || student.userName || "Student";
  document.getElementById("studentScholarId").textContent = scholarId;
  document.getElementById("studentEmail").textContent = student.email || "--";
  
  document.getElementById("cgpa").textContent = student.cgpa || "--";
  document.getElementById("sgpaCurr").textContent = student.sgpa_curr || "--";
  document.getElementById("sgpaPrev").textContent = student.sgpa_prev || "--";
  
  updateProfileImages();
}

// Update profile images
function updateProfileImages() {
  const student = JSON.parse(localStorage.getItem("student") || '{}');
  const profileImage = document.getElementById("profileImage");
  const navProfileImage = document.getElementById("navProfileImage");

  let imageUrl = "/assets/images/default.png";
  
  if (student.profileImage && student.profileImage !== "null" && student.profileImage !== "default.png") {
    imageUrl = `${BACKEND_URL}/uploads/profile-images/${student.profileImage}`;
  }

  if (profileImage) {
    profileImage.src = imageUrl;
    profileImage.onerror = function() {
      this.src = "/assets/images/default.png";
      this.onerror = null;
    };
  }

  if (navProfileImage) {
    navProfileImage.src = imageUrl;
    navProfileImage.onerror = function() {
      this.src = "/assets/images/default.png";
      this.onerror = null;
    };
  }
}

// Load courses and attendance
async function loadCoursesWithAttendance() {
  try {
    const [attendanceRes, coursesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/attendance/${scholarId}`),
      fetch(`${BACKEND_URL}/api/courses/${scholarId}`)
    ]);

    if (!coursesRes.ok) throw new Error('Courses API error');

    const coursesData = await coursesRes.json();
    const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { attendance: [] };

    updateCurrentSemSubjects(coursesData.currentSemesterCourses || [], attendanceData);
    updateAllSubjects(coursesData.allCourses || []);
    
  } catch (error) {
    console.error("Error loading courses:", error);
  }
}

// Update current semester subjects
function updateCurrentSemSubjects(courses, attendanceData) {
  const container = document.getElementById("currentSemList");
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = '<p style="color:#aaa;text-align:center;">No courses this semester</p>';
    return;
  }

  container.innerHTML = "";

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "event-card sub-card";

    let attendancePercentage = 0;
    const record = (attendanceData.attendance || []).find(r => r.subjectCode === course.code);
    
    if (record) {
      const total = record.total || 0;
      const attended = record.attended || 0;
      attendancePercentage = total === 0 ? 0 : Math.round((attended / total) * 100);
    }

    let attendanceColor = "#00ffff";
    if (attendancePercentage < 75) attendanceColor = "#ff5555";
    else if (attendancePercentage >= 75 && attendancePercentage < 85) attendanceColor = "#ffff55";
    else attendanceColor = "#55ff55";

    div.innerHTML = `
      <div class="course-info">
        <div class="event-title">${course.name || "Unnamed Course"}</div>
        <div class="event-date">${course.code || "No Code"}</div>
      </div>
      <div class="course-stats">
        <div class="course-credits">${course.credits || "0"} credits</div>
        <div class="attendance-display" style="color:${attendanceColor};font-weight:600;">
          ${attendancePercentage}% Attendance
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Update all subjects by semester
function updateAllSubjects(allCourses) {
  const semesterList = document.getElementById("semesterList");
  const semesterBlocks = document.getElementById("semesterBlocks");
  
  if (!semesterList || !semesterBlocks) return;
  
  if (allCourses.length === 0) {
    semesterBlocks.innerHTML = '<p style="color:#aaa;">No course data available</p>';
    return;
  }

  semesterList.innerHTML = "";
  semesterBlocks.innerHTML = "";

  allCourses.forEach((semesterData, index) => {
    const sem = semesterData.semester;

    const semButton = document.createElement("button");
    semButton.className = "semester-btn" + (index === 0 ? " active" : "");
    semButton.textContent = `Sem ${sem}`;
    semButton.onclick = () => {
      document.querySelectorAll(".semester-btn").forEach(btn => btn.classList.remove("active"));
      semButton.classList.add("active");
      document.querySelectorAll(".semester-block").forEach(block => block.classList.add("hidden"));
      document.getElementById(`sem-${sem}`)?.classList.remove("hidden");
    };
    semesterList.appendChild(semButton);

    const block = document.createElement("div");
    block.className = "semester-block" + (index === 0 ? "" : " hidden");
    block.id = `sem-${sem}`;

    let coursesHtml = "";
    if (semesterData.courses?.length > 0) {
      semesterData.courses.forEach(course => {
        coursesHtml += `
          <div class="course-item">
            <div class="course-code">${course.code || "N/A"}</div>
            <div class="course-name">${course.name || "Unnamed Course"}</div>
            <div class="course-credits">${course.credits || "0"} Credits</div>
          </div>
        `;
      });
    } else {
      coursesHtml = '<p style="color:#aaa;text-align:center;">No courses in this semester</p>';
    }

    block.innerHTML = coursesHtml;
    semesterBlocks.appendChild(block);
  });
}
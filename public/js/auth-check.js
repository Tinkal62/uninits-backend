// auth-check.js - Authentication check + Profile picture loader
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;
  const studentStr = localStorage.getItem("student");
  const student = studentStr ? JSON.parse(studentStr) : null;
  
  console.log("Auth check - Page:", currentPage, "Student:", student);
  
  // If already logged in and trying to access login/register
  if ((currentPage.includes("login.html") || currentPage.includes("register.html")) && student) {
    console.log("Already logged in, redirecting to index");
    window.location.href = "/index.html";
    return;
  }
  
  // Protected pages that require login
  const protectedPages = ["/profile.html", "/attendance.html", "/study.html"];
  const isProtected = protectedPages.some(page => currentPage.includes(page));
  
  if (isProtected && !student) {
    console.log("Protected page accessed without login, redirecting to login");
    window.location.href = "/login.html";
    return;
  }
  
  // If user is logged in, update the profile picture in header
  if (student && student.scholarId) {
    updateHeaderProfilePicture(student);
  }
});

// Function to update profile picture in header
function updateHeaderProfilePicture(student) {
  const BACKEND_URL = "https://uninits-backend.onrender.com";
  const navProfileImage = document.getElementById("navProfileImage");
  
  if (!navProfileImage) {
    console.log("Profile image element not found in header");
    return;
  }
  
  // Determine the correct image URL
  let imageUrl;
  
  if (student.profileImage && 
      student.profileImage !== "null" && 
      student.profileImage !== "default.png" &&
      !student.profileImage.includes('/')) {
    // This is an UPLOADED image (has a filename like "20240001-1634567890123.jpg")
    imageUrl = `${BACKEND_URL}/uploads/profile-images/${student.profileImage}`;
    console.log("Setting uploaded profile image:", imageUrl);
  } else {
    // This is the DEFAULT image
    imageUrl = "/assets/images/default.png";
    console.log("Setting default profile image:", imageUrl);
  }
  
  // Set the image source
  navProfileImage.src = imageUrl;
  
  // Add error handling - if image fails to load, fall back to default
  navProfileImage.onerror = function() {
    console.warn("Profile image failed to load, falling back to default");
    this.src = "/assets/images/default.png";
    // Remove the error handler to prevent infinite loop
    this.onerror = null;
  };
  
  // Also update any other profile images on the page
  updateOtherProfileImages(student);
}

// Function to update other profile images (like in profile page)
function updateOtherProfileImages(student) {
  const BACKEND_URL = "https://uninits-backend.onrender.com";
  
  // Update main profile image on profile page
  const profileImage = document.getElementById("profileImage");
  if (profileImage) {
    let imageUrl;
    
    if (student.profileImage && 
        student.profileImage !== "null" && 
        student.profileImage !== "default.png" &&
        !student.profileImage.includes('/')) {
      imageUrl = `${BACKEND_URL}/uploads/profile-images/${student.profileImage}`;
    } else {
      imageUrl = "/assets/images/default.png";
    }
    
    profileImage.src = imageUrl;
    
    profileImage.onerror = function() {
      console.warn("Main profile image failed to load, falling back to default");
      this.src = "/assets/images/default.png";
      this.onerror = null;
    };
  }
}

// Optional: Function to refresh profile picture from backend
async function refreshProfilePictureFromBackend() {
  try {
    const student = JSON.parse(localStorage.getItem("student") || '{}');
    if (!student.scholarId) return;
    
    const BACKEND_URL = "https://uninits-backend.onrender.com";
    const response = await fetch(`${BACKEND_URL}/api/profile/${student.scholarId}`);
    
    if (response.ok) {
      const data = await response.json();
      const freshStudentData = data.student;
      
      // Update localStorage with fresh data
      const updatedStudent = {
        ...student,
        ...freshStudentData
      };
      localStorage.setItem("student", JSON.stringify(updatedStudent));
      
      // Update UI with fresh profile picture
      updateHeaderProfilePicture(updatedStudent);
    }
  } catch (error) {
    console.error("Error refreshing profile picture:", error);
  }
}

// Optional: Refresh profile picture when user returns to page
// (useful if they uploaded profile picture in another tab)
window.addEventListener('focus', () => {
  const student = JSON.parse(localStorage.getItem("student") || '{}');
  if (student && student.scholarId) {
    console.log("Page regained focus, updating profile picture");
    updateHeaderProfilePicture(student);
  }
});
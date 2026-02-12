// register.js - FIXED VERSION
const registerForm = document.getElementById("studentRegisterForm");
const scholarIdInput = document.getElementById("regScholarId");
const emailInput = document.getElementById("regEmail");
const userNameInput = document.getElementById("regUserName");

console.log("Register script loaded");

// Pre-fill scholarId from URL
document.addEventListener("DOMContentLoaded", () => {
  console.log("Register page DOM loaded");
  
  const urlParams = new URLSearchParams(window.location.search);
  const scholarId = urlParams.get('scholarId');
  
  if (scholarId && scholarIdInput) {
    console.log("Pre-filling scholarId:", scholarId);
    scholarIdInput.value = decodeURIComponent(scholarId);
  }
  
  // Mobile menu toggle
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});

// Handle registration
if (registerForm) {
  console.log("Register form found");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Registration form submitted");
    
    const scholarId = scholarIdInput.value.trim();
    const email = emailInput.value.trim();
    const userName = userNameInput.value.trim();
    
    console.log("Form data:", { scholarId, email, userName });
    
    if (!scholarId || !email || !userName) {
      alert("Please fill in all fields");
      return;
    }
    
    // Show loading
    const btn = registerForm.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    btn.disabled = true;
    
    try {
      console.log("Sending registration request...");
      const res = await fetch(`https://uninits-backend.onrender.com/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarId, email, userName })
      });
      
      console.log("Registration response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }
      
      const data = await res.json();
      console.log("Registration response data:", data);
      
      if (data.success) {
        console.log("Registration successful:", data.student);
        localStorage.setItem("student", JSON.stringify(data.student));
        sessionStorage.removeItem("pendingScholarId");
        window.location.href = "/index.html";
      } else {
        console.error("Registration failed:", data.error);
        alert("Registration failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error: " + error.message);
    } finally {
      btn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Register';
      btn.disabled = false;
    }
  });
} else {
  console.error("Register form not found");
}
// login.js - ULTRA DEBUG VERSION
console.log("=== LOGIN.JS LOADED ===");

// Find elements
const loginForm = document.getElementById("studentLoginForm");
const scholarIdInput = document.getElementById("scholarId");

console.log("Form found:", !!loginForm);
console.log("Input found:", !!scholarIdInput);

// Test backend connection immediately
async function testBackend() {
  console.log("Testing backend connection...");
  try {
    const response = await fetch("https://uninits-backend.onrender.com/");
    const data = await response.json();
    console.log("✅ Backend is running:", data);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    return false;
  }
}

// Run test on page load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded");
  await testBackend();
  
  // Add form listener if form exists
  if (loginForm && scholarIdInput) {
    console.log("Adding form submit listener");
    loginForm.addEventListener("submit", handleLoginSubmit);
  } else {
    console.error("❌ Form or input not found!");
  }
});

// Main login handler
async function handleLoginSubmit(e) {
  e.preventDefault();
  console.log("=== LOGIN ATTEMPT STARTED ===");
  
  const scholarId = scholarIdInput.value.trim();
  console.log("Scholar ID entered:", scholarId);
  
  if (!scholarId) {
    alert("Please enter your Scholar ID");
    return;
  }
  
  // Show loading
  const btn = loginForm.querySelector('button');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
  btn.disabled = true;
  
  try {
    console.log("Step 1: Checking registration...");
    
    const checkUrl = `https://uninits-backend.onrender.com/api/check-registration/${scholarId}`;
    console.log("Fetching:", checkUrl);
    
    const checkRes = await fetch(checkUrl);
    console.log("Check response status:", checkRes.status);
    console.log("Check response headers:", [...checkRes.headers.entries()]);
    
    const checkText = await checkRes.text();
    console.log("Check response text:", checkText);
    
    let checkData;
    try {
      checkData = JSON.parse(checkText);
      console.log("Check data parsed:", checkData);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError, "Raw text:", checkText);
      throw new Error("Invalid response from server");
    }
    
    if (!checkData.isRegistered) {
      console.log("User not registered, redirecting...");
      sessionStorage.setItem("pendingScholarId", scholarId);
      window.location.href = `/register.html?scholarId=${encodeURIComponent(scholarId)}`;
      return;
    }
    
    console.log("✅ User is registered, proceeding to login...");
    
    // User is registered, now login
    console.log("Step 2: Logging in...");
    const loginRes = await fetch(`https://uninits-backend.onrender.com/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scholarId })
    });
    
    console.log("Login response status:", loginRes.status);
    const loginText = await loginRes.text();
    console.log("Login response text:", loginText);
    
    let loginData;
    try {
      loginData = JSON.parse(loginText);
    } catch (parseError) {
      console.error("Failed to parse login JSON:", parseError);
      throw new Error("Invalid login response");
    }
    
    console.log("Login data:", loginData);
    
    if (loginData.success) {
      console.log("✅ Login successful!");
      console.log("Student data:", loginData.student);
      
      // Store in localStorage
      localStorage.setItem("student", JSON.stringify(loginData.student));
      console.log("✅ Student data stored in localStorage");
      
      // Redirect
      console.log("Redirecting to index.html...");
      window.location.href = "/index.html";
    } else {
      console.error("❌ Login failed:", loginData.error);
      alert("Login failed: " + (loginData.error || "Unknown error"));
    }
  } catch (error) {
    console.error("❌ Login process error:", error);
    alert("Error: " + error.message + "\nCheck console for details.");
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

// Mobile menu toggle
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("mobileMenu");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}
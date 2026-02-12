// logout.js
document.addEventListener("DOMContentLoaded", () => {
  // Main logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("student");
      window.location.href = "/login.html";
    });
  }
  
  // Mobile logout button
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("student");
      window.location.href = "/login.html";
    });
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
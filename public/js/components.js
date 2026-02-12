// components.js - Load reusable components

// Flag to track if scripts are already initialized
let scriptsInitialized = false;

async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    
    // Only initialize if not already done
    if (!scriptsInitialized) {
      initializeComponentScripts();
      scriptsInitialized = true;
    }
    
    console.log(`✅ Loaded component: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to load component ${filePath}:`, error);
  }
}

function initializeComponentScripts() {
  console.log('Initializing component scripts...');
  
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  
  console.log('Menu toggle found:', !!menuToggle);
  console.log('Mobile menu found:', !!mobileMenu);
  
  if (menuToggle && mobileMenu) {
    // Start with menu hidden
    mobileMenu.classList.remove('active');
    
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu toggle clicked!');
      mobileMenu.classList.toggle('active');
      console.log('Menu has active class:', mobileMenu.classList.contains('active'));
      
      // Debug: Log computed display style
      const displayStyle = window.getComputedStyle(mobileMenu).display;
      console.log('Computed display style:', displayStyle);
    });
    
    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
          console.log('Clicked outside, hiding menu');
          mobileMenu.classList.remove('active');
        }
      }
    });
    
    console.log('Mobile menu initialized');
  }
}

// Load all components on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded - Loading components');
  
  // Load navbar if element exists
  if (document.getElementById('navbar-container')) {
    await loadComponent('navbar-container', '/components/navbar.html');
  }
  
  // Load footer if element exists
  if (document.getElementById('footer-container')) {
    await loadComponent('footer-container', '/components/footer.html');
  }
  
  // Initialize profile picture in header (from auth-check.js)
  const student = JSON.parse(localStorage.getItem("student") || '{}');
  if (student && student.scholarId) {
    updateHeaderProfilePicture(student);
  }
});
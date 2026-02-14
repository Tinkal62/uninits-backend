// hostels.js - JavaScript for hostels page

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Mobile scroll fix
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'relative';
  }
  
  // Set today's date
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);
  
  // Load today's mess menu
  loadTodaysMenu();
  
  // Load hostels data
  loadHostelsData();
  
  // Setup modal
  setupModal();
});

// Get today's day name
function getTodayDay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
}

// Load today's mess menu
async function loadTodaysMenu() {
  try {
    console.log('Loading mess menu...');
    const response = await fetch('/data/mess_menu.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const menuData = await response.json();
    console.log('Menu data loaded:', menuData.length, 'days');
    
    // Get today's day
    const todayDay = getTodayDay();
    console.log('Today is:', todayDay);
    
    // Find today's menu
    const todayMenu = menuData.find(item => item.day === todayDay);
    
    if (todayMenu) {
      // Update UI with today's menu
      document.getElementById('todayDay').textContent = todayDay;
      document.getElementById('breakfast-menu').textContent = todayMenu.breakfast;
      document.getElementById('lunch-menu').textContent = todayMenu.lunch;
      document.getElementById('snacks-menu').textContent = todayMenu.snacks;
      document.getElementById('dinner-veg').textContent = todayMenu.dinner.veg;
      document.getElementById('dinner-nonveg').textContent = todayMenu.dinner['non-veg'];
      
      console.log('Today\'s menu loaded successfully');
    } else {
      console.error('No menu found for today:', todayDay);
      showMenuFallback();
    }
    
    // Store menu data for weekly view
    window.menuData = menuData;
    
  } catch (error) {
    console.error('Error loading mess menu:', error);
    showMenuFallback();
  }
}

// Load hostels data
async function loadHostelsData() {
  try {
    console.log('Loading hostels data...');
    const response = await fetch('/data/hostels.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const hostelsData = await response.json();
    console.log('Hostels data loaded:', hostelsData.length, 'hostels');
    
    // Display hostels
    displayHostels(hostelsData);
    
  } catch (error) {
    console.error('Error loading hostels data:', error);
    showHostelsFallback();
  }
}

// Display hostels in grid
function displayHostels(hostelsData) {
  const container = document.getElementById('hostels-list');
  if (!container) {
    console.error('Hostels container not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (hostelsData.length === 0) {
    container.innerHTML = '<div class="no-data">No hostel data available</div>';
    return;
  }
  
  hostelsData.forEach(hostel => {
    const card = document.createElement('div');
    card.className = 'hostel-card';
    
    // Format contact information
    const wardenContact = formatContactInfo(hostel.warden_phone, hostel.warden_email);
    const assistContact = formatContactInfo(hostel.assist_warden_phone, hostel.assist_warden_email);
    
    card.innerHTML = `
      <div class="hostel-header">
        <div class="hostel-name">${hostel.hostel_name}</div>
      </div>
      
      <!-- Warden Information -->
      <div class="warden-info">
        <div class="info-section">
          <h5><i class="fas fa-user-tie"></i> Warden</h5>
          <p>${hostel.warden || 'Information not available'}</p>
          ${wardenContact}
        </div>
        
        <!-- Assistant Warden (if exists) -->
        ${hostel.assist_warden ? `
          <div class="info-section">
            <h5><i class="fas fa-user-tie"></i> Assistant Warden</h5>
            <p>${hostel.assist_warden}</p>
            ${assistContact}
          </div>
        ` : ''}
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Format contact information with phone and email
function formatContactInfo(phone, email) {
  if (!phone && !email) {
    return '<div class="contact-details">Contact information not available</div>';
  }
  
  let html = '<div class="contact-details">';
  
  if (phone) {
    html += `
      <div class="contact-item">
        <i class="fas fa-phone"></i>
        <a href="tel:${phone}" class="contact-link">${phone}</a>
      </div>
    `;
  }
  
  if (email) {
    html += `
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <a href="mailto:${email}" class="contact-link">${email}</a>
      </div>
    `;
  }
  
  html += '</div>';
  return html;
}

// Setup modal functionality
function setupModal() {
  const modal = document.getElementById('menuModal');
  const viewBtn = document.getElementById('viewFullMenu');
  const closeBtn = document.getElementById('closeModal');
  const closeBtn2 = document.getElementById('closeModalBtn');
  
  // Open modal
  viewBtn.addEventListener('click', function() {
    loadWeeklyMenu();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Load weekly menu into table
function loadWeeklyMenu() {
  if (!window.menuData) {
    console.error('No menu data available');
    return;
  }
  
  const tableBody = document.querySelector('#weeklyMenuTable tbody');
  tableBody.innerHTML = '';
  
  window.menuData.forEach(dayMenu => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td><strong>${dayMenu.day}</strong></td>
      <td>${dayMenu.breakfast}</td>
      <td>${dayMenu.lunch}</td>
      <td>${dayMenu.snacks}</td>
      <td>${dayMenu.dinner.veg}</td>
      <td>${dayMenu.dinner['non-veg']}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Fallback for menu
function showMenuFallback() {
  const todayDay = getTodayDay();
  document.getElementById('todayDay').textContent = todayDay;
  document.getElementById('breakfast-menu').textContent = 'Menu data not available. Please check later.';
  document.getElementById('lunch-menu').textContent = 'Menu data not available. Please check later.';
  document.getElementById('snacks-menu').textContent = 'Menu data not available. Please check later.';
  document.getElementById('dinner-veg').textContent = 'Menu data not available. Please check later.';
  document.getElementById('dinner-nonveg').textContent = 'Menu data not available. Please check later.';
}

// Fallback for hostels
function showHostelsFallback() {
  const container = document.getElementById('hostels-list');
  container.innerHTML = `
    <div class="no-data">
      <h3>Hostel data not available</h3>
      <p>Please try again later or check your connection</p>
    </div>
  `;
}
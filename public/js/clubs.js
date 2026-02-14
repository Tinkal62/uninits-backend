// clubs.js - JavaScript for clubs and societies page

// Gradient classes from index.css
const gradientClasses = [
  'gradient-11', 'gradient-12', 'gradient-13',
  'gradient-21', 'gradient-22', 'gradient-23'
];

// Smart icon mapping function
function getClubIcon(clubName) {
  // Map specific club names to specific icons
  const iconMap = {
    // Clubs
    'N.E.R.D.S.': 'fas fa-robot',
    'ML club': 'fas fa-brain',
    'GDGC': 'fas fa-code',
    'E-cell': 'fas fa-lightbulb',
    'Symphonits': 'fas fa-music',
    'Advay': 'fas fa-theater-masks',
    'Obiettivo': 'fas fa-camera',
    'Aaveg': 'fas fa-dancer',
    'NITSMUN': 'fas fa-globe-americas',
    'Quiz Club': 'fas fa-question-circle',
    'ECO Club': 'fas fa-leaf',
    'Dojo': 'fas fa-user-ninja',
    'Yoga Club': 'fas fa-spa',
    'NITS Cricket': 'fas fa-baseball-ball',
    'Adventure Club': 'fas fa-mountain',
    'Illumminits': 'fas fa-paint-brush',
    'Finance Club': 'fas fa-chart-line',
    'NITS Esports': 'fas fa-gamepad',
    'Hindi Sahitya Samiti': 'fas fa-book',
    'Khokho club': 'fas fa-running',
    'ASTRA': 'fas fa-rocket',
    
    // Branch Societies
    'Computer Science Society (CSS)': 'fas fa-laptop-code',
    'ELECTRONICS & COMMUNICATION SOCIETY (ECS)': 'fas fa-satellite-dish',
    'Instrumentation and Electronics Engineering Society (INSEES)': 'fas fa-microchip',
    'Electra (Electrical Engineering Society)': 'fas fa-bolt',
    'Civil Engineering Society (CES)': 'fas fa-building',
    'Mechanical Engineering Society (MES)': 'fas fa-cogs',
    
    // Others
    'IEEE Students\' Branch': 'fas fa-network-wired',
    'Indian Society for Technical Education (ISTE)': 'fas fa-graduation-cap',
    'Management Society': 'fas fa-briefcase',
    'NSS': 'fas fa-hands-helping',
    'IEI NIT Silchar': 'fas fa-industry',
    'ASME NITS': 'fas fa-tools',
    'MATLAB SA NITS': 'fas fa-calculator',
    'Gyansagar': 'fas fa-user-graduate',
    'NCC NIT Silchar': 'fas fa-flag'
  };
  
  // Return specific icon if mapped, otherwise fallback
  return iconMap[clubName] || 'fas fa-users';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Mobile scroll fix
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'relative';
  }
  
  // Load clubs data and display
  loadClubsData();
  
  // Setup search functionality
  setupSearch();
});

// Load clubs data from JSON
async function loadClubsData() {
  try {
    console.log('Loading clubs data...');
    const response = await fetch('/data/clubs.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const clubsData = await response.json();
    console.log('Clubs data loaded:', clubsData.length, 'clubs found');
    
    // Separate data by section
    const clubs = clubsData.filter(item => item.section === 'clubs');
    const societies = clubsData.filter(item => item.section === 'branch societies');
    const others = clubsData.filter(item => item.section === 'others');
    
    console.log(`Sections: Clubs(${clubs.length}), Societies(${societies.length}), Others(${others.length})`);
    
    // Display each section
    displayClubs(clubs, 'clubs-section', 'clubs');
    displayClubs(societies, 'societies-section', 'branch societies');
    displayClubs(others, 'others-section', 'others');
    
    // Store data globally for search
    window.allClubsData = clubsData;
    
  } catch (error) {
    console.error('Error loading clubs data:', error);
    showFallbackContent();
  }
}

// Display clubs in the specified container
function displayClubs(clubsArray, containerId, sectionType) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container not found: ${containerId}`);
    return;
  }
  
  container.innerHTML = '';
  
  if (clubsArray.length === 0) {
    container.innerHTML = '<div class="no-results">No data available</div>';
    return;
  }
  
  console.log(`Displaying ${clubsArray.length} clubs in ${containerId}`);
  
  clubsArray.forEach((club, index) => {
    // Get a gradient class (cycle through available classes)
    const gradientClass = gradientClasses[index % gradientClasses.length];
    
    // Get icon using smart mapping
    const iconClass = getClubIcon(club.name);
    
    // Create card
    const card = document.createElement(club.link ? 'a' : 'div');
    if (club.link) {
      card.href = club.link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    
    card.className = `club-card ${gradientClass}`;
    card.dataset.name = club.name.toLowerCase();
    card.dataset.section = club.section;
    card.dataset.description = club.description.toLowerCase();
    
    // Truncate description if too long
    let description = club.description;
    if (description.length > 180) {
      description = description.substring(0, 180) + '...';
    }
    
    card.innerHTML = `
      <div class="club-header">
        <div class="club-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="club-name">${club.name}</div>
      </div>
      <div class="club-description">${description}</div>
      <div class="club-link">
        ${club.link ? 
          '<i class="fas fa-external-link-alt"></i> Visit Website' : 
          '<span class="no-link">No website available</span>'
        }
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      // Show all sections
      document.getElementById('clubs-section').style.display = 'grid';
      document.getElementById('societies-section').style.display = 'grid';
      document.getElementById('others-section').style.display = 'grid';
      document.getElementById('noResults').style.display = 'none';
      
      // Show all section headers
      document.querySelectorAll('.section-header').forEach(header => {
        header.style.display = 'block';
      });
      
      // Show all cards
      document.querySelectorAll('.club-card').forEach(card => {
        card.style.display = 'flex';
      });
      
      return;
    }
    
    // Filter all cards
    const allCards = document.querySelectorAll('.club-card');
    let hasResults = false;
    
    // Show/hide sections based on search
    const sections = {
      'clubs': { container: 'clubs-section', header: document.querySelector('.clubs-header') },
      'branch societies': { container: 'societies-section', header: document.querySelector('.societies-header') },
      'others': { container: 'others-section', header: document.querySelector('.others-header') }
    };
    
    // Reset all sections to hidden initially
    Object.values(sections).forEach(section => {
      if (section.container && section.header) {
        document.getElementById(section.container).style.display = 'none';
        section.header.style.display = 'none';
      }
    });
    
    // Track which sections have visible cards
    const visibleSections = new Set();
    
    // Filter and show matching cards
    allCards.forEach(card => {
      const clubName = card.dataset.name;
      const clubDescription = card.dataset.description;
      const section = card.dataset.section;
      
      if (clubName.includes(searchTerm) || clubDescription.includes(searchTerm)) {
        card.style.display = 'flex';
        
        // Show the section container and header
        if (sections[section]) {
          document.getElementById(sections[section].container).style.display = 'grid';
          sections[section].header.style.display = 'block';
          visibleSections.add(section);
          hasResults = true;
        }
      } else {
        card.style.display = 'none';
      }
    });
    
    // Hide empty sections
    Object.keys(sections).forEach(sectionKey => {
      if (!visibleSections.has(sectionKey) && sections[sectionKey]) {
        document.getElementById(sections[sectionKey].container).style.display = 'none';
        sections[sectionKey].header.style.display = 'none';
      }
    });
    
    // Show/hide no results message
    document.getElementById('noResults').style.display = hasResults ? 'none' : 'block';
  });
}

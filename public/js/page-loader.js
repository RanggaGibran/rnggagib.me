// Handle page navigation with transitions

class PageLoader {
  constructor() {
    this.initEventListeners();
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
  }
  handleRefresh() {
  // Ambil path dari URL
  const path = window.location.pathname.replace(/\/$/, '') || '/index';
  const sectionId = path.split('/').pop().replace('.html', '');
  
  // Jika menavigasi ke halaman lain, coba load content secara dinamis
  if (sectionId && sectionId !== 'index' && sectionId !== 'home') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          this.activateSection(sectionId);
        }, 100);
      });
    } else {
      this.activateSection(sectionId);
    }
  }
}

activateSection(sectionId) {
  console.log(`Activating section: ${sectionId}`);
  const section = document.getElementById(sectionId);
  if (section) {
    // Hide all other sections
    document.querySelectorAll('.game-level').forEach(s => {
      s.classList.remove('active');
    });
    
    // Activate this section
    section.classList.add('active');
    
    // Update menu highlight
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionId || 
          item.getAttribute('data-page') === `${sectionId}.html`) {
        item.classList.add('active');
      }
    });
    
    // Initialize specific section functionality
    if (sectionId === 'skills' && typeof window.initSkillBars === 'function') {
      window.initSkillBars();
    } else if (sectionId === 'projects' && typeof animateProjectItems === 'function') {
      animateProjectItems();
    }
  }
}

// Tambahkan ini di constructor
constructor() {
  this.initEventListeners();
  this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
  this.handleRefresh(); // Panggil handleRefresh di constructor
}
  initEventListeners() {
    // Delegate event listener for menu items and other navigation elements
    document.addEventListener('click', async (e) => {
      // Menu item clicks
      if (e.target.classList.contains('menu-item')) {
        e.preventDefault();
        const targetPage = e.target.getAttribute('data-page');
        if (targetPage) {
          await this.loadPage(targetPage);
        }
      }
      
      // CTA button click
      if (e.target.classList.contains('cta-button')) {
        e.preventDefault();
        const targetPage = e.target.getAttribute('data-target');
        if (targetPage) {
          await this.loadPage(targetPage);
        }
      }
    });
  }
  
  async loadPage(page) {
    // Don't reload current page
    if (page === this.currentPage) return;
    
    try {
      // Show transition effect
      if (window.loadingScreen) {
        await window.loadingScreen.showTransition(400);
      }
      
      // Play sound effect
      if (window.playPixelSound) {
        window.playPixelSound('click');
      }
      
      // Change URL and load new page
      window.location.href = page;
      
      // Show achievement
      if (window.showAchievement) {
        const pageName = page.replace('.html', '').toUpperCase();
        window.showAchievement(`${pageName} LEVEL UNLOCKED!`);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    }
  }
}

// Initialize PageLoader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pageLoader = new PageLoader();
});
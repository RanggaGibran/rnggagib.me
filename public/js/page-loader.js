// Handle page navigation with transitions

class PageLoader {
  constructor() {
    this.initEventListeners();
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
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
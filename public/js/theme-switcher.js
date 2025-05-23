class ThemeSwitcher {
  constructor() {
    this.themeSwitcher = document.querySelector('.theme-switcher');
    
    // Exit early if theme switcher not found
    if (!this.themeSwitcher) {
      console.warn('Theme switcher element not found');
      return;
    }
    
    this.themeIcon = document.querySelector('.theme-icon');
    this.themeMenu = document.querySelector('.theme-menu');
    this.themeOptions = document.querySelectorAll('.theme-option');
    
    // Default theme
    this.currentTheme = localStorage.getItem('pixelPortfolioTheme') || 'default';
    
    this.init();
  }
  
  init() {
    // Guard clause
    if (!this.themeIcon || !this.themeSwitcher) return;
    
    // Set up initial theme
    this.applyTheme(this.currentTheme);
    this.updateActiveOption();
    
    // Set up event listeners
    this.themeIcon.addEventListener('click', () => {
      this.toggleThemeMenu();
    });
    
    // Theme option click events
    this.themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        this.applyTheme(theme);
        this.updateActiveOption();
        this.toggleThemeMenu(false);
        
        // Play sound effect
        if (window.playPixelSound) {
          window.playPixelSound('click');
        }
        
        // Show achievement for changing theme
        if (window.showAchievement) {
          const themeName = option.querySelector('span').textContent;
          window.showAchievement(`${themeName.toUpperCase()} THEME ACTIVATED!`);
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.themeSwitcher.contains(e.target) && this.themeMenu.classList.contains('visible')) {
        this.toggleThemeMenu(false);
      }
    });
    
    // Add special achievement for trying all themes
    this.trackThemeAchievements();
    
    // Auto switch to night mode after sunset if auto mode is enabled
    this.checkAutoNightMode();
    
    // Auto night mode toggle
    const autoNightToggle = document.querySelector('.auto-night');
    
    // Set initial state
    const autoNightEnabled = localStorage.getItem('pixelPortfolioAutoNight') === 'true';
    if (autoNightEnabled) {
      autoNightToggle.classList.add('active');
    }
    
    autoNightToggle.addEventListener('click', () => {
      autoNightToggle.classList.toggle('active');
      const isEnabled = autoNightToggle.classList.contains('active');
      
      localStorage.setItem('pixelPortfolioAutoNight', isEnabled);
      
      // If enabled, check right away
      if (isEnabled) {
        this.checkAutoNightMode();
      }
      
      // Play sound effect
      if (window.playPixelSound) {
        window.playPixelSound('click');
      }
    });
  }
  
  toggleThemeMenu(show) {
    if (show === undefined) {
      this.themeMenu.classList.toggle('visible');
    } else {
      if (show) {
        this.themeMenu.classList.add('visible');
      } else {
        this.themeMenu.classList.remove('visible');
      }
    }
    
    // Play sound when opening menu
    if (this.themeMenu.classList.contains('visible') && window.playPixelSound) {
      window.playPixelSound('start');
    }
  }
  
  applyTheme(theme) {
    // Don't change theme if still loading
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && 
        loadingScreen.style.opacity !== '0' && 
        loadingScreen.style.visibility !== 'hidden') {
      console.log('Loading in progress, theme change delayed');
      setTimeout(() => this.applyTheme(theme), 1000);
      return;
    }
    
    // Add pixel animation when changing themes
    this.animateThemeChange();
    
    // Remove any existing theme
    document.documentElement.removeAttribute('data-theme');
    
    // Apply the new theme if it's not default
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Save to localStorage
    localStorage.setItem('pixelPortfolioTheme', theme);
    this.currentTheme = theme;
  }
  
  animateThemeChange() {
    // Create animation container
    let container = document.querySelector('.theme-change-animation');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'theme-change-animation';
      document.body.appendChild(container);
    }
    
    // Force cleanup of any existing animation first
    container.innerHTML = '';
    container.classList.remove('active');
    
    // Use CSS-based animation instead of creating many DOM elements
    const overlay = document.createElement('div');
    overlay.className = 'theme-change-overlay';
    container.appendChild(overlay);
    
    // Show animation
    requestAnimationFrame(() => {
      container.classList.add('active');
      
      // Hide and clean up
      setTimeout(() => {
        container.classList.remove('active');
        setTimeout(() => {
          if (container && document.body.contains(container)) {
            container.innerHTML = '';
          }
        }, 500);
      }, 600);
    });
    
    // Safety cleanup
    setTimeout(() => {
      if (container && document.body.contains(container)) {
        container.innerHTML = '';
        container.classList.remove('active');
      }
    }, 2000);
  }
  
  updateActiveOption() {
    // Remove active class from all options
    this.themeOptions.forEach(option => {
      option.classList.remove('active');
    });
    
    // Add active class to current theme
    const currentOption = document.querySelector(`.theme-option[data-theme="${this.currentTheme}"]`);
    if (currentOption) {
      currentOption.classList.add('active');
    }
  }
  
  trackThemeAchievements() {
    // Get visited themes from localStorage
    let visitedThemes = JSON.parse(localStorage.getItem('pixelPortfolioVisitedThemes')) || [];
    
    // Add current theme if not already visited
    if (!visitedThemes.includes(this.currentTheme)) {
      visitedThemes.push(this.currentTheme);
      localStorage.setItem('pixelPortfolioVisitedThemes', JSON.stringify(visitedThemes));
    }
    
    // Check if all themes have been tried
    const allThemes = ['default', 'night', 'gameboy', 'nes'];
    const allVisited = allThemes.every(theme => visitedThemes.includes(theme));
    
    if (allVisited) {
      // Check if achievement already earned
      const themeAchievementEarned = localStorage.getItem('pixelPortfolioThemeAchievement');
      
      if (!themeAchievementEarned && window.showAchievement) {
        // Show achievement with slight delay to not conflict with theme change
        setTimeout(() => {
          window.showAchievement('THEME MASTER: ALL THEMES EXPLORED!');
        }, 1000);
        
        localStorage.setItem('pixelPortfolioThemeAchievement', 'true');
      }
    }
  }
  
  checkAutoNightMode() {
    const autoNightMode = localStorage.getItem('pixelPortfolioAutoNight');
    
    if (autoNightMode === 'true') {
      const hour = new Date().getHours();
      // If it's night time (between 7pm and 7am)
      if (hour >= 19 || hour < 7) {
        this.applyTheme('night');
        this.updateActiveOption();
      }
    }
    
    // Check again every hour
    setTimeout(() => this.checkAutoNightMode(), 3600000);
  }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeSwitcher = new ThemeSwitcher();
});
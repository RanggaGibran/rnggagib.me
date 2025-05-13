class ThemeSwitcher {
  constructor() {
    this.themeSwitcher = document.querySelector('.theme-switcher');
    this.themeIcon = document.querySelector('.theme-icon');
    this.themeMenu = document.querySelector('.theme-menu');
    this.themeOptions = document.querySelectorAll('.theme-option');
    
    // Default theme
    this.currentTheme = localStorage.getItem('pixelPortfolioTheme') || 'default';
    
    this.init();
  }
  
  init() {
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
    
    // Clear previous animation
    container.innerHTML = '';
    
    // Create fewer pixels - reduce density by 2x
    const pixelSize = 20; // Increased from 10 to 20
    const cols = Math.ceil(window.innerWidth / pixelSize);
    const rows = Math.ceil(window.innerHeight / pixelSize);
    const maxPixels = 300; // Limit maximum number of pixels
    
    let pixelCount = 0;
    
    for (let i = 0; i < cols && pixelCount < maxPixels; i += 2) {
      for (let j = 0; j < rows && pixelCount < maxPixels; j += 2) {
        const pixel = document.createElement('div');
        pixel.className = 'theme-pixel';
        pixel.style.left = `${i * pixelSize}px`;
        pixel.style.top = `${j * pixelSize}px`;
        pixel.style.opacity = '0';
        
        // Random opacity timing for pixel-dissolve effect
        const delay = Math.random() * 0.3; // Reduced from 0.5 to 0.3
        setTimeout(() => {
          pixel.style.opacity = '1';
          setTimeout(() => {
            pixel.style.opacity = '0';
            // Remove the pixel element after transition
            setTimeout(() => {
              if (pixel.parentNode === container) {
                container.removeChild(pixel);
              }
            }, 300);
          }, 250); // Reduced from 300 to 250
        }, delay * 1000);
        
        container.appendChild(pixel);
        pixelCount++;
      }
    }
    
    // Show and then hide container with cleanup
    container.classList.add('active');
    setTimeout(() => {
      container.classList.remove('active');
      // Force cleanup after animation
      setTimeout(() => {
        container.innerHTML = '';
      }, 300);
    }, 600); // Reduced from 800 to 600
    
    // Safety cleanup after 3 seconds no matter what
    setTimeout(() => {
      if (container && document.body.contains(container)) {
        container.innerHTML = '';
        container.classList.remove('active');
      }
    }, 3000);
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
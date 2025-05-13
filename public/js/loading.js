// Loading Screen Controller
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingBar = document.getElementById('loading-bar');
    this.loadingPercent = this.loadingBar.querySelector('.loading-percent');
    this.loadingTip = document.getElementById('loading-tip');
    this.loadingInteract = document.getElementById('loading-interact');
    this.loadingStart = document.getElementById('loading-start');
    this.loadingTransition = document.getElementById('loading-transition');
    
    this.tips = [
      'Click on floating coins to collect them!',
      'Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A',
      'Collect 25 coins to unlock the mini-game!',
      'Hidden achievements are waiting to be discovered...',
      'Try clicking the logo for a surprise!',
      'You can jump on enemies to defeat them in the game',
      'Some buttons have hidden interactions!',
      'Watch out for floating pixel creatures'
    ];
    
    this.progress = 0;
    this.tipIndex = 0;
    this.tipTimer = null;
    this.loaded = false;
    this.assetsLoaded = false;
    
    this.init();
  }
  
  init() {
    // Set up event listener for start button
    this.loadingStart.addEventListener('click', () => {
      this.hideLoadingScreen();
    });
    
    // Start loading sequence
    this.startLoading();
    
    // Cycle through tips
    this.cycleTips();
    
    // Actually count the images to load
    this.countAssetsAndLoad();
  }
  
  startLoading() {
    // Simulate loading progress if not counting real assets
    if (!this.assetsLoaded) {
      const loadingInterval = setInterval(() => {
        this.progress += Math.random() * 3;
        
        if (this.progress >= 100) {
          this.progress = 100;
          clearInterval(loadingInterval);
          this.onLoadingComplete();
        }
        
        this.updateLoadingBar();
      }, 100);
    }
  }
  
  countAssetsAndLoad() {
    // Get all images that need to be loaded
    const images = Array.from(document.images);
    const totalAssets = images.length;
    let loadedAssets = 0;
    
    // If no images, set a minimum delay
    if (totalAssets === 0) {
      setTimeout(() => {
        this.progress = 100;
        this.updateLoadingBar();
        this.onLoadingComplete();
      }, 2000);
      return;
    }
    
    // Set up load event for each image
    images.forEach(img => {
      if (img.complete) {
        loadedAssets++;
        this.progress = Math.floor((loadedAssets / totalAssets) * 100);
        this.updateLoadingBar();
        
        if (loadedAssets === totalAssets) {
          this.onLoadingComplete();
        }
      } else {
        img.addEventListener('load', () => {
          loadedAssets++;
          this.progress = Math.floor((loadedAssets / totalAssets) * 100);
          this.updateLoadingBar();
          
          if (loadedAssets === totalAssets) {
            this.onLoadingComplete();
          }
        });
        
        img.addEventListener('error', () => {
          loadedAssets++;
          this.progress = Math.floor((loadedAssets / totalAssets) * 100);
          this.updateLoadingBar();
          
          if (loadedAssets === totalAssets) {
            this.onLoadingComplete();
          }
        });
      }
    });
    
    // Set a minimum loading time
    setTimeout(() => {
      this.assetsLoaded = true;
      if (this.progress >= 100) {
        this.onLoadingComplete();
      }
    }, 2000);
  }
  
  updateLoadingBar() {
    // Update the loading bar width
    this.loadingBar.style.width = `${this.progress}%`;
    
    // Update the character position
    const character = this.loadingBar.querySelector('.loading-character');
    if (character) {
      character.style.left = `calc(${this.progress}% - 16px)`;
    }
    
    // Update the percentage text
    this.loadingPercent.textContent = `${Math.floor(this.progress)}%`;
  }
  
  onLoadingComplete() {
    if (this.loaded) return;
    
    // Show the interact button
    this.loadingInteract.classList.add('visible');
    this.loaded = true;
    
    // Add sound effect
    if (window.playPixelSound) {
      window.playPixelSound('success');
    }
    
    // Auto hide after delay (optional)
    setTimeout(() => {
      if (this.loadingScreen.style.opacity !== '0') {
        this.hideLoadingScreen();
      }
    }, 5000);
  }
  
  hideLoadingScreen() {
    // Check if theme change animation is still active
    const themeAnimation = document.querySelector('.theme-change-animation');
    if (themeAnimation) {
      themeAnimation.innerHTML = '';
      themeAnimation.classList.remove('active');
    }

    this.loadingScreen.style.opacity = '0';
    this.loadingScreen.style.visibility = 'hidden';
    
    // Play start sound
    if (window.playPixelSound) {
      window.playPixelSound('start');
    }
    
    // Show achievement
    if (window.showAchievement) {
      window.showAchievement('GAME STARTED!');
    }
    
    // Ensure complete removal after transition
    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
      
      // Dispatch custom event when loading is completely done
      const loadingCompleteEvent = new CustomEvent('loadingComplete');
      document.dispatchEvent(loadingCompleteEvent);
    }, 500);
  }
  
  cycleTips() {
    this.tipTimer = setInterval(() => {
      this.loadingTip.classList.add('fade');
      
      setTimeout(() => {
        this.tipIndex = (this.tipIndex + 1) % this.tips.length;
        this.loadingTip.textContent = this.tips[this.tipIndex];
        this.loadingTip.classList.remove('fade');
      }, 500);
    }, 4000);
  }
  
  // Page transition effect
  showTransition(duration = 600) {
    return new Promise(resolve => {
      this.loadingTransition.classList.add('active');
      
      setTimeout(() => {
        resolve();
        
        setTimeout(() => {
          this.hideTransition();
        }, 200);
      }, duration);
    });
  }
  
  hideTransition() {
    this.loadingTransition.classList.remove('active');
  }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  window.loadingScreen = new LoadingScreen();
});
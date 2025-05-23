// Loading Screen Controller
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    
    // Exit early if loading screen not found
    if (!this.loadingScreen) {
      console.warn('Loading screen element not found');
      return;
    }
    
    this.loadingBar = document.getElementById('loading-bar');
    
    // Exit if loading bar not found
    if (!this.loadingBar) {
      console.warn('Loading bar element not found');
      return;
    }
    
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
    
    // Force timeout untuk mencegah loading screen terjebak
    setTimeout(() => {
      if (this.loadingScreen && 
          this.loadingScreen.style.opacity !== '0' && 
          this.loadingScreen.style.visibility !== 'hidden') {
        console.warn('Force closing loading screen after timeout');
        this.hideLoadingScreen();
      }
    }, 8000); // Tunggu maksimal 8 detik
  }
  
  // Modifikasi juga method lain untuk memastikan mereka memeriksa keberadaan elemen
  init() {
    // Guard clause untuk mencegah error jika elemen tidak ditemukan
    if (!this.loadingStart || !this.loadingScreen) return;
    
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
  
  preloadImages() {
    const imagesToPreload = [
      'images/pixel-art/player.png',
      'images/pixel-art/avatar.png', 
      'images/pixel-art/background.png',
      'images/pixel-art/coin.png'
    ];
    
    const promises = imagesToPreload.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Failed to load ${src}`);
        img.src = src;
      });
    });
    
    return Promise.allSettled(promises);
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
    this.preloadImages().then(() => {
      console.log('All critical images preloaded');
    });
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
    
    // Ensure complete removal after transition
    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
      
      // Dispatch custom event when loading is completely done
      const loadingCompleteEvent = new CustomEvent('loadingComplete');
      document.dispatchEvent(loadingCompleteEvent);
      
      // Start background music
      setTimeout(() => {
        const musicPlayer = document.getElementById('background-music');
        if (musicPlayer && musicPlayer.paused && 
            localStorage.getItem('pixelPortfolio_musicPlaying') !== 'false') {
          try {
            musicPlayer.play().then(() => {
              const musicToggle = document.getElementById('music-toggle');
              const musicStatus = document.getElementById('music-status');
              if (musicToggle) musicToggle.innerHTML = "◼";
              if (musicStatus) musicStatus.textContent = "Playing";
              if (musicToggle) musicToggle.style.backgroundColor = "#4ecca3";
            }).catch(e => console.log('Auto-play prevented after loading'));
          } catch (e) {
            console.log('Music player error:', e);
          }
        }
      }, 500);
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

// Tambahkan class untuk Simple Loading Screen
class SimpleLoadingScreen {
  constructor(loadingScreen) {
    this.loadingScreen = loadingScreen;
    this.loadingTransition = document.getElementById('loading-transition');
    
    // Auto-hide setelah 1 detik
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 1000);
  }
  
  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      this.loadingScreen.style.visibility = 'hidden';
      
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 300);
    }
  }
  
  showTransition(duration = 300) {
    return new Promise(resolve => {
      if (this.loadingTransition) {
        this.loadingTransition.classList.add('active');
      }
      
      setTimeout(() => {
        resolve();
        
        setTimeout(() => {
          this.hideTransition();
        }, 200);
      }, duration);
    });
  }
  
  hideTransition() {
    if (this.loadingTransition) {
      this.loadingTransition.classList.remove('active');
    }
  }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  // Cek apakah ini halaman certificate atau halaman sub lainnya
  const isSubPage = window.location.pathname.includes('certificate.html') || 
                    window.location.pathname.includes('projects.html') ||
                    window.location.pathname.includes('skills.html') ||
                    window.location.pathname.includes('about.html') ||
                    window.location.pathname.includes('contact.html');

  // Jika ini subpage, lewati loading screen atau gunakan mode simple
  if (isSubPage) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Berikan loading cepat (1 detik) untuk subpage
      window.loadingScreen = new SimpleLoadingScreen(loadingScreen);
    } else {
      console.warn('Loading screen element not found on subpage');
    }
  } else {
    // Gunakan loading screen normal untuk homepage
    window.loadingScreen = new LoadingScreen();
  }
});
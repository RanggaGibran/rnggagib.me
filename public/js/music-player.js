// Music Player Controller
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('background-music');
    this.musicToggle = document.getElementById('music-toggle');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeValue = document.querySelector('.volume-value');
    
    this.isMuted = false;
    this.volume = 0.3; // Default to 30%
    this.isInitialized = false;
    
    // Load user preferences
    this.loadPreferences();
    
    // Initialize player
    this.init();
  }
  
  init() {
    if (!this.audio) return;
    
    // Set initial volume
    this.audio.volume = this.volume;
    this.volumeSlider.value = this.volume * 100;
    this.updateVolumeDisplay();
    
    // Apply mute state
    if (this.isMuted) {
      this.mute();
    }
    
    // Set up event listeners
    this.musicToggle.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('input', () => this.changeVolume());
    
    // Handle page visibility change to respect user engagement
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (!this.isMuted) {
        this.play();
      }
    });
    
    this.isInitialized = true;
    
    // Try to play music (will be blocked by browsers without user interaction)
    this.attemptAutoplay();
    
    // Attach click listener to body for first interaction
    document.body.addEventListener('click', () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        if (!this.isMuted) {
          this.play();
        }
      }
    }, { once: true });
  }
  
  attemptAutoplay() {
    // Check if autoplay is allowed
    const playPromise = this.audio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay started successfully
        console.log('Background music playing automatically');
        this.hasInteracted = true;
      })
      .catch(err => {
        // Autoplay was prevented
        console.log('Browser blocked autoplay, waiting for user interaction');
        // Audio will play on first user interaction
      });
    }
  }
  
  play() {
    if (!this.audio || this.isMuted) return;
    
    const playPromise = this.audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error("Playback error:", err);
      });
    }
  }
  
  pause() {
    if (!this.audio) return;
    this.audio.pause();
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.mute();
    } else {
      this.unmute();
    }
    
    // Save preference
    this.savePreferences();
  }
  
  mute() {
    if (!this.audio) return;
    
    this.audio.pause();
    this.musicToggle.classList.add('muted');
    this.isMuted = true;
  }
  
  unmute() {
    if (!this.audio) return;
    
    this.audio.play().catch(err => {
      console.log("Could not play audio after unmute:", err);
    });
    this.musicToggle.classList.remove('muted');
    this.isMuted = false;
  }
  
  changeVolume() {
    if (!this.audio) return;
    
    this.volume = this.volumeSlider.value / 100;
    this.audio.volume = this.volume;
    
    this.updateVolumeDisplay();
    
    // Save preference
    this.savePreferences();
  }
  
  updateVolumeDisplay() {
    if (!this.volumeValue) return;
    
    this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
  }
  
  savePreferences() {
    localStorage.setItem('pixelPortfolio_musicVolume', this.volume);
    localStorage.setItem('pixelPortfolio_musicMuted', this.isMuted);
  }
  
  loadPreferences() {
    const savedVolume = localStorage.getItem('pixelPortfolio_musicVolume');
    const savedMuted = localStorage.getItem('pixelPortfolio_musicMuted');
    
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
    
    if (savedMuted !== null) {
      this.isMuted = savedMuted === 'true';
    }
  }
}

// Initialize music player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure audio element is ready
  setTimeout(() => {
    window.musicPlayer = new MusicPlayer();
  }, 1000);
});
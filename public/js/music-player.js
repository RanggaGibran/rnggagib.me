// Tambahkan di bagian atas file

document.addEventListener('DOMContentLoaded', () => {
  // Cek apakah music player sudah ada
  const backgroundMusic = document.getElementById('background-music');
  if (!backgroundMusic) return;

  // Inisialisasi music player jika belum ada
  if (!window.musicPlayer) {
    window.musicPlayer = new MusicPlayer();
  }
  
  // Resume music playback jika sebelumnya playing
  const wasPlaying = localStorage.getItem('pixelPortfolio_musicPlaying') === 'true';
  if (wasPlaying && !backgroundMusic.paused) {
    // Musik sudah playing, tidak perlu melakukan apa-apa
  } else if (wasPlaying) {
    // Musik seharusnya playing tapi paused (mungkin karena navigasi halaman)
    setTimeout(() => {
      backgroundMusic.play().catch(e => console.log('Auto-play prevented by browser'));
    }, 1000);
  }

  // Dengarkan event beforeunload untuk menyimpan status musik
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('pixelPortfolio_musicPlaying', !backgroundMusic.paused);
  });

  // Ensure music player has optimal positioning on all devices
  adjustMusicPlayerPosition();
  
  // Handle window resize events
  window.addEventListener('resize', adjustMusicPlayerPosition);
});

// Music Player Controller
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('background-music');
    this.musicToggle = document.getElementById('music-toggle');
    this.volumeSlider = document.getElementById('volume-slider');
    this.musicStatus = document.getElementById('music-status');
    this.volumeValue = document.querySelector('.volume-value');
    
    if (!this.audio || !this.musicToggle || !this.volumeSlider) {
      console.warn('Music player elements not found');
      return;
    }
    
    this.isMuted = localStorage.getItem('pixelPortfolio_musicMuted') === 'true';
    this.volume = parseFloat(localStorage.getItem('pixelPortfolio_musicVolume') || 0.3);
    
    // Initialize player
    this.init();
  }
  
  init() {
    if (!this.audio) return;
    
    // Set initial volume
    this.audio.volume = this.volume;
    if (this.volumeSlider) this.volumeSlider.value = this.volume * 100;
    this.updateVolumeDisplay();
    
    // Apply mute state
    if (this.isMuted) {
      this.mute();
    } else {
      // Update UI to show correct state
      if (this.musicToggle) this.musicToggle.classList.remove('muted');
    }
    
    // Set up event listeners
    this.musicToggle?.addEventListener('click', () => this.toggleMute());
    this.volumeSlider?.addEventListener('input', () => this.changeVolume());
    
    // Monitor playback state changes
    this.audio.addEventListener('play', () => {
      if (this.musicStatus) this.musicStatus.textContent = 'Playing';
      if (this.musicToggle) {
        this.musicToggle.classList.add('playing');
        this.musicToggle.textContent = "◼";
      }
      localStorage.setItem('pixelPortfolio_musicPlaying', 'true');
    });
    
    this.audio.addEventListener('pause', () => {
      if (this.musicStatus) this.musicStatus.textContent = 'Paused';
      if (this.musicToggle) {
        this.musicToggle.classList.remove('playing');
        this.musicToggle.textContent = "♫";
      }
      localStorage.setItem('pixelPortfolio_musicPlaying', 'false');
    });
    
    // Try to play music if not muted
    if (!this.isMuted) {
      document.addEventListener('click', () => {
        if (this.audio.paused) {
          this.play();
        }
      }, { once: true });
    }
  }
  
  play() {
    if (!this.audio || this.isMuted) return;
    
    this.audio.play().catch(err => {
      console.log("Could not auto-play audio:", err);
    });
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
    
    localStorage.setItem('pixelPortfolio_musicMuted', this.isMuted);
  }
  
  mute() {
    if (!this.audio) return;
    
    this.audio.pause();
    if (this.musicToggle) {
      this.musicToggle.classList.add('muted');
      this.musicToggle.classList.remove('playing');
      this.musicToggle.textContent = "♫";
    }
    if (this.musicStatus) this.musicStatus.textContent = 'Muted';
    this.isMuted = true;
  }
  
  unmute() {
    if (!this.audio) return;
    
    this.play();
    if (this.musicToggle) {
      this.musicToggle.classList.remove('muted');
    }
    this.isMuted = false;
  }
  
  changeVolume() {
    if (!this.audio || !this.volumeSlider) return;
    
    this.volume = this.volumeSlider.value / 100;
    this.audio.volume = this.volume;
    
    this.updateVolumeDisplay();
    localStorage.setItem('pixelPortfolio_musicVolume', this.volume);
  }
  
  updateVolumeDisplay() {
    if (!this.volumeValue) return;
    this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
  }
}

function adjustMusicPlayerPosition() {
  const audioPlayer = document.querySelector('.audio-player');
  if (!audioPlayer) return;
  
  // Check if we're on mobile
  if (window.innerWidth <= 480) {
    // Check if footer is in view
    const footer = document.querySelector('.game-controls');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      
      // If footer is visible in viewport
      if (footerRect.top < window.innerHeight) {
        audioPlayer.style.bottom = '70px'; // Push up to avoid overlapping footer
      } else {
        audioPlayer.style.bottom = '20px'; // Default position
      }
    }
  } else {
    audioPlayer.style.bottom = '20px'; // Default position on larger screens
  }
}
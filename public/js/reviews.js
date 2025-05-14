// Reviews and Discord Authentication System

class ReviewSystem {
  constructor() {
    this.clientId = '1333630246737412147'; // Ganti dengan Discord Client ID Anda
    this.redirectUri = encodeURIComponent(`${window.location.origin}/auth/discord/callback`);
    this.apiEndpoint = '/api/reviews';
    this.user = null;
    
    // DOM elements
    this.loginSection = document.getElementById('discord-login-section');
    this.reviewForm = document.getElementById('review-form-container');
    this.reviewsList = document.getElementById('reviews-list');
    this.loginButton = document.getElementById('discord-login');
    this.logoutButton = document.getElementById('discord-logout');
    this.ratingStars = document.querySelectorAll('.pixel-star');
    this.ratingInput = document.getElementById('rating');
    this.reviewMessage = document.getElementById('review-message');
    this.charCount = document.getElementById('char-count');
    
    this.init();
  }
  
  init() {
    // Check if user is logged in
    this.checkAuth();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load reviews
    this.loadReviews();
  }
  
  checkAuth() {
    // Check localStorage for auth token
    const authToken = localStorage.getItem('discordAuthToken');
    const userData = localStorage.getItem('discordUser');
    
    if (authToken && userData) {
      this.user = JSON.parse(userData);
      this.showUserProfile();
    } else {
      // Check for auth code in URL (after Discord redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        this.handleAuthCode(code);
      }
    }
  }
  
  setupEventListeners() {
    // Login button
    this.loginButton.addEventListener('click', () => this.loginWithDiscord());
    
    // Logout button
    this.logoutButton.addEventListener('click', () => this.logout());
    
    // Star rating
    this.ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        this.setRating(value);
      });
    });
    
    // Character counter
    this.reviewMessage.addEventListener('input', () => {
      const length = this.reviewMessage.value.length;
      this.charCount.textContent = length;
    });
    
    // Form submission
    document.getElementById('review-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitReview();
    });
  }
  
  loginWithDiscord() {
    // Construct Discord OAuth URL
    const scope = 'identify';
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${scope}`;
    
    // Open popup for Discord login
    const width = 500;
    const height = 750;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(authUrl, 'discordAuth', `width=${width},height=${height},top=${top},left=${left}`);
    
    // Use window message to receive the auth code
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'DISCORD_AUTH_SUCCESS') {
        this.handleAuthCode(event.data.code);
      }
    });
  }
  
  // Untuk tujuan demo, gunakan login manual - (Ganti dengan Discord OAuth di implementasi asli)
  async handleAuthCode(code) {
    try {
      // Simulasi login response (ganti dengan panggilan API sebenarnya)
      
      // Untuk tujuan demo, gunakan data contoh
      // Dalam implementasi sesungguhnya, gunakan code untuk mendapatkan token dari Discord API
      const demoUser = {
        id: '123456789',
        username: 'DemoUser',
        discriminator: '1234',
        avatar: null,
        token: 'demo_token_' + Math.random().toString(36).substring(2)
      };
      
      // Simpan di localStorage
      localStorage.setItem('discordAuthToken', demoUser.token);
      localStorage.setItem('discordUser', JSON.stringify(demoUser));
      
      this.user = demoUser;
      
      // Update UI
      this.showUserProfile();
      
      // Play sound
      if (window.playPixelSound) {
        window.playPixelSound('achievement');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Failed to authenticate with Discord. Please try again.');
    }
  }
  
  showUserProfile() {
    // Hide login section, show review form
    this.loginSection.classList.add('hidden');
    this.reviewForm.classList.remove('hidden');
    
    // Update user profile
    document.getElementById('user-avatar').src = this.user.avatar 
      ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
      : 'images/pixel-art/avatar.png'; // Fallback avatar
    
    document.getElementById('username').textContent = this.user.username;
    document.getElementById('user-tag').textContent = `#${this.user.discriminator}`;
  }
  
  logout() {
    // Clear localStorage
    localStorage.removeItem('discordAuthToken');
    localStorage.removeItem('discordUser');
    
    // Update UI
    this.loginSection.classList.remove('hidden');
    this.reviewForm.classList.add('hidden');
    
    this.user = null;
    
    // Reset form
    this.setRating(0);
    this.reviewMessage.value = '';
    this.charCount.textContent = '0';
    
    // Play sound
    if (window.playPixelSound) {
      window.playPixelSound('click');
    }
  }
  
  setRating(value) {
    this.ratingInput.value = value;
    
    // Update stars UI
    this.ratingStars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      if (starValue <= value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
    
    // Play sound
    if (window.playPixelSound) {
      window.playPixelSound('click');
    }
  }
  
  async loadReviews() {
    try {
      // Untuk tujuan demo, tampilkan review contoh
      // Dalam implementasi sesungguhnya, hubungkan ke API
      
      // Tambahkan delay simulasi untuk memberi kesan loading
      setTimeout(() => {
        // Demo reviews
        const demoReviews = [
          {
            id: 1,
            rating: 5,
            message: "Wow! Portfolio yang sangat kreatif dengan tema pixel art. Saya suka efek retro dan desainnya yang detail.",
            user: {
              id: "123456",
              username: "PixelFan",
              discriminator: "1234",
              avatar: null
            },
            createdAt: "2025-01-15T10:30:00"
          },
          {
            id: 2,
            rating: 4,
            message: "Website ini sangat keren! Animasi pixel art memberikan nuansa game retro yang nostalgic. Mini game nya juga menyenangkan!",
            user: {
              id: "234567",
              username: "RetroGamer",
              discriminator: "5678",
              avatar: null
            },
            createdAt: "2025-02-02T15:45:00"
          },
          {
            id: 3,
            rating: 5,
            message: "Saya terkesan dengan portofolio yang unik ini. Integrasi game dan desain website sangat menarik. Sangat menonjol dari portofolio developer lainnya!",
            user: {
              id: "345678",
              username: "WebDevPro",
              discriminator: "9012",
              avatar: null
            },
            createdAt: "2025-03-10T09:15:00"
          }
        ];
        
        this.renderReviews(demoReviews);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to load reviews:', error);
      this.reviewsList.innerHTML = `
        <div class="review-item">
          <div class="review-message">Failed to load reviews. Please try again later.</div>
        </div>
      `;
    }
  }
  
  renderReviews(reviews) {
    if (!reviews || reviews.length === 0) {
      this.reviewsList.innerHTML = `
        <div class="review-item">
          <div class="review-message">No reviews yet. Be the first to review!</div>
        </div>
      `;
      return;
    }
    
    this.reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
      const date = new Date(review.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Generate stars based on rating
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<span class="${i <= review.rating ? 'active' : ''}">★</span>`;
      }
      
      const reviewItem = document.createElement('div');
      reviewItem.className = 'review-item';
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <img src="${review.user.avatar 
              ? `https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}.png` 
              : 'images/pixel-art/avatar.png'}" 
              class="reviewer-avatar" alt="${review.user.username}">
            <div>
              <div class="reviewer-name">${review.user.username}</div>
              <div class="review-date">${formattedDate}</div>
            </div>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <div class="review-message">${this.escapeHTML(review.message)}</div>
      `;
      
      this.reviewsList.appendChild(reviewItem);
    });
  }
  
  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  async submitReview() {
    // Validate input
    const rating = parseInt(this.ratingInput.value);
    const message = this.reviewMessage.value.trim();
    
    if (rating < 1) {
      alert('Please select a rating');
      return;
    }
    
    if (!message) {
      alert('Please enter a review message');
      return;
    }
    
    try {
      // Untuk demonstrasi, simulasi submit sukses
      // Dalam implementasi sesungguhnya, kirim ke API
      
      alert('Thank you for your review! (Demo mode)');
      
      // Reset form
      this.setRating(0);
      this.reviewMessage.value = '';
      this.charCount.textContent = '0';
      
      // Reload reviews
      this.loadReviews();
      
      // Play achievement sound
      if (window.playPixelSound) {
        window.playPixelSound('achievement');
      }
      
      // Show achievement
      if (window.showAchievement) {
        window.showAchievement('Review Submitted!');
      }
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again later.');
    }
  }
}

// Initialize review system
document.addEventListener('DOMContentLoaded', () => {
  window.reviewSystem = new ReviewSystem();
});
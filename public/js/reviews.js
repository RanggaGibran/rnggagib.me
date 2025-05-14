// Human-like Review System

class ReviewSystem {
  constructor() {
    // DOM elements
    this.reviewsList = document.getElementById('reviews-list');
    this.reviewForm = document.getElementById('review-form');
    this.nameInput = document.getElementById('reviewer-name');
    this.roleInput = document.getElementById('reviewer-role');
    this.messageInput = document.getElementById('review-message');
    this.ratingStars = document.querySelectorAll('.pixel-star');
    this.ratingInput = document.getElementById('rating');
    this.charCount = document.getElementById('char-count');
    this.submitButton = document.getElementById('submit-review');
    
    // Initialize
    this.init();
  }
  
  init() {
    // Setup event listeners
    this.setupEventListeners();
    
    // Load reviews
    this.loadReviews();
    
    // Easter egg
    this.setupEasterEgg();
  }
  
  setupEventListeners() {
    // Rating stars
    this.ratingStars?.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        this.setRating(value);
      });
    });
    
    // Character counter
    this.messageInput?.addEventListener('input', () => {
      const length = this.messageInput.value.length;
      if (this.charCount) {
        this.charCount.textContent = length;
      }
      
      // Add typing sound effect
      if (length % 3 === 0 && window.playPixelSound) {
        window.playPixelSound('key', 0.1);
      }
    });
    
    // Form submission
    this.reviewForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitReview();
    });
  }
  
  setRating(value) {
    if (this.ratingInput) {
      this.ratingInput.value = value;
    }
    
    // Update stars UI
    this.ratingStars?.forEach(star => {
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
      if (!this.reviewsList) return;
      
      // Show loading animation
      this.reviewsList.innerHTML = `
        <div class="review-item loading">
          <div class="pixel-loading">
            <div class="pixel-loading-bar"></div>
            <span>Loading reviews...</span>
          </div>
        </div>
      `;
      
      // Demo reviews - humanized
      setTimeout(() => {
        const reviews = [
          {
            name: "Jane Cooper",
            role: "UI/UX Designer",
            company: "Figma",
            avatar: "images/pixel-art/avatar-1.png",
            rating: 5,
            message: "Rangga's portfolio is one of the most creative developer portfolios I've seen! The pixel art theme immediately caught my attention, and the interactive elements show real attention to detail.",
            date: "2025-02-15"
          },
          {
            name: "Alex Morgan",
            role: "Frontend Developer",
            company: "Spotify",
            avatar: "images/pixel-art/avatar-2.png",
            rating: 5,
            message: "Such a nostalgic and fun approach to showcasing skills! The easter eggs and mini-game are a perfect way to demonstrate both creativity and technical ability. This portfolio stands out from the usual templates.",
            date: "2025-03-02"
          },
          {
            name: "David Kim",
            role: "Tech Lead",
            company: "Google",
            avatar: "images/pixel-art/avatar-3.png", 
            rating: 4,
            message: "I love how the portfolio captures the retro gaming aesthetic while still feeling modern and responsive. The projects section demonstrates a great range of skills. Would definitely recommend for creative developer roles!",
            date: "2025-03-18"
          }
        ];
        
        this.renderReviews(reviews);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to load reviews:', error);
      if (this.reviewsList) {
        this.reviewsList.innerHTML = `
          <div class="review-item">
            <div class="review-message">Failed to load reviews. Please try again later.</div>
          </div>
        `;
      }
    }
  }
  
  renderReviews(reviews) {
    if (!this.reviewsList) return;
    
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
      const date = new Date(review.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Generate stars based on rating
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<span class="review-star ${i <= review.rating ? 'active' : ''}">${i <= review.rating ? '★' : '☆'}</span>`;
      }
      
      const reviewItem = document.createElement('div');
      reviewItem.className = 'review-card pixel-card';
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="reviewer">
            <div class="reviewer-avatar">
              <img src="${review.avatar || 'images/pixel-art/avatar.png'}" alt="${review.name}">
            </div>
            <div class="reviewer-info">
              <h4 class="reviewer-name">${this.escapeHTML(review.name)}</h4>
              <div class="reviewer-title">${this.escapeHTML(review.role)}${review.company ? ` at ${this.escapeHTML(review.company)}` : ''}</div>
              <div class="review-date">${formattedDate}</div>
            </div>
          </div>
          <div class="review-rating">
            ${stars}
          </div>
        </div>
        <div class="review-content">
          <p class="review-text">"${this.escapeHTML(review.message)}"</p>
        </div>
      `;
      
      this.reviewsList.appendChild(reviewItem);
      
      // Apply animation with delay
      setTimeout(() => {
        reviewItem.classList.add('appear');
      }, 100 * reviews.indexOf(review));
    });
  }
  
  submitReview() {
    // Validate form
    if (!this.nameInput || !this.messageInput || !this.ratingInput) return;
    
    const name = this.nameInput.value.trim();
    const role = this.roleInput?.value.trim() || '';
    const message = this.messageInput.value.trim();
    const rating = parseInt(this.ratingInput.value);
    
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    if (!message) {
      alert('Please enter your review');
      return;
    }
    
    if (isNaN(rating) || rating < 1) {
      alert('Please select a rating');
      return;
    }
    
    // For demo purposes, simulate adding a new review
    const newReview = {
      name,
      role,
      avatar: null,
      rating,
      message,
      date: new Date().toISOString()
    };
    
    // Play achievement sound
    if (window.playPixelSound) {
      window.playPixelSound('achievement');
    }
    
    // Show success message
    alert('Thank you for your review!');
    
    // Reset form
    this.nameInput.value = '';
    if (this.roleInput) this.roleInput.value = '';
    this.messageInput.value = '';
    this.setRating(0);
    
    // Reload reviews with new one added
    setTimeout(() => {
      this.loadReviews();
      
      // Show achievement notification
      if (window.showAchievement) {
        window.showAchievement('Review Submitted!', 'Thanks for sharing your feedback');
      }
    }, 500);
  }
  
  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  setupEasterEgg() {
    // Konami code easter egg
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
          this.activateEasterEgg();
          konamiPosition = 0;
        }
      } else {
        konamiPosition = 0;
      }
    });
  }
  
  activateEasterEgg() {
    // Add some fun pixel animation
    const reviewItems = document.querySelectorAll('.review-card');
    reviewItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('easter-egg');
        setTimeout(() => {
          item.classList.remove('easter-egg');
        }, 1000);
      }, index * 200);
    });
    
    if (window.playPixelSound) {
      window.playPixelSound('powerup');
    }
    
    if (window.showAchievement) {
      window.showAchievement('Konami Code Discovered!', 'You found a hidden easter egg');
    }
  }
}

// Initialize review system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.reviewSystem = new ReviewSystem();
});
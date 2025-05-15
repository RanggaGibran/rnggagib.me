// Human-like Review System with Improvements

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
    
    // Check if we have elements available
    if (!this.reviewsList) {
      console.warn('Reviews list element not found');
      return;
    }
    
    // Initialize
    this.init();
  }
  
  init() {
    console.log('Initializing review system...');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load reviews
    this.loadReviews();
    
    // Easter egg
    this.setupEasterEgg();
    
    // Load saved draft if exists
    this.loadDraft();
  }
  
  setupEventListeners() {
    // Rating stars
    this.ratingStars?.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        this.setRating(value);
      });
      
      // Add hover effect
      star.addEventListener('mouseenter', () => {
        const value = parseInt(star.getAttribute('data-value'));
        this.previewRating(value);
      });
      
      star.addEventListener('mouseleave', () => {
        const currentRating = parseInt(this.ratingInput?.value || 0);
        this.previewRating(currentRating);
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
      
      // Save draft
      this.saveDraft();
    });
    
    // Name input draft saving
    this.nameInput?.addEventListener('input', () => {
      this.saveDraft();
    });
    
    // Role input draft saving
    this.roleInput?.addEventListener('input', () => {
      this.saveDraft();
    });
    
    // Form submission
    this.reviewForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitReview();
    });
  }
  
  previewRating(value) {
    // Show preview of rating on hover
    this.ratingStars?.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      if (starValue <= value) {
        star.classList.add('preview');
      } else {
        star.classList.remove('preview');
      }
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
    
    // Save draft
    this.saveDraft();
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
      
      // Try to fetch reviews from API first
      let reviews;
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          
          // Map API response to our format
          reviews = data.map(review => ({
            name: review.user?.username || 'Anonymous',
            role: review.user?.role || '',
            company: review.user?.company || '',
            avatar: review.user?.avatar ? `https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}.png` : null,
            rating: review.rating,
            message: review.message,
            date: review.createdAt
          }));
        }
      } catch (error) {
        console.log('Could not load reviews from API, using fallback data');
      }
      
      // If API fetch failed, use fallback data
      if (!reviews) {
        // Demo reviews - humanized
        reviews = [
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
      }
      
      // Get local storage reviews
      const localReviews = this.getLocalReviews();
      
      // Combine API/fallback reviews with local reviews
      const allReviews = [...reviews, ...localReviews];
      
      // Sort by date (newest first)
      allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Render all reviews
      setTimeout(() => {
        this.renderReviews(allReviews);
      }, 800); // Show loading animation briefly for effect
      
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
      
      // Apply animation with delay for staggered effect
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
    
    // Try to send to API
    this.sendReviewToAPI(newReview)
      .catch(err => {
        console.log('Could not save to API, saving locally instead');
        this.saveLocalReview(newReview);
      })
      .finally(() => {
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
        
        // Clear draft
        this.clearDraft();
        
        // Reload reviews to include the new one
        setTimeout(() => {
          this.loadReviews();
          
          // Show achievement notification
          if (window.showAchievement) {
            window.showAchievement('Review Submitted!');
          }
        }, 500);
      });
  }
  
  async sendReviewToAPI(review) {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: review.rating,
          message: review.message,
          name: review.name,
          role: review.role
        })
      });
      
      if (!response.ok) {
        throw new Error('API error');
      }
      
      return await response.json();
    } catch (err) {
      throw err;
    }
  }
  
  saveLocalReview(review) {
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('pixelPortfolio_reviews') || '[]');
    
    // Add new review
    reviews.push(review);
    
    // Save back to localStorage
    localStorage.setItem('pixelPortfolio_reviews', JSON.stringify(reviews));
  }
  
  getLocalReviews() {
    return JSON.parse(localStorage.getItem('pixelPortfolio_reviews') || '[]');
  }
  
  saveDraft() {
    if (!this.nameInput || !this.messageInput || !this.ratingInput) return;
    
    const draft = {
      name: this.nameInput.value,
      role: this.roleInput?.value || '',
      message: this.messageInput.value,
      rating: this.ratingInput.value
    };
    
    localStorage.setItem('pixelPortfolio_reviewDraft', JSON.stringify(draft));
  }
  
  loadDraft() {
    const draftJson = localStorage.getItem('pixelPortfolio_reviewDraft');
    if (!draftJson) return;
    
    try {
      const draft = JSON.parse(draftJson);
      
      if (this.nameInput && draft.name) {
        this.nameInput.value = draft.name;
      }
      
      if (this.roleInput && draft.role) {
        this.roleInput.value = draft.role;
      }
      
      if (this.messageInput && draft.message) {
        this.messageInput.value = draft.message;
        if (this.charCount) {
          this.charCount.textContent = draft.message.length;
        }
      }
      
      if (draft.rating) {
        this.setRating(parseInt(draft.rating));
      }
    } catch (err) {
      console.error('Error loading review draft', err);
    }
  }
  
  clearDraft() {
    localStorage.removeItem('pixelPortfolio_reviewDraft');
  }
  
  escapeHTML(str) {
    if (!str) return '';
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
    
    // Add achievement for finding Easter egg
    localStorage.setItem('pixelPortfolio_konamiFound', 'true');
    
    if (window.playPixelSound) {
      window.playPixelSound('powerup');
    }
    
    if (window.showAchievement) {
      window.showAchievement('Konami Code Discovered!');
    }
  }
}

// Initialize review system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing review system');
  window.reviewSystem = new ReviewSystem();
});
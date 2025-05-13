// Shared functions for all pages

// Function to include HTML files
async function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  
  for (const element of includes) {
    const filePath = element.getAttribute('data-include');
    
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Error loading ${filePath}: ${response.status}`);
      
      const text = await response.text();
      element.innerHTML = text;
      element.removeAttribute('data-include');
      
      // Process any nested includes
      const nestedIncludes = element.querySelectorAll('[data-include]');
      if (nestedIncludes.length > 0) {
        await includeHTML();
      }
    } catch (error) {
      console.error(error);
      element.innerHTML = `<p>Error loading ${filePath}</p>`;
    }
  }
  
  // Initialize coin count from localStorage
  window.coinCount = parseInt(localStorage.getItem('pixelPortfolioCoinCount')) || 0;
  updateCoinCounter();
  
  // Call any initialization functions that might depend on the included HTML
  initializeAfterInclude();
}

// Initialize elements after HTML is included
function initializeAfterInclude() {
  // Add active class to current page menu item
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    if (item.getAttribute('data-page') === currentPage) {
      item.classList.add('active');
    }
  });
  
  // Check for game unlock
  checkGameUnlock();
  
  // Initialize skill bars animation
  initSkillBars();
  
  // Initialize animations for the current page
  if (currentPage === 'projects.html') {
    setTimeout(animateProjectItems, 500);
  }
}

// Update coin counter display
function updateCoinCounter() {
  const coinCounter = document.getElementById('coin-counter');
  if (coinCounter) {
    coinCounter.textContent = window.coinCount;
  }
}

// Check for game unlock
function checkGameUnlock() {
  const gameMenuItem = document.querySelector('.menu-item[data-page="game.html"]');
  if (gameMenuItem) {
    if (window.coinCount >= 25) {
      gameMenuItem.classList.remove('hidden-item');
      
      // Show achievement if first time unlocking
      const gameUnlocked = localStorage.getItem('gameUnlocked');
      if (!gameUnlocked) {
        localStorage.setItem('gameUnlocked', 'true');
        if (window.showAchievement) {
          window.showAchievement('MINI-GAME UNLOCKED!');
        }
      }
    }
  }
}

// Initialize skill bars with animation
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    bar.style.width = '0%';
    
    // Animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            bar.style.width = `${level}%`;
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(bar);
  });
}

// Project items animation
function animateProjectItems() {
  const projectItems = document.querySelectorAll('.project-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  projectItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', includeHTML);
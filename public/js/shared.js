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
  
  if (!skillBars.length) {
    console.log('No skill bars found in the DOM');
    return;
  }
  
  console.log(`Found ${skillBars.length} skill bars`);
  
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level') || '0';
    // Reset bar width to ensure animation works
    if (bar.style) {
      bar.style.setProperty('--skill-level', '0%');
    }
    
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
      // Create a colored bar inside the skill bar
      if (!bar.querySelector('.skill-fill')) {
        const fillBar = document.createElement('div');
        fillBar.className = 'skill-fill';
        fillBar.style.width = '0%';
        fillBar.style.height = '100%';
        fillBar.style.backgroundColor = 'var(--pixel-green)';
        fillBar.style.position = 'absolute';
        fillBar.style.left = '0';
        fillBar.style.top = '0';
        fillBar.style.transition = 'width 1s ease-out';
        bar.appendChild(fillBar);
        
        // Add a delay before animating
        setTimeout(() => {
          fillBar.style.width = `${level}%`;
        }, 300);
      } else {
        // Just update existing fill bar
        const fillBar = bar.querySelector('.skill-fill');
        setTimeout(() => {
          fillBar.style.width = `${level}%`;
        }, 300);
      }
    });
  });
  
  // Fallback untuk browser tanpa IntersectionObserver
  setTimeout(() => {
    skillBars.forEach(bar => {
      if (bar.querySelector('.skill-fill')?.style.width === '0%') {
        const level = bar.getAttribute('data-level') || '0';
        const fillBar = bar.querySelector('.skill-fill') || bar;
        fillBar.style.width = `${level}%`;
      }
    });
  }, 1000);
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
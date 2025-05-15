document.addEventListener('DOMContentLoaded', () => {
  // Initialize typewriter and other components
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'index.html' || currentPage === '') {
    initializeTypewriter();
  }
  
  // Rest of your initialization code...
  initializePixelSounds();
  initializeCoins();
  createStars();
  
  // Set up URL routing
  setupRouting();
  
  // Pastikan skill bars diinisialisasi pada halaman skills
  const currentPath = window.location.pathname;
  
  // Jika kita berada di halaman skills, inisialisasi skill bar
  if (currentPath.includes('skills') || document.getElementById('skills')) {
    console.log('Skills page detected, initializing skill bars');
    // Panggil initSkillBars dengan delay singkat untuk memastikan DOM telah dimuat
    setTimeout(() => {
      if (typeof initSkillBars === 'function') {
        initSkillBars();
      } else if (typeof window.initSkillBars === 'function') {
        window.initSkillBars();
      } else {
        console.error('initSkillBars function not found');
      }
    }, 500);
  }
  
  // Inisialisasi review system jika berada di halaman reviews
  if (currentPath.includes('review') || document.getElementById('review')) {
    // Load review system script if not loaded
    if (!window.reviewSystem && typeof ReviewSystem === 'undefined') {
      const script = document.createElement('script');
      script.src = 'js/reviews.js';
      script.onload = function() {
        window.reviewSystem = new ReviewSystem();
      };
      document.head.appendChild(script);
    } else if (typeof ReviewSystem !== 'undefined') {
      window.reviewSystem = new ReviewSystem();
    }
  }
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const menuItems = document.querySelector('.menu-items');

  if (menuToggle && menuItems) {
    menuToggle.addEventListener('click', () => {
      menuItems.classList.toggle('active');
      
      // Animate the toggle button
      if (menuItems.classList.contains('active')) {
        menuToggle.textContent = '×';
        menuToggle.style.transform = 'rotate(90deg)';
      } else {
        menuToggle.textContent = '≡';
        menuToggle.style.transform = 'none';
      }
      
      // Add sound effect
      if (window.playPixelSound) {
        window.playPixelSound('click');
      }
    });
    
    // Close menu when clicking on a menu item
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          menuItems.classList.remove('active');
          menuToggle.textContent = '≡';
          menuToggle.style.transform = 'none';
        }
      });
    });
  }

  // Dropdown functionality for mobile
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Only apply this behavior on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        const parent = trigger.closest('.dropdown-parent');
        parent.classList.toggle('active');
        
        // Play sound
        if (window.playPixelSound) {
          window.playPixelSound('click');
        }
      }
    });
  });
  
  // Highlight active menu item based on URL
  const highlightActiveMenu = () => {
    const currentPath = window.location.pathname;
    const sectionId = currentPath.replace(/^\/|\/$/g, '') || 'home';
    
    // Clear active state from all menu items
    document.querySelectorAll('.menu-item, .dropdown-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Set active state for main menu items
    document.querySelectorAll(`.menu-item[data-section="${sectionId}"]`).forEach(item => {
      item.classList.add('active');
    });
    
    // Set active state for dropdown items
    document.querySelectorAll(`.dropdown-item[data-section="${sectionId}"]`).forEach(item => {
      item.classList.add('active');
      const parent = item.closest('.dropdown-parent');
      if (parent) parent.classList.add('active');
    });
  };
  
  // Call immediately and on page change
  highlightActiveMenu();
  
  // Add pixel sparkle animations to special items
  document.querySelectorAll('.pixel-special').forEach(item => {
    const sparkle = item.querySelector('.pixel-sparkle');
    if (!sparkle) return;
    
    item.addEventListener('mouseenter', () => {
      sparkle.style.animation = 'none';
      setTimeout(() => {
        sparkle.style.animation = 'sparkle 2s infinite';
      }, 10);
    });
  });

  // Mobile dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // Only apply this behavior on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = toggle.closest('.has-dropdown');
        parent.classList.toggle('active');
        
        // Play sound
        if (window.playPixelSound) {
          window.playPixelSound('click');
        }
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menuItems && menuItems.classList.contains('active')) {
      if (!e.target.closest('.game-menu')) {
        menuItems.classList.remove('active');
      }
    }
  });

  // Tambahkan event listeners untuk menu item dengan data-page
  document.querySelectorAll('.menu-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      
      // Fix: Format URL agar konsisten tanpa .html
      if (page) {
        // Perbaikan: Gunakan URL tanpa .html
        const targetUrl = page === 'index' ? '/' : `/${page}`;
        
        // Add transition effect if available
        if (window.loadingScreen && window.loadingScreen.showTransition) {
          window.loadingScreen.showTransition(300).then(() => {
            window.location.href = targetUrl;
          });
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });
  
  // Pastikan event listener untuk navigasi semuanya menggunakan format yang sama
  const navLinks = document.querySelectorAll('.menu-item[data-section]');
  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      if (sectionId) {
        await navigateToSection(sectionId);
      }
    });
  });

  // Handle dropdown item clicks
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering parent click handlers
      
      const page = item.getAttribute('data-page');
      if (page) {
        // Format URL consistently
        const targetUrl = page === 'index' ? '/' : `/${page}`;
        
        // Show transition effect if available
        if (window.loadingScreen && window.loadingScreen.showTransition) {
          window.loadingScreen.showTransition(300).then(() => {
            window.location.href = targetUrl;
          });
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  });

  // Ensure dropdowns never overflow viewport
  function fixDropdownPositions() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    
    dropdowns.forEach(dropdown => {
      const rect = dropdown.getBoundingClientRect();
      const parentRect = dropdown.parentElement.getBoundingClientRect();
      
      // Check if dropdown overflows right edge of viewport
      if (rect.right > window.innerWidth) {
        dropdown.style.left = 'auto';
        dropdown.style.right = '0';
        dropdown.style.transform = 'translateX(0)';
        
        // Reposition dropdown arrow
        const arrow = dropdown.querySelector(':before');
        if (arrow) {
          arrow.style.left = `${parentRect.width / 2}px`;
          arrow.style.transform = 'translateX(0)';
        }
      }
    });
  }

  // Call once on load and then on window resize
  window.addEventListener('resize', fixDropdownPositions);
  setTimeout(fixDropdownPositions, 100);
});

// Handle active state for dropdown parent when child is active
document.addEventListener('DOMContentLoaded', () => {
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Check if a dropdown item is active
  dropdownItems.forEach(item => {
    if (item.getAttribute('data-page') === currentPage.replace('.html', '')) {
      // Make dropdown parent active too
      const parentDropdown = item.closest('.has-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
      item.classList.add('active');
    }
  });
});

// Handle URL routing dan navigation
function setupRouting() {
  // Parse initial URL when page loads
  const path = window.location.pathname.replace(/\/$/, '') || '/index';
  const sectionId = path.split('/').pop().replace('.html', '');
  
  // Activate correct section based on URL
  if (sectionId && sectionId !== 'index') {
    showSection(sectionId);
  } else {
    showSection('home');
  }
  
  // Set up navigation click handlers
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      navigateToSection(targetSection);
    });
  });
  
  // CTA button navigation
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSection = ctaButton.getAttribute('data-target') || 'projects';
      navigateToSection(targetSection.replace('.html', ''));
    });
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (state && state.section) {
      showSection(state.section, false); // Don't push state again
    }
  });
}

// Navigate to a section with URL update
async function navigateToSection(sectionId) {
  // Show transition effect
  if (window.loadingScreen) {
    await window.loadingScreen.showTransition(300);
  }
  
  // Update URL without reload
  const newUrl = sectionId === 'home' ? '/' : `/${sectionId}`;
  history.pushState({ section: sectionId }, '', newUrl);
  
  // Hide all sections first with opacity transition
  const sections = document.querySelectorAll('.game-level');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.classList.remove('active');
  });
  
  // Show the selected section with fade-in effect
  setTimeout(() => {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.opacity = '1';
      
      // Initialize section-specific functionality
      if (sectionId === 'projects') {
        animateProjectItems();
      } else if (sectionId === 'skills') {
        window.initSkillBars();
      } else if (sectionId === 'about') {
        initCharacterAttributes();
      }
    }
    
    // Update active menu item
    updateActiveMenuItem(sectionId);
    
    // Also update dropdown items and parents
    updateDropdownActiveState(sectionId);
  }, 100);
  
  // Add sound effect
  if (window.playPixelSound) {
    window.playPixelSound('click');
  }
}

// Show a specific section
function showSection(sectionId) {
  const sections = document.querySelectorAll('.game-level');
  
  // Hide all sections
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Update active menu item
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    }
  });
  
  // Show the selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Initialize section-specific functionality
    if (sectionId === 'projects') {
      animateProjectItems();
    } else if (sectionId === 'skills') {
      // Panggil fungsi global
      window.initSkillBars();
    } else if (sectionId === 'about') {
      // Initialize character attributes
      initCharacterAttributes();
    }
  }
}

/**
 * Update the active menu item based on the current section
 * @param {string} sectionId - The ID of the current section
 */
function updateActiveMenuItem(sectionId) {
  // Remove active class from all menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to the appropriate menu item
  const activeItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

// Update dropdown active state
function updateDropdownActiveState(sectionId) {
  // Reset all dropdown parents and items
  document.querySelectorAll('.has-dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
  
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
      const parentDropdown = item.closest('.has-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
    }
  });
}

// Animation for project items
function animateProjectItems() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

// Initialize skill bars - global function
window.initSkillBars = function() {
  console.log('Global initSkillBars called');
  const skillBars = document.querySelectorAll('.skill-bar');
  
  if (!skillBars.length) {
    console.log('No skill bars found in the DOM');
    return;
  }
  
  console.log(`Found ${skillBars.length} skill bars`);
  
  skillBars.forEach((bar, index) => {
    const level = bar.getAttribute('data-level');
    
    // Reset skill bar style
    bar.style.width = '100%';
    
    // Create or update fill bar
    let fillBar = bar.querySelector('.skill-fill');
    if (!fillBar) {
      fillBar = document.createElement('div');
      fillBar.className = 'skill-fill';
      fillBar.style.width = '0';
      fillBar.style.height = '100%';
      fillBar.style.backgroundColor = 'var(--pixel-green)';
      fillBar.style.position = 'absolute';
      fillBar.style.left = '0';
      fillBar.style.top = '0';
      fillBar.style.transition = 'width 1s ease-out';
      bar.appendChild(fillBar);
    } else {
      fillBar.style.width = '0';
    }
    
    // Animate the skill bar with delay
    setTimeout(() => {
      fillBar.style.width = `${level}%`;
    }, 100 * index);
  });
};

// Add floating coins as decorative elements
function addCoins() {
  const gameScreen = document.querySelector('.game-screen');
  
  // Add some coins to the active section
  const activeSection = document.querySelector('.game-level.active');
  if (!activeSection) return;
  
  for (let i = 0; i < 5; i++) {
    const coin = document.createElement('div');
    coin.className = 'game-coin';
    
    // Random position
    const randomX = Math.floor(Math.random() * (gameScreen.clientWidth - 50));
    const randomY = Math.floor(Math.random() * (gameScreen.clientHeight - 50));
    
    coin.style.left = `${randomX}px`;
    coin.style.top = `${randomY}px`;
    
    activeSection.appendChild(coin);
    
    // Make coins collectible
    coin.addEventListener('click', () => {
      playPixelSound('coin');
      coin.style.animation = 'none';
      coin.style.transform = 'scale(1.5)';
      coin.style.opacity = '0';
      
      // Increment coin count
      incrementCoins();
      
      setTimeout(() => {
        if (activeSection.contains(coin)) {
          activeSection.removeChild(coin);
        }
      }, 300);
    });
    
    // Remove coin after animation
    setTimeout(() => {
      if (activeSection.contains(coin)) {
        activeSection.removeChild(coin);
      }
    }, 5000);
  }
}

// Create stars in the background
function createStars() {
  const starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) return;
  
  // Clear existing stars
  starsContainer.innerHTML = '';
  
  // Add stars
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position and delay
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
  }
}

// Add achievement notification
function showAchievement(text) {
  // Remove any existing achievement
  const existingAchievement = document.querySelector('.achievement');
  if (existingAchievement) {
    document.body.removeChild(existingAchievement);
  }
  
  const achievement = document.createElement('div');
  achievement.className = 'achievement';
  
  const icon = document.createElement('div');
  icon.className = 'achievement-icon';
  
  const message = document.createElement('div');
  message.textContent = text;
  message.className = 'achievement-text';
  
  achievement.appendChild(icon);
  achievement.appendChild(message);
  
  document.body.appendChild(achievement);
  
  playPixelSound('achievement');
  
  // Remove after animation
  setTimeout(() => {
    if (document.body.contains(achievement)) {
      document.body.removeChild(achievement);
    }
  }, 4000);
}

// Coin counter system
let coinCount = 0;
function incrementCoins() {
  coinCount++;
  localStorage.setItem('pixelPortfolioCoins', coinCount);
  
  // Check for achievements
  if (coinCount === 10) {
    showAchievement('COIN COLLECTOR: 10 COINS!');
  } else if (coinCount === 25) {
    showAchievement('TREASURE HUNTER: 25 COINS!');
  } else if (coinCount === 50) {
    showAchievement('PIXEL MILLIONAIRE: 50 COINS!');
  }
}

// Load coins from storage
function loadCoins() {
  const savedCoins = localStorage.getItem('pixelPortfolioCoins');
  if (savedCoins) {
    coinCount = parseInt(savedCoins);
  }
}

// Add coins periodically
setInterval(addCoins, 10000);

// Add initial stars and coins
setTimeout(addCoins, 1000);
loadCoins();

// Check for coin count to unlock game section
function checkGameUnlock() {
  const gameMenuItem = document.querySelector('.menu-item[data-section="game"]');
  if (gameMenuItem) {
    if (coinCount >= 25) {
      gameMenuItem.classList.remove('hidden-item');
      
      // Show achievement if first time unlocking
      const gameUnlocked = localStorage.getItem('gameUnlocked');
      if (!gameUnlocked) {
        localStorage.setItem('gameUnlocked', 'true');
        showAchievement('MINI-GAME UNLOCKED!');
      }
    }
  }
}

// Check on load and when coins change
checkGameUnlock();
const originalIncrementCoins = incrementCoins;
incrementCoins = function() {
  originalIncrementCoins.apply(this, arguments);
  checkGameUnlock();
};

// Typewriter initialization
function initializeTypewriter() {
  const typewriterElem = document.querySelector('.typewriter');
  
  if (typewriterElem) {
    // Clear any existing animations
    if (window.typewriterInterval) {
      clearInterval(window.typewriterInterval);
    }
    
    // Set up new enhanced typewriter
    const text = "I build awesome web experiences";
    typewriterElem.innerHTML = ''; // Clear existing content
    
    // Create the cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.innerHTML = '█';
    
    // Add the cursor
    typewriterElem.appendChild(cursor);
    
    // Split text into words for word-level effects
    const words = text.split(' ');
    let charIndex = 0;
    let wordIndex = 0;
    let currentWord = '';
    
    // Add all words with spans but make them invisible
    words.forEach((word, idx) => {
      const wordContainer = document.createElement('span');
      wordContainer.className = 'word';
      wordContainer.style.opacity = '0';
      wordContainer.style.position = 'relative';
      
      // Special styling for key words
      if (word === 'awesome') {
        wordContainer.classList.add('highlight-word');
      }
      
      // Add each character of the word
      word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.className = 'char';
        charSpan.style.opacity = '0';
        charSpan.style.position = 'relative';
        wordContainer.appendChild(charSpan);
      });
      
      // Add space after word (except last word)
      if (idx < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.opacity = '0';
        wordContainer.appendChild(space);
      }
      
      // Insert before cursor
      typewriterElem.insertBefore(wordContainer, cursor);
    });
    
    // Get all character spans
    const charSpans = typewriterElem.querySelectorAll('.char');
    const wordSpans = typewriterElem.querySelectorAll('.word');
    
    // Typing animation function with variable speed
    const typeNextChar = () => {
      if (charIndex < charSpans.length) {
        const currentChar = charSpans[charIndex];
        currentChar.style.opacity = '1';
        
        // Add special effects randomly
        if (Math.random() < 0.1) {
          // Glitch effect on random chars
          applyGlitchEffect(currentChar);
        }
        
        // Rise up animation
        currentChar.style.animation = 'char-rise 0.2s forwards';
        
        // Move to next character
        charIndex++;
        
        // Make word visible when all its characters are typed
        const parentWord = currentChar.parentNode;
        const wordChars = parentWord.querySelectorAll('.char');
        const allCharsVisible = Array.from(wordChars).every(char => char.style.opacity === '1');
        
        if (allCharsVisible) {
          parentWord.style.opacity = '1';
          const space = parentWord.querySelector('span:not(.char)');
          if (space) space.style.opacity = '1';
          
          // Apply word completion effect
          parentWord.classList.add('word-complete');
          playPixelSound('click');
        }
        
        // Variable speed typing
        const randomDelay = 70 + Math.random() * 60;
        setTimeout(typeNextChar, randomDelay);
      } else {
        // Typing complete, add completion effects
        typewriterElem.classList.add('typing-complete');
        playPixelSound('success');
        
        // Add replay button after delay
        setTimeout(() => {
          addReplayButton(typewriterElem);
        }, 1500);
      }
    };
    
    // Function to start typewriter animation
    const startTypewriter = () => {
      // Small delay before starting
      setTimeout(() => {
        typeNextChar();
      }, 500);
    };
    
    // Wait for loading screen to complete
    document.addEventListener('loadingComplete', startTypewriter);
    
    // Safety timeout
    setTimeout(() => {
      if (typewriterElem.querySelectorAll('.char[style*="opacity: 1"]').length === 0) {
        document.dispatchEvent(new CustomEvent('loadingComplete'));
      }
    }, 8000);
    
    // Apply glitch effect to a character
    function applyGlitchEffect(charElement) {
      charElement.classList.add('glitch');
      
      setTimeout(() => {
        charElement.classList.remove('glitch');
      }, 300);
    }
    
    // Add replay button
    function addReplayButton(container) {
      const replayBtn = document.createElement('span');
      replayBtn.className = 'typewriter-replay';
      replayBtn.innerHTML = '⟲';
      replayBtn.title = 'Replay animation';
      
      replayBtn.addEventListener('click', () => {
        // Restart the animation
        charSpans.forEach(span => {
          span.style.opacity = '0';
          span.style.animation = '';
        });
        wordSpans.forEach(span => {
          span.style.opacity = '0';
          span.classList.remove('word-complete');
        });
        
        charIndex = 0;
        setTimeout(typeNextChar, 300);
        replayBtn.remove();
        playPixelSound('start');
      });
      
      // Insert after container
      container.parentNode.insertBefore(replayBtn, container.nextSibling);
    }
  }
}

// Initialize sound effects
function initializePixelSounds() {
  // Your sound initialization code...
}

// Initialize coins
function initializeCoins() {
  // Your coin initialization code...
}

// Global functions
window.playPixelSound = function(type) {
  // Your sound playing code...
};

// Definisikan fungsi updateCoinCounter yang hilang
function updateCoinCounter() {
  const coinCounter = document.getElementById('coin-counter');
  if (coinCounter) {
    coinCounter.textContent = window.coinCount || 0;
  }
}

// Modifikasi fungsi incrementCoins agar lebih handal
window.incrementCoins = function() {
  window.coinCount = (window.coinCount || 0) + 1;
  localStorage.setItem('pixelPortfolioCoinCount', window.coinCount);
  
  // Safety check untuk updateCoinCounter
  if (typeof updateCoinCounter === 'function') {
    updateCoinCounter();
  }
  
  // Jika ada fungsi checkGameUnlock, panggil
  if (typeof checkGameUnlock === 'function') {
    checkGameUnlock();
  }
};

window.showAchievement = function(message) {
  // Your achievement code...
};

// Initialize character attributes
function initCharacterAttributes() {
  const attributeBars = document.querySelectorAll('.attribute-bar');
  
  attributeBars.forEach((bar, index) => {
    const value = bar.getAttribute('data-value');
    
    // Animate the attribute bar with delay
    setTimeout(() => {
      bar.style.width = `${value}%`;
    }, 200 * index);
  });
  
  // Add hovering effect to achievement badges
  const badges = document.querySelectorAll('.achievement-badge');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      if (!badge.classList.contains('locked') && window.playPixelSound) {
        window.playPixelSound('click');
      }
    });
  });
}

// Certificate popup handler
document.addEventListener('DOMContentLoaded', () => {
  const certificateBadge = document.querySelector('.achievement-badge.certificate');
  const certificatePopup = document.getElementById('certificate-popup');
  const closeBtn = document.querySelector('.close-certificate');
  
  if (certificateBadge && certificatePopup) {
    certificateBadge.addEventListener('click', () => {
      certificatePopup.classList.add('active');
      
      // Add sound effect
      if (window.playPixelSound) {
        window.playPixelSound('achievement');
      }
    });
    
    closeBtn.addEventListener('click', () => {
      certificatePopup.classList.remove('active');
      
      // Add sound effect
      if (window.playPixelSound) {
        window.playPixelSound('click');
      }
    });
    
    // Close when clicking outside
    certificatePopup.addEventListener('click', (e) => {
      if (e.target === certificatePopup) {
        certificatePopup.classList.remove('active');
      }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certificatePopup.classList.contains('active')) {
        certificatePopup.classList.remove('active');
      }
    });
  }
});

// Certificate functions
function openCertificate(pdfPath) {
  const modal = document.getElementById('certificate-modal');
  const frame = document.getElementById('certificate-frame');
  if (modal && frame) {
    frame.src = pdfPath;
    modal.classList.add('active');
    
    // Play sound effect
    if (window.playPixelSound) {
      window.playPixelSound('click');
    }
  }
}

function closeCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  const frame = document.getElementById('certificate-frame');
  if (modal && frame) {
    modal.classList.remove('active');
    setTimeout(() => {
      frame.src = "";
    }, 300);
    
    // Play sound effect
    if (window.playPixelSound) {
      window.playPixelSound('click');
    }
  }
}

// Add these functions to window object
window.openCertificate = openCertificate;
window.closeCertificateModal = closeCertificateModal;

// Close certificate modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertificateModal();
  }
});

// Close certificate modal when clicking outside
document.getElementById('certificate-modal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('certificate-modal')) {
    closeCertificateModal();
  }
});
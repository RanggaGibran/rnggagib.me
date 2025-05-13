document.addEventListener('DOMContentLoaded', () => {
  // Initialize typewriter only on homepage
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'index.html') {
    initializeTypewriter();
  }
  
  // Rest of your initialization code...
  initializePixelSounds();
  initializeCoins();
  createStars();

  // Navigation
  const menuItems = document.querySelectorAll('.menu-item');
  const sections = document.querySelectorAll('.game-level');
  
  // Handle navigation clicks
  menuItems.forEach(item => {
    item.addEventListener('click', async () => {
      const targetSection = item.getAttribute('data-section');
      
      // Show transition effect
      if (window.loadingScreen) {
        await window.loadingScreen.showTransition(400);
      }
      
      // Hide all sections
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Show the selected section
      document.getElementById(targetSection).classList.add('active');
      
      // Add pixel sound effect
      playPixelSound('click');
      
      // Show section change achievement
      showAchievement(`${targetSection.toUpperCase()} LEVEL UNLOCKED!`);
    });
  });
  
  // CTA Button action
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', async () => {
      // Show transition effect
      if (window.loadingScreen) {
        await window.loadingScreen.showTransition(400);
      }
      
      // Hide all sections
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Show projects section
      document.getElementById('projects').classList.add('active');
      
      // Add pixel sound effect
      playPixelSound('start');
      
      // Show achievement
      showAchievement('ADVENTURE STARTED!');
    });
  }
  
  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Here you would normally send this data to your server
      // For now we'll just log it and show a success message
      console.log({name, email, message});
      
      // Play success sound
      playPixelSound('success');
      
      // Show success message
      const formFields = contactForm.querySelectorAll('.form-field');
      formFields.forEach(field => field.style.display = 'none');
      
      const button = contactForm.querySelector('.pixel-button');
      button.style.display = 'none';
      
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.innerHTML = 'MESSAGE SENT SUCCESSFULLY!<br>I\'LL GET BACK TO YOU SOON.';
      successMsg.style.textAlign = 'center';
      successMsg.style.padding = '20px';
      successMsg.style.color = 'var(--pixel-green)';
      
      contactForm.appendChild(successMsg);
      
      // Show achievement
      showAchievement('MESSAGE DELIVERED!');
      
      // Reset form after 5 seconds
      setTimeout(() => {
        formFields.forEach(field => field.style.display = 'block');
        button.style.display = 'inline-block';
        contactForm.removeChild(successMsg);
        contactForm.reset();
      }, 5000);
    });
  }
  
  // Initialize skill bars
  const skillBars = document.querySelectorAll('.skill-bar');
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    bar.style.setProperty('--width', `${level}%`);
  });

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
    message.className = 'achievement-text';
    message.textContent = text;
    
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

  // Animate project items when they come into view
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

  // Call the function when projects section becomes active
  menuItems.forEach(item => {
    if (item.getAttribute('data-section') === 'projects') {
      item.addEventListener('click', () => {
        setTimeout(animateProjectItems, 500);
      });
    }
  });

  // Also animate on page load if projects is the active section
  if (document.querySelector('#projects.active')) {
    setTimeout(animateProjectItems, 500);
  }
});

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

window.incrementCoins = function() {
  window.coinCount = (window.coinCount || 0) + 1;
  localStorage.setItem('pixelPortfolioCoinCount', window.coinCount);
  updateCoinCounter();
  checkGameUnlock();
};

window.showAchievement = function(message) {
  // Your achievement code...
};
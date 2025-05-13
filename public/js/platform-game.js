class PlatformGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Game state
    this.gameStarted = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.imagesLoaded = false;
    this.imageLoadCount = 0;
    this.totalImages = 5; // player, platform, coin, enemy, background
    
    // Game stats
    this.score = 0;
    this.lives = 3;
    
    // Player
    this.player = {
      x: 50,
      y: 300,
      width: 24,
      height: 24,
      speed: 5,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false,
      frameX: 0,
      facingRight: true
    };
    
    // Game physics
    this.gravity = 0.5;
    this.friction = 0.8;
    
    // Controls
    this.keys = {};
    
    // Game elements
    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    
    // Sprites
    this.sprites = {
      player: new Image(),
      platform: new Image(),
      coin: new Image(),
      enemy: new Image(),
      background: new Image()
    };
    
    // Initialize
    this.loadSprites();
    this.setupEventListeners();
    this.setupLevel();
  }
  
  loadSprites() {
    // Menambahkan event listener onload untuk menghitung jumlah gambar yang sudah dimuat
    const addLoadListener = (img, src) => {
      img.onload = () => {
        this.imageLoadCount++;
        console.log(`Loaded image: ${src} (${this.imageLoadCount}/${this.totalImages})`);
        if (this.imageLoadCount === this.totalImages) {
          this.imagesLoaded = true;
          console.log('All images loaded successfully');
        }
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
      
      img.src = src;
    };
    
    addLoadListener(this.sprites.player, 'images/pixel-art/player.png');
    addLoadListener(this.sprites.platform, 'images/pixel-art/platform.png');
    addLoadListener(this.sprites.coin, 'images/pixel-art/coin.png');
    addLoadListener(this.sprites.enemy, 'images/pixel-art/enemy.png');
    addLoadListener(this.sprites.background, 'images/pixel-art/game-bg.png');
  }
  
  setupEventListeners() {
    // Key events
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
    
    // Start button
    document.getElementById('start-game').addEventListener('click', () => {
      this.startGame();
    });
  }
  
  startGame() {
    if (this.gameStarted) return;
    
    // Cek apakah semua gambar sudah dimuat
    if (!this.imagesLoaded) {
      console.log('Waiting for images to load...');
      document.getElementById('start-game').textContent = 'LOADING...';
      setTimeout(() => this.startGame(), 500);
      return;
    }
    
    this.gameStarted = true;
    this.gameOver = false;
    this.levelComplete = false;
    this.score = 0;
    this.lives = 3;
    this.setupLevel();
    
    // Hide start button
    document.getElementById('start-game').style.display = 'none';
    
    // Update score and lives display
    document.getElementById('game-score').textContent = this.score;
    document.getElementById('game-lives').textContent = this.lives;
    
    // Start game loop
    this.gameLoop();
  }
  
  restartGame() {
    this.player.x = 50;
    this.player.y = 300;
    this.player.velX = 0;
    this.player.velY = 0;
    
    document.getElementById('start-game').style.display = 'block';
    
    // Hide game over and level complete screens
    const gameOverScreen = document.querySelector('.game-over-screen');
    const levelCompleteScreen = document.querySelector('.level-complete-screen');
    
    if (gameOverScreen) gameOverScreen.style.display = 'none';
    if (levelCompleteScreen) levelCompleteScreen.style.display = 'none';
    
    this.gameStarted = false;
  }
  
  setupLevel() {
    // Reset game elements
    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    
    // Create platforms
    this.platforms = [
      { x: 0, y: 350, width: 800, height: 50 },  // Ground
      { x: 100, y: 280, width: 100, height: 20 },
      { x: 300, y: 280, width: 100, height: 20 },
      { x: 500, y: 280, width: 100, height: 20 },
      { x: 200, y: 200, width: 100, height: 20 },
      { x: 400, y: 200, width: 100, height: 20 },
      { x: 600, y: 200, width: 100, height: 20 },
      { x: 100, y: 120, width: 100, height: 20 },
      { x: 300, y: 120, width: 100, height: 20 },
      { x: 500, y: 120, width: 100, height: 20 }
    ];
    
    // Create coins
    this.coins = [
      { x: 130, y: 250, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 330, y: 250, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 530, y: 250, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 230, y: 170, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 430, y: 170, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 630, y: 170, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 130, y: 90, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 330, y: 90, width: 24, height: 24, collected: false, frameX: 0 },
      { x: 530, y: 90, width: 24, height: 24, collected: false, frameX: 0 }
    ];
    
    // Create enemies
    this.enemies = [
      { x: 150, y: 250, width: 24, height: 24, speed: 1, direction: 1, frameX: 0 },
      { x: 400, y: 170, width: 24, height: 24, speed: 1.5, direction: 1, frameX: 0 },
      { x: 250, y: 90, width: 24, height: 24, speed: 2, direction: 1, frameX: 0 }
    ];
  }
  
  gameLoop() {
    if (!this.gameStarted) return;
    
    // Check if images are loaded
    if (!this.imagesLoaded) {
      console.warn('Trying to run game loop before images are loaded');
      requestAnimationFrame(() => this.gameLoop());
      return;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    try {
      // Draw background
      this.ctx.drawImage(this.sprites.background, 0, 0, this.canvas.width, this.canvas.height);
      
      // Update
      this.update();
      
      // Draw
      this.draw();
    } catch (error) {
      console.error('Error in game loop:', error);
    }
    
    // Continue loop if game is active
    if (!this.gameOver && !this.levelComplete) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
  update() {
    // Player physics
    this.player.grounded = false;
    
    // Apply controls
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      if (this.player.velX > -this.player.speed) {
        this.player.velX--;
      }
      this.player.facingRight = false;
    }
    
    if (this.keys['ArrowRight'] || this.keys['d']) {
      if (this.player.velX < this.player.speed) {
        this.player.velX++;
      }
      this.player.facingRight = true;
    }
    
    if ((this.keys['ArrowUp'] || this.keys['w']) && !this.player.jumping && this.player.grounded) {
      this.player.jumping = true;
      this.player.grounded = false;
      this.player.velY = -12;
      playPixelSound('jump');
    }
    
    // Apply physics
    this.player.velX *= this.friction;
    this.player.velY += this.gravity;
    
    // Check collisions with platforms
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      
      // Platform collision
      if (this.player.x < platform.x + platform.width &&
          this.player.x + this.player.width > platform.x &&
          this.player.y + this.player.height >= platform.y &&
          this.player.y + this.player.height <= platform.y + platform.height &&
          this.player.velY >= 0) {
        this.player.grounded = true;
        this.player.jumping = false;
        this.player.y = platform.y - this.player.height;
        this.player.velY = 0;
      }
    }
    
    // Update player position
    this.player.x += this.player.velX;
    this.player.y += this.player.velY;
    
    // Screen boundaries
    if (this.player.x < 0) {
      this.player.x = 0;
    } else if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width;
    }
    
    // Fall off bottom
    if (this.player.y > this.canvas.height) {
      this.loseLife();
      playPixelSound('damage');
    }
    
    // Animate player
    if (Math.abs(this.player.velX) > 0.5) {
      if (this.gameLoop % 5 === 0) { // Animate every 5 frames
        this.player.frameX = (this.player.frameX + 1) % 4;
      }
    } else {
      this.player.frameX = 0;
    }
    
    // Update coins
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      
      if (!coin.collected) {
        // Coin animation
        if (game.frameCount % 6 === 0) {
          coin.frameX = (coin.frameX + 1) % 8;
        }
        
        // Check collision
        if (this.player.x < coin.x + coin.width &&
            this.player.x + this.player.width > coin.x &&
            this.player.y < coin.y + coin.height &&
            this.player.y + this.player.height > coin.y) {
          
          // Collect coin
          coin.collected = true;
          this.score += 10;
          document.getElementById('game-score').textContent = this.score;
          playPixelSound('coin');
          
          // Add to global coin count
          window.incrementCoins();
          
          // Check if all coins collected
          if (this.coins.every(c => c.collected)) {
            this.completeLevel();
          }
        }
      }
    }
    
    // Update enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      
      // Move enemy
      enemy.x += enemy.speed * enemy.direction;
      
      // Check platform edges to change direction
      const onPlatform = this.platforms.find(p => 
        enemy.x >= p.x && 
        enemy.x + enemy.width <= p.x + p.width &&
        enemy.y + enemy.height === p.y
      );
      
      if (onPlatform) {
        if (enemy.x <= onPlatform.x || enemy.x + enemy.width >= onPlatform.x + onPlatform.width) {
          enemy.direction *= -1;
        }
      }
      
      // Animate enemy
      if (game.frameCount % 10 === 0) {
        enemy.frameX = (enemy.frameX + 1) % 4;
      }
      
      // Check collision with player
      if (this.player.x < enemy.x + enemy.width &&
          this.player.x + this.player.width > enemy.x &&
          this.player.y < enemy.y + enemy.height &&
          this.player.y + this.player.height > enemy.y) {
        
        // Destroy enemy if jumping on top
        if (this.player.velY > 0 && this.player.y + this.player.height < enemy.y + enemy.height / 2) {
          this.enemies.splice(i, 1);
          this.score += 20;
          document.getElementById('game-score').textContent = this.score;
          this.player.velY = -8; // Bounce
          playPixelSound('enemyDefeat');
        } else {
          // Get hit by enemy
          this.loseLife();
          playPixelSound('damage');
          break;
        }
      }
    }
  }
  
  draw() {
    // Draw platforms
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      this.ctx.drawImage(
        this.sprites.platform, 
        0, 0, 32, 32, 
        platform.x, platform.y, platform.width, platform.height
      );
    }
    
    // Draw coins
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      if (!coin.collected) {
        this.ctx.drawImage(
          this.sprites.coin, 
          coin.frameX * 24, 0, 24, 24, 
          coin.x, coin.y, coin.width, coin.height
        );
      }
    }
    
    // Draw enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      this.ctx.drawImage(
        this.sprites.enemy, 
        enemy.frameX * 24, 0, 24, 24, 
        enemy.x, enemy.y, enemy.width, enemy.height
      );
    }
    
    // Draw player
    const playerDirection = this.player.facingRight ? 0 : 24;
    this.ctx.drawImage(
      this.sprites.player, 
      this.player.frameX * 24, playerDirection, 24, 24, 
      this.player.x, this.player.y, this.player.width, this.player.height
    );
  }
  
  loseLife() {
    this.lives--;
    document.getElementById('game-lives').textContent = this.lives;
    
    if (this.lives <= 0) {
      this.gameOver = true;
      this.showGameOver();
    } else {
      // Reset player position
      this.player.x = 50;
      this.player.y = 300;
      this.player.velX = 0;
      this.player.velY = 0;
    }
  }
  
  completeLevel() {
    this.levelComplete = true;
    
    // Show level complete screen
    const completeScreen = document.createElement('div');
    completeScreen.className = 'level-complete-screen';
    
    const title = document.createElement('h3');
    title.textContent = 'LEVEL COMPLETE!';
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = `You collected all coins and scored ${this.score} points!`;
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'pixel-button';
    restartBtn.textContent = 'PLAY AGAIN';
    restartBtn.addEventListener('click', () => this.restartGame());
    
    completeScreen.appendChild(title);
    completeScreen.appendChild(message);
    completeScreen.appendChild(restartBtn);
    
    document.querySelector('.game-container-platform').appendChild(completeScreen);
    completeScreen.style.display = 'flex';
    
    // Show achievement
    if (typeof showAchievement === 'function') {
      showAchievement('PLATFORMER MASTER!');
    }
  }
  
  showGameOver() {
    // Show game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen';
    
    const title = document.createElement('h3');
    title.textContent = 'GAME OVER';
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = `Final score: ${this.score}`;
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'pixel-button';
    restartBtn.textContent = 'TRY AGAIN';
    restartBtn.addEventListener('click', () => this.restartGame());
    
    gameOverScreen.appendChild(title);
    gameOverScreen.appendChild(message);
    gameOverScreen.appendChild(restartBtn);
    
    document.querySelector('.game-container-platform').appendChild(gameOverScreen);
    gameOverScreen.style.display = 'flex';
  }
}

// Game sound effects
function playGameSound(type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  switch(type) {
    case 'jump':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      }, 50);
      oscillator.stop(audioCtx.currentTime + 0.15);
      break;
    case 'damage':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      }, 100);
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
    case 'enemyDefeat':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      }, 50);
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
  }
}

// Initialize game
let game;
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the game section
  if (document.getElementById('game-canvas')) {
    game = new PlatformGame('game-canvas');
    game.frameCount = 0;
    
    // Animation frame counter
    function updateFrameCount() {
      if (game.gameStarted && !game.gameOver && !game.levelComplete) {
        game.frameCount++;
      }
      requestAnimationFrame(updateFrameCount);
    }
    updateFrameCount();
    
    // Make the game menu item visible when enough coins are collected
    setInterval(() => {
      const gameMenuItem = document.querySelector('.menu-item[data-section="game"]');
      const savedCoins = localStorage.getItem('pixelPortfolioCoins');
      
      if (savedCoins && parseInt(savedCoins) >= 25) {
        gameMenuItem.classList.remove('hidden-item');
        gameMenuItem.removeAttribute('title');
      }
    }, 1000);
  }
});
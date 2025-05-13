// Tambahkan file baru untuk handle parallax yang lebih smooth

function initSmoothParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-bg > div');
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach((el, i) => {
      const speed = 0.1 * (i + 1);
      const yPos = -(scrollY * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  }, { passive: true });
}

// Panggil di main.js setelah DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Existing code...
  initSmoothParallax();
});